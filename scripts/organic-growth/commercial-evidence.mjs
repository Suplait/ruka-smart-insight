import { readPrivateJson } from './lib.mjs';
import { readEvidence } from './evidence-store.mjs';

const age = (value, now) => now - Date.parse(value);
const validTime = (value, now, maxAge) => Number.isFinite(age(value, now)) && age(value, now) >= -300_000 && age(value, now) <= maxAge;
export const CRM_LIST = '901301203866';
export const statusDefinitions = {
  'leads calificados': 'qualified',
  'ppta. comercial enviada': 'proposal',
  'ppta. comercial confirmada': 'proposal',
  clientes: 'customer', facturado: 'customer', won: 'customer',
};
export function publicPage(value) {
  try { const url = new URL(value); return ['www.ruka.ai', 'ruka.ai'].includes(url.hostname) && url.protocol === 'https:' ? url.pathname : null; } catch { return null; }
}
export function channel(row, prefix = 'first_touch') {
  const medium = String(row[`${prefix}_utm_medium`] || '').toLowerCase();
  if (['cpc', 'ppc', 'paid', 'paid_social', 'paid_search', 'display'].includes(medium)) return 'paid';
  if (medium === 'organic') return 'organic_tagged';
  if (medium) return 'other_tagged';
  let host = '';
  try { host = new URL(row[`${prefix}_referrer_origin`]).hostname; } catch { /* absent is not direct */ }
  if (['chatgpt.com', 'chat.openai.com', 'perplexity.ai', 'www.perplexity.ai', 'claude.ai', 'gemini.google.com'].includes(host)) return 'ai_referral';
  if (/^(?:www\.)?(?:google\.(?:com|cl)|bing\.com|duckduckgo\.com|search\.yahoo\.com)$/.test(host)) return 'search_referral';
  return host ? 'other_referral' : 'unknown';
}

/** Cohort = persisted submissions in source window; not visitors, people or accounts. */
export function commercialEvidence(source, crm, now = Date.now()) {
  if (source?.state !== 'ok' || !validTime(source.capturedAt, now, 36 * 3600_000)) return { state: 'unavailable', reason: 'Lead source missing, failed or older than 36h. Unknown is not zero.' };
  if (!Array.isArray(source.submissions) || !Array.isArray(source.meetings)) throw new Error('Invalid commercial source');
  const rows = [...new Map(source.submissions.map(row => [row.id, row])).values()];
  const crmFresh = crm?.listId === CRM_LIST && validTime(crm.capturedAt, now, 7 * 86400_000) && Array.isArray(crm.tasks);
  const tasks = new Map(crmFresh ? crm.tasks.filter(task => task.listId === CRM_LIST && validTime(task.observedAt, now, 7 * 86400_000)).map(task => [task.id, task]) : []);
  const uniqueMeetings = [...new Map(source.meetings.map(row => [row.invitee_uri, row])).values()];
  const booked = new Set(uniqueMeetings.filter(row => row.status === 'active' && ['calendly', 'reconciliation'].includes(row.source)).map(row => row.submission_id).filter(Boolean));
  const groups = new Map();
  for (const row of rows) {
    const page = publicPage(row.first_touch_page) || 'unknown';
    const sourceChannel = channel(row);
    const key = JSON.stringify([row.funnel, page, sourceChannel]);
    if (!groups.has(key)) groups.set(key, { funnel: row.funnel, firstTouchPage: page, channel: sourceChannel, submissions: 0, submissionsWithActiveVerifiedMeeting: source.calendarCoverage?.[row.funnel] === 'verified_reader' ? 0 : null, crmTasks: new Map(), linkedTaskIds: new Set() });
    const group = groups.get(key); group.submissions++;
    if (row.clickup_task_id) group.linkedTaskIds.add(row.clickup_task_id);
    if (group.submissionsWithActiveVerifiedMeeting !== null && booked.has(row.id)) group.submissionsWithActiveVerifiedMeeting++;
    const task = tasks.get(row.clickup_task_id);
    if (task) group.crmTasks.set(task.id, task.status);
  }
  const linkedIds = new Set(rows.map(row => row.clickup_task_id).filter(Boolean));
  const observedTasks = [...linkedIds].filter(id => tasks.has(id));
  return {
    schemaVersion: 1, state: 'ok', capturedAt: source.capturedAt, windowStart: source.windowStart, windowEnd: source.windowEnd,
    source: source.source, grain: 'distinct persisted submission; CRM current states counted by distinct task separately',
    submissions: rows.length, excludedExplicitTests: source.excludedTests, coverage: source.coverage,
    attributionKnown: rows.filter(row => publicPage(row.first_touch_page)).length,
    crm: { state: crmFresh ? 'observed' : 'unavailable', linkedTasks: linkedIds.size, observedTasks: observedTasks.length, coverageComplete: crmFresh && observedTasks.length === linkedIds.size, currentStates: crmFresh ? Object.fromEntries(['qualified', 'proposal', 'customer'].map(stage => [stage, observedTasks.filter(id => statusDefinitions[tasks.get(id).status] === stage).length])) : null },
    groups: [...groups.values()].map(({ crmTasks, linkedTaskIds, ...group }) => ({ ...group, linkedCrmTasks: linkedTaskIds.size, observedCrmTasks: crmTasks.size, crmCoverageComplete: crmFresh && crmTasks.size === linkedTaskIds.size, observedCrmStates: crmFresh ? Object.fromEntries(['qualified', 'proposal', 'customer'].map(stage => [stage, [...crmTasks.values()].filter(status => statusDefinitions[status] === stage).length])) : null })),
    closedMrr: null,
    caveats: [
      'First touch is browser-observed and partial, not causal attribution. Search referrals are not proof of an unpaid click.',
      'No division by GSC clicks: search clicks and captured submissions have different populations.',
      'Legacy leads without attribution are coverage gaps, not organic leads or zero conversions.',
      'Known explicit test domains excluded; other QA cannot be identified reliably without an explicit flag.',
      'CRM states are the current recorded state, not historical stage transitions. Repeated submissions may share one task.',
      'CRM counts cover only observed linked tasks. Incomplete coverage is not zero sales. One task can belong to several page cohorts; do not sum group counts as distinct customers.',
      'An active verified booking is not attendance or qualification. One calendar coverage is unavailable.',
      'No verified billing source: closed MRR remains unknown, never estimated from public plan prices.',
    ],
  };
}
export async function readCommercialEvidence() {
  const safeRead = name => readPrivateJson(name).catch(() => null);
  const [source, crm] = await Promise.all([safeRead('commercial-source.json'), readEvidence('commercial-crm.json').catch(error => { if (error.code === 'ENOENT') return null; throw error; })]);
  return commercialEvidence(source, crm);
}
