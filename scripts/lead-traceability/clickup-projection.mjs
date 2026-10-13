// Pure projection also embedded verbatim in the independent n8n consumer.
export const CLICKUP_LIST = '901301203866';
export const CLICKUP_FIELD = 'e40a83ca-2acc-4103-ac62-cbf5ab7563e0';
const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const obj = v => v && typeof v === 'object' && !Array.isArray(v) ? v : {};
const text = (v, max = 250) => typeof v === 'string' ? v.replace(/[\r\n\u0000-\u001f]/g, ' ').trim().slice(0, max) : '';
const page = v => {
  const raw = text(v, 2000);
  if (raw.startsWith('/') && !raw.startsWith('//')) return raw.split(/[?#]/)[0].slice(0, 300);
  try { const url = new URL(raw); return ['https:', 'http:'].includes(url.protocol) ? `${url.origin}${url.pathname}`.slice(0, 300) : ''; }
  catch { return ''; }
};
const date = v => {
  const d = new Date(text(v));
  return Number.isNaN(d.getTime()) ? 'Fecha no disponible' : new Intl.DateTimeFormat('es-CL', {
    timeZone: 'America/Santiago', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(d) + ' (Chile)';
};
const touch = (label, v) => {
  const t = obj(v);
  return [label, ...utmKeys.filter(k => text(t[k])).map(k => `${k}: ${text(t[k])}`),
    page(t.page) ? `Página: ${page(t.page)}` : '', page(t.referrer_origin) ? `Referencia: ${page(t.referrer_origin)}` : '',
  ].filter(Boolean).join('\n');
};

export function clickupText(job) {
  const submissions = Array.isArray(job.submissions) ? job.submissions.slice(0, 10) : [];
  const lines = ['Trazabilidad de captación', `${Number.isSafeInteger(job.submission_count) ? job.submission_count : submissions.length} envíos asociados · se muestran hasta 10 recientes.`];
  for (const s of submissions) {
    const a = obj(s.attribution);
    lines.push('', `${s.funnel === 'one' ? 'One' : 'Clásico'} · Lead ${Number.isSafeInteger(s.lead_id) ? s.lead_id : 'sin ID'} · ${date(s.created_at)}`,
      `Submission: ${text(s.submission_id, 36)}`);
    if (a.version === 1) {
      lines.push(touch('Primera entrada', a.first_touch), touch('Entrada de esta sesión', a.session_entry));
      if (Object.keys(obj(a.last_non_direct_touch)).length) lines.push(touch('Último contacto no directo', a.last_non_direct_touch));
      lines.push(`Conversión: ${page(a.conversion_page || s.conversion_page) || 'No disponible'}`);
      const pages = Array.isArray(a.observed_pages) ? a.observed_pages.slice(-5).map(p => page(obj(p).page)).filter(Boolean) : [];
      if (pages.length) lines.push(`Recorrido observado (parcial): ${pages.join(' → ')}`);
      const touches = [a.first_touch, a.session_entry, a.last_non_direct_touch].map(obj);
      lines.push(`Clic Google: ${touches.some(t => ['gclid', 'gbraid', 'wbraid'].some(k => text(t[k]))) ? 'identificador presente' : 'no capturado'}`,
        `Clic Meta: ${touches.some(t => text(t.fbclid)) ? 'identificador presente' : 'no capturado'}`,
        `Consentimiento analytics: ${['granted', 'denied'].includes(a.analytics_consent) ? a.analytics_consent : 'unknown'}`);
    } else {
      lines.push(touch('Atribución histórica parcial', s.legacy_utms), `Conversión: ${page(s.conversion_page) || 'No disponible'}`);
    }
    if (Number.isFinite(s.invoice_count)) lines.push(`Volumen registrado: ${s.invoice_count} facturas/mes`);
  }
  const meetings = Array.isArray(job.meetings) ? job.meetings : [];
  const active = meetings.filter(m => m.status === 'active');
  const history = lines.join('\n');
  const summary = history.length > 22000 ? history.slice(0, 22000) + '\n[Detalle del historial acotado]' : history;
  lines.length = 0;
  lines.push(summary, '', 'Agenda confirmada por Calendly');
  if (active.length) lines.push(...active.slice(0, 3).map(m => `Confirmada: ${date(m.starts_at)}`));
  else lines.push(meetings.length ? 'Agenda cancelada; sin otra reunión confirmada.' : 'Sin agenda confirmada hasta ahora.');
  return lines.join('\n').slice(0, 24000);
}

export function clickupAck(job, error = null, retryAfter = null) {
  return { p_id: job.delivery.id, p_lease: job.delivery.lease_id, p_revision: job.delivery.revision,
    p_error: error, p_retry_after: retryAfter };
}

export function prepareClickupUpdate(job, response, now = Date.now()) {
  const finish = (error, retryAfter = null) => ({ action: 'finish', ack: clickupAck(job, error, retryAfter) });
  if (job.list_id !== CLICKUP_LIST || job.field_id !== CLICKUP_FIELD || !/^[a-zA-Z0-9]{1,50}$/.test(job.task_id)) return finish('clickup_invalid_destination');
  // Leave enough time for the bounded HTTP write and acknowledgement.
  if (!(Date.parse(job.delivery.lease_until) > now + 15000)) return finish('clickup_lease_expiring');
  if (response?.statusCode === 429) return finish('clickup_rate_limited', Math.min(3600, Math.max(60, Number(response.headers?.['retry-after']) || 60)));
  if (response?.statusCode !== 200) return finish('clickup_read_failed');
  const task = obj(response.body);
  if (task.id !== job.task_id || obj(task.list).id !== CLICKUP_LIST || task.archived || task.parent) return finish('clickup_task_mismatch');
  const field = Array.isArray(task.custom_fields) ? task.custom_fields.find(f => f.id === CLICKUP_FIELD) : null;
  if (!field || field.type !== 'text') return finish('clickup_field_missing');
  const value = clickupText(job);
  // A retry after an uncertain HTTP write does not write the same field twice.
  if (field.value === value) return finish(null);
  return { action: 'write', task_id: job.task_id, field_id: CLICKUP_FIELD, value, ack: clickupAck(job) };
}

export function finishClickupWrite(prepared, response) {
  const success = response?.statusCode >= 200 && response.statusCode < 300 && !response.body?.err && !response.body?.error;
  return { ack: { ...prepared.ack, p_error: success ? null : response?.statusCode === 429 ? 'clickup_rate_limited' : 'clickup_write_failed',
    p_retry_after: response?.statusCode === 429 ? Math.min(3600, Math.max(60, Number(response.headers?.['retry-after']) || 60)) : null } };
}
