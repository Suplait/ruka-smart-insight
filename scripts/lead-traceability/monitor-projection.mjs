export const labels = {
  source_unavailable: 'No se pudo consultar Supabase',
  enrichment_stale: 'Worker Slack/ClickUp sin actividad confirmada en 10 minutos',
  persistence_failed: 'Formularios cuya persistencia falló',
  persistence_unconfirmed: 'Avisos de formulario sin persistencia confirmada después de 10 minutos',
  slack_overdue: 'Actualizaciones Slack pendientes por más de 5 minutos',
  clickup_overdue: 'Leads clásicos sin entrega ClickUp después de 5 minutos',
  deliveries_exhausted: 'Entregas con reintentos agotados',
  calendar_reader_stale: 'Reconciliación de Mauro atrasada o con reintentos agotados',
  recent_meetings_unmatched: 'Reuniones de los últimos 7 días sin lead asociado',
};

export function monitorObservation(response, now) {
  const body = response?.body;
  const keys = Object.keys(labels).filter(key => key !== 'source_unavailable');
  const valid = response?.statusCode === 200 && body?.version === 1 &&
    Number.isFinite(Date.parse(body.observed_at)) && Math.abs(now - Date.parse(body.observed_at)) < 120000 &&
    keys.every(key => Number.isSafeInteger(body.counts?.[key]) && body.counts[key] >= 0);
  const counts = valid ? Object.fromEntries(keys.map(key => [key, body.counts[key]])) : { source_unavailable: 1 };
  const incidents = Object.keys(counts).filter(key => counts[key] > 0).sort();
  return { counts, incidents, fingerprint: incidents.join('|') || 'healthy' };
}

export function monitorDecision(response, state, now) {
  const observation = monitorObservation(response, now);
  if (state.nextAttemptAt > now) return null;
  // Changes in counts do not repeatedly notify an unchanged incident.
  if (observation.fingerprint === (state.notifiedFingerprint || 'healthy')) return null;
  const previous = (state.notifiedFingerprint || 'healthy').split('|');
  const isNewIncident = observation.incidents.some(key => !previous.includes(key));
  const recovery = observation.fingerprint === 'healthy';
  if (!recovery && !isNewIncident && state.lastSentAt + 30 * 60000 > now) return null;
  // Suppress rapid healthy/problem flapping after an acknowledged recovery.
  if (!recovery && state.notifiedFingerprint === 'healthy' && state.lastProblemSentAt + 30 * 60000 > now) return null;
  const detail = recovery ? 'Las comprobaciones vuelven a estar dentro de sus umbrales.' :
    observation.incidents.map(key => `• ${labels[key]}: ${observation.counts[key]}`).join('\n');
  const text = `${recovery ? '✅ Trazabilidad recuperada' : '⚠️ Revisar trazabilidad de leads'}\n${detail}\n` +
    'Responsable: equipo Ruka de captación.\n' +
    'Revisar: https://github.com/Suplait/ruka-smart-insight/blob/codex/lead-traceability-closeout/docs/lead-traceability-alerts.md\n' +
    'Este aviso no ejecuta llamadas, crea tareas ni reenvía conversiones.';
  return { fingerprint: observation.fingerprint, text, recovery, observedAt: new Date(now).toISOString() };
}

export function monitorAcknowledge(response, notification, state, now) {
  if (response?.ok === true && typeof response.message_timestamp === 'string' && /^\d+\.\d+$/.test(response.message_timestamp)) {
    state.notifiedFingerprint = notification.fingerprint;
    state.lastSentAt = now;
    if (!notification.recovery) state.lastProblemSentAt = now;
    state.nextAttemptAt = 0;
    state.lastDelivery = 'confirmed';
  } else {
    // A timeout may have sent the alert. Slow retries limit duplicates and noise.
    state.nextAttemptAt = now + 30 * 60000;
    state.lastDelivery = 'unconfirmed';
  }
  return { delivered: state.lastDelivery === 'confirmed', retryAfter: state.nextAttemptAt || null };
}
