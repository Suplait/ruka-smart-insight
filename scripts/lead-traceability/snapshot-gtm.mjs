import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

// Raw exports stay private. Preserve exact configuration fingerprints without
// copying custom JavaScript, template secrets, or user data into the repository.
const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error('Usage: node snapshot-gtm.mjs <private-export.json> <snapshot.json>');
const source = JSON.parse(readFileSync(input, 'utf8'));
const version = source.containerVersion;
if (!version?.container?.publicId || !version.containerVersionId) throw new Error('A versioned GTM export is required');
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const hash = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
const parameters = value => Object.fromEntries((value || []).map(p => [p.key, p.value ?? p.list ?? p.map]));
const safeKeys = new Set(['eventName', 'measurementIdOverride', 'tagId', 'conversionId', 'conversionLabel', 'sendEcommerceData', 'enhancedUserId', 'conversionCookiePrefix', 'enableShippingData', 'rdp']);
const snapshot = {
  container: version.container.publicId,
  containerId: version.containerId,
  version: version.containerVersionId,
  versionName: version.name ?? null,
  sourceUrl: version.tagManagerUrl,
  configurationSha256: hash(version),
  tags: (version.tag || []).map(tag => {
    const p = parameters(tag.parameter);
    return {
      id: tag.tagId, name: tag.name, type: tag.type, paused: tag.paused === true,
      firing: tag.firingTriggerId || [], blocking: tag.blockingTriggerId || [],
      firingOption: tag.tagFiringOption ?? null,
      consent: tag.consentSettings ?? null,
      settings: Object.fromEntries(Object.entries(p).filter(([key]) => safeKeys.has(key))),
      eventParameters: (p.eventSettingsTable || []).map(row => parameters(row.map)),
      parameterKeys: Object.keys(p),
      pixelCalls: [...(p.html || '').matchAll(/fbq\(\s*['"](init|track|trackCustom)['"]\s*,\s*['"]([a-zA-Z0-9_]+)['"]/g)].map(m => ({ method: m[1], value: m[2] })),
      configurationSha256: hash(tag),
    };
  }),
  triggers: (version.trigger || []).map(t => ({ id: t.triggerId, name: t.name, type: t.type,
    eventFilters: t.customEventFilter || [], filters: t.filter || [], configurationSha256: hash(t) })),
  variables: (version.variable || []).map(v => ({ id: v.variableId, name: v.name, type: v.type, configurationSha256: hash(v) })),
  clients: (version.client || []).map(c => ({ id: c.clientId, name: c.name, type: c.type, configurationSha256: hash(c) })),
  templates: (version.customTemplate || []).map(t => ({ name: t.name, configurationSha256: hash(t) })),
};
writeFileSync(output, JSON.stringify(snapshot, null, 2) + '\n');
console.log(`${snapshot.container} version ${snapshot.version}: ${snapshot.tags.length} tags, ${snapshot.triggers.length} triggers, ${snapshot.clients.length} clients`);
