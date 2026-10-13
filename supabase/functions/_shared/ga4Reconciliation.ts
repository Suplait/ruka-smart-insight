// Aggregate read-only reconciliation. These counts are never individual receipts.
export const ga4Events = ['page_view', 'registration_success', 'lead_created',
  'calendly_event_scheduled', 'calendly_group_scheduled', 'one_contact_view',
  'one_lead_created', 'one_calendly_scheduled'] as const;
export const ga4Property = '478868017';
export const ga4Stream = '10287402959';
export const ga4Timezone = 'America/Santiago';
export type DailyCounts = { date: string; sessions: number; events: Record<string, number> };

export function shiftDate(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
export function ga4Window(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: ga4Timezone,
    year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const part = (name: string) => parts.find(p => p.type === name)!.value;
  const today = `${part('year')}-${part('month')}-${part('day')}`;
  // Scheduled at 09:00 Santiago: the newest completed day is >48h old,
  // including the DST transition. No current/previous-day comparisons.
  const end = shiftDate(today, -3);
  return { start: shiftDate(end, -28), end };
}
export function ga4ReportRequest(window: { start: string; end: string }, traffic: boolean) {
  const stream = { filter: { fieldName: 'streamId', stringFilter: { value: ga4Stream, matchType: 'EXACT' } } };
  return {
    dateRanges: [{ startDate: window.start, endDate: window.end }],
    dimensions: traffic ? [{ name: 'date' }] : [{ name: 'date' }, { name: 'eventName' }],
    metrics: [{ name: traffic ? 'sessions' : 'eventCount' }],
    dimensionFilter: traffic ? stream : { andGroup: { expressions: [stream,
      { filter: { fieldName: 'eventName', inListFilter: { values: ga4Events } } }] } },
    limit: '1000',
  };
}
type Report = {
  dimensionHeaders?: { name: string }[]; metricHeaders?: { name: string }[];
  rows?: { dimensionValues?: { value?: string }[]; metricValues?: { value?: string }[] }[];
  rowCount?: number;
  metadata?: { timeZone?: string; subjectToThresholding?: boolean;
    dataLossFromOtherRow?: boolean; samplingMetadatas?: unknown[] };
};
export function parseGa4Reports(window: { start: string; end: string }, events: Report, traffic: Report): DailyCounts[] {
  const days = new Map<string, DailyCounts>();
  for (let date = window.start; date <= window.end; date = shiftDate(date, 1)) {
    if (days.size >= 29) throw new Error('invalid_window');
    days.set(date, { date, sessions: 0, events: Object.fromEntries(ga4Events.map(name => [name, 0])) });
  }
  for (const [report, isTraffic] of [[events, false], [traffic, true]] as const) {
    if (report.metadata?.timeZone !== ga4Timezone) throw new Error('ga4_timezone_mismatch');
    if (report.metadata.subjectToThresholding || report.metadata.dataLossFromOtherRow || report.metadata.samplingMetadatas?.length) {
      throw new Error('ga4_data_limited');
    }
    if (report.rowCount !== undefined && report.rowCount !== (report.rows?.length ?? 0)) throw new Error('ga4_incomplete_report');
    if (JSON.stringify(report.dimensionHeaders?.map(h => h.name)) !== JSON.stringify(isTraffic ? ['date'] : ['date', 'eventName']) ||
        report.metricHeaders?.length !== 1 || report.metricHeaders[0].name !== (isTraffic ? 'sessions' : 'eventCount')) throw new Error('ga4_schema_mismatch');
    const seen = new Set<string>();
    for (const row of report.rows ?? []) {
      const rawDate = row.dimensionValues?.[0]?.value ?? '';
      const event = isTraffic ? 'sessions' : row.dimensionValues?.[1]?.value ?? '';
      const date = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
      const rawCount = row.metricValues?.[0]?.value ?? '';
      const count = Number(rawCount);
      if (!/^\d{8}$/.test(rawDate) || !days.has(date) || !/^\d+$/.test(rawCount) || !Number.isSafeInteger(count) ||
          (!isTraffic && !(ga4Events as readonly string[]).includes(event)) || seen.has(date + event)) throw new Error('ga4_invalid_row');
      seen.add(date + event);
      const day = days.get(date)!;
      if (isTraffic) day.sessions = count; else day.events[event] = count;
    }
  }
  return [...days.values()];
}

export function assessGa4Volume(days: DailyCounts[]) {
  const current = days.at(-1);
  if (!current) throw new Error('missing_days');
  const baseline = [7, 14, 21, 28].map(offset => days.find(d => d.date === shiftDate(current.date, -offset)));
  const average = (get: (d: DailyCounts) => number) => baseline.reduce((sum, d) => sum + get(d!), 0) / 4;
  const results: { signal: string; state: string; observed: number; expected: number | null }[] = [];
  for (const signal of ['sessions', 'registration_success', 'lead_created', 'one_lead_created']) {
    const get = (d: DailyCounts) => signal === 'sessions' ? d.sessions : d.events[signal];
    const covered = baseline.every(Boolean) && (signal !== 'one_lead_created' || baseline.every(d => d!.date >= '2026-10-14'));
    const observed = get(current);
    if (!covered) { results.push({ signal, state: 'insufficient_history', observed, expected: null }); continue; }
    const baselineTraffic = average(d => d.sessions);
    const baselineCount = average(get);
    // Conservative initial thresholds. A low-traffic day alone is not a funnel failure.
    const expected = signal === 'sessions' ? baselineTraffic : baselineTraffic ? baselineCount * current.sessions / baselineTraffic : 0;
    const enough = baselineTraffic >= 100 && (signal === 'sessions' || (current.sessions >= 100 && baselineCount >= 10 && expected >= 10));
    results.push({ signal, state: !enough ? 'insufficient_volume' : observed < expected * 0.3 ? 'drop' : 'within_threshold', observed, expected });
  }
  return results;
}
