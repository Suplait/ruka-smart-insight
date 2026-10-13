const step0 = trigger({
  "type": "n8n-nodes-base.scheduleTrigger",
  "version": 1.4,
  "config": {
    "name": "Cada cinco minutos",
    "parameters": {
      "rule": {
        "interval": [
          {
            "field": "minutes",
            "minutesInterval": 5
          }
        ]
      }
    }
  },
  "output": [
    {
      "timestamp": "2026-10-13T22:00:00Z"
    }
  ]
});
const step1 = trigger({
  "type": "n8n-nodes-base.manualTrigger",
  "version": 1,
  "config": {
    "name": "Comprobar monitor",
    "parameters": {}
  },
  "output": [
    {}
  ]
});
const step2 = node({
  "type": "n8n-nodes-base.httpRequest",
  "version": 4.2,
  "config": {
    "name": "Leer salud de trazabilidad",
    "parameters": {
      "method": "POST",
      "url": "https://rmxzryueysmzksmvpwpv.supabase.co/rest/v1/rpc/trace_monitor_snapshot",
      "authentication": "predefinedCredentialType",
      "nodeCredentialType": "supabaseApi",
      "sendBody": true,
      "specifyBody": "json",
      "jsonBody": "{}",
      "options": {
        "timeout": 15000,
        "response": {
          "response": {
            "fullResponse": true,
            "responseFormat": "json"
          }
        }
      }
    },
    "credentials": {
      "supabaseApi": {
        "id": "i80JbcEXhgCsijsU",
        "name": "Supabase account"
      }
    },
    "onError": "continueRegularOutput"
  },
  "output": [
    {
      "statusCode": 200,
      "body": {
        "version": 1,
        "observed_at": "2026-10-13T22:00:00Z",
        "counts": {}
      }
    }
  ]
});
const step3 = node({
  "type": "n8n-nodes-base.code",
  "version": 2,
  "config": {
    "name": "Decidir aviso",
    "parameters": {
      "jsCode": "const labels={\"ga4_source_unavailable\":\"Conciliación GA4 fallida o sin lectura confirmada en 36 horas\",\"ga4_volume_drop\":\"Señales GA4 con caída frente al mismo día semanal, ajustadas por tráfico; revisar conciliación agregada\",\"source_unavailable\":\"No se pudo consultar Supabase\",\"enrichment_stale\":\"Worker Slack/ClickUp sin actividad confirmada en 10 minutos\",\"persistence_failed\":\"Formularios cuya persistencia falló\",\"persistence_unconfirmed\":\"Avisos de formulario sin persistencia confirmada después de 10 minutos\",\"slack_overdue\":\"Actualizaciones Slack pendientes por más de 5 minutos\",\"clickup_overdue\":\"Leads clásicos sin entrega ClickUp después de 5 minutos\",\"deliveries_exhausted\":\"Entregas con reintentos agotados\",\"calendar_reader_stale\":\"Reconciliación de Mauro atrasada o con reintentos agotados\",\"recent_meetings_unmatched\":\"Reuniones de los últimos 7 días sin lead asociado\"};\nfunction monitorObservation(response, now) {\n  const body = response?.body;\n  const keys = Object.keys(labels).filter(key => key !== 'source_unavailable');\n  const valid = response?.statusCode === 200 && body?.version === 1 &&\n    Number.isFinite(Date.parse(body.observed_at)) && Math.abs(now - Date.parse(body.observed_at)) < 120000 &&\n    keys.every(key => Number.isSafeInteger(body.counts?.[key]) && body.counts[key] >= 0);\n  const counts = valid ? Object.fromEntries(keys.map(key => [key, body.counts[key]])) : { source_unavailable: 1 };\n  const incidents = Object.keys(counts).filter(key => counts[key] > 0).sort();\n  return { counts, incidents, fingerprint: incidents.join('|') || 'healthy' };\n}\nfunction monitorDecision(response, state, now) {\n  const observation = monitorObservation(response, now);\n  if (state.nextAttemptAt > now) return null;\n  // Changes in counts do not repeatedly notify an unchanged incident.\n  if (observation.fingerprint === (state.notifiedFingerprint || 'healthy')) return null;\n  const previous = (state.notifiedFingerprint || 'healthy').split('|');\n  const isNewIncident = observation.incidents.some(key => !previous.includes(key));\n  const recovery = observation.fingerprint === 'healthy';\n  if (!recovery && !isNewIncident && state.lastSentAt + 30 * 60000 > now) return null;\n  // Suppress rapid healthy/problem flapping after an acknowledged recovery.\n  if (!recovery && state.notifiedFingerprint === 'healthy' && state.lastProblemSentAt + 30 * 60000 > now) return null;\n  const detail = recovery ? 'Las comprobaciones vuelven a estar dentro de sus umbrales.' :\n    observation.incidents.map(key => `• ${labels[key]}: ${observation.counts[key]}`).join('\\n');\n  const text = `${recovery ? '✅ Trazabilidad recuperada' : '⚠️ Revisar trazabilidad de leads'}\\n${detail}\\n` +\n    'Responsable: equipo Ruka de captación.\\n' +\n    'Revisar: https://github.com/Suplait/ruka-smart-insight/blob/main/docs/lead-traceability-alerts.md\\n' +\n    'Este aviso no ejecuta llamadas, crea tareas ni reenvía conversiones.';\n  return { fingerprint: observation.fingerprint, text, recovery, observedAt: new Date(now).toISOString() };\n}\nconst state=$getWorkflowStaticData('global'); const now=Date.now(); state.lastCheckedAt=now; const notification=monitorDecision($input.first().json,state,now); return notification ? [{json:notification}] : [];",
      "mode": "runOnceForAllItems"
    }
  },
  "output": [
    {
      "fingerprint": "slack_overdue",
      "text": "Revisar trazabilidad",
      "recovery": false,
      "observedAt": "2026-10-13T22:00:00Z"
    }
  ]
});
const step4 = node({
  "type": "n8n-nodes-base.slack",
  "version": 2.3,
  "config": {
    "name": "Avisar en Slack",
    "parameters": {
      "resource": "message",
      "operation": "post",
      "authentication": "accessToken",
      "select": "channel",
      "channelId": {
        "__rl": true,
        "mode": "id",
        "value": "C08DUJ6V2G6"
      },
      "messageType": "text",
      "text": expr('{{ $json.text }}'),
      "otherOptions": {
        "includeLinkToWorkflow": true,
        "unfurl_links": false,
        "unfurl_media": false,
        "link_names": false
      }
    },
    "credentials": {
      "slackApi": {
        "id": "xVJhrlL8hV1pNKmC",
        "name": "slack-as-bot"
      }
    },
    "onError": "continueRegularOutput"
  },
  "output": [
    {
      "ok": true,
      "message_timestamp": "1.2",
      "channel": "C08DUJ6V2G6"
    }
  ]
});
const step5 = node({
  "type": "n8n-nodes-base.code",
  "version": 2,
  "config": {
    "name": "Confirmar aviso",
    "parameters": {
      "jsCode": "function monitorAcknowledge(response, notification, state, now) {\n  if (response?.ok === true && typeof response.message_timestamp === 'string' && /^\\d+\\.\\d+$/.test(response.message_timestamp)) {\n    state.notifiedFingerprint = notification.fingerprint;\n    state.lastSentAt = now;\n    if (!notification.recovery) state.lastProblemSentAt = now;\n    state.nextAttemptAt = 0;\n    state.lastDelivery = 'confirmed';\n  } else {\n    // A timeout may have sent the alert. Slow retries limit duplicates and noise.\n    state.nextAttemptAt = now + 30 * 60000;\n    state.lastDelivery = 'unconfirmed';\n  }\n  return { delivered: state.lastDelivery === 'confirmed', retryAfter: state.nextAttemptAt || null };\n}\nconst state=$getWorkflowStaticData('global'); return [{json:monitorAcknowledge($input.first().json,$('Decidir aviso').first().json,state,Date.now())}];",
      "mode": "runOnceForAllItems"
    }
  },
  "output": [
    {
      "delivered": true,
      "retryAfter": null
    }
  ]
});
export default workflow('lead-traceability-monitor', 'Trazabilidad leads · Alertas')
  .add(step0).to(step2).to(step3).to(step4).to(step5)
  .add(step1).to(step2);
