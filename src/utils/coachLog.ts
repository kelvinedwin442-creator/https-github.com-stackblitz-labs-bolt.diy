/**
 * Coach log — the only measurement in the whole product, and it never leaves the phone.
 *
 * Why it exists: a coach who runs 3 sessions a week and can see "41 sessions, 1,260
 * minutes, 96 players" keeps going. An academy that has to show evidence of what it does
 * (or a course tutor who has to mark a learner) needs the same numbers in a form they can
 * send. Both happen with a text file and WhatsApp — no server, no analytics, no personal
 * data about the children.
 */

export interface LogEntry {
  id: string;
  /** ISO date of the session, not of the log tap */
  date: string;
  drillId?: string;
  title: string;
  band?: string;
  minutes: number;
  players: number;
  note?: string;
}

const LOG_KEY = 'coachkit_log_v1';

export function getLog(): LogEntry[] {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LogEntry[]) : [];
  } catch {
    return [];
  }
}

function persist(entries: LogEntry[]): void {
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify(entries));
  } catch {
    /* file:// or private mode: the log lives for this session only */
  }
}

export function addLog(entry: Omit<LogEntry, 'id'>): LogEntry[] {
  const full: LogEntry = { ...entry, id: `log-${Date.now()}-${Math.round(Math.random() * 1000)}` };
  const next = [full, ...getLog()].slice(0, 800);
  persist(next);
  return next;
}

export function removeLog(id: string): LogEntry[] {
  const next = getLog().filter((e) => e.id !== id);
  persist(next);
  return next;
}

export function clearLog(): void {
  persist([]);
}

export interface LogSummary {
  sessions: number;
  minutes: number;
  playerSlots: number;
  distinctDrills: number;
  last7: number;
  since: string | null;
  until: string | null;
  topDrills: { title: string; count: number }[];
}

export function summarise(entries: LogEntry[] = getLog()): LogSummary {
  const minutes = entries.reduce((sum, e) => sum + (e.minutes || 0), 0);
  const playerSlots = entries.reduce((sum, e) => sum + (e.players || 0), 0);
  const drills = new Map<string, number>();
  entries.forEach((e) => {
    const key = e.title.replace(/\s*\(.*\)$/, '');
    drills.set(key, (drills.get(key) ?? 0) + 1);
  });
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const dates = entries.map((e) => e.date).sort();
  return {
    sessions: entries.length,
    minutes,
    playerSlots,
    distinctDrills: drills.size,
    last7: entries.filter((e) => new Date(e.date).getTime() >= weekAgo).length,
    since: dates[0] ?? null,
    until: dates[dates.length - 1] ?? null,
    topDrills: [...drills.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([title, count]) => ({ title, count })),
  };
}

export function summaryToText(entries: LogEntry[] = getLog()): string {
  const s = summarise(entries);
  const lines: string[] = [];
  lines.push('COACH LOG — Tactical Coach / Coach Kit');
  if (s.since && s.until) lines.push(`${s.since.slice(0, 10)} to ${s.until.slice(0, 10)}`);
  lines.push('');
  lines.push(`Sessions run:        ${s.sessions}`);
  lines.push(`Coaching minutes:    ${s.minutes}`);
  lines.push(`Player attendances:  ${s.playerSlots}`);
  lines.push(`Different drills:    ${s.distinctDrills}`);
  lines.push(`Sessions last 7 days:${s.last7 ? ' ' + s.last7 : ' 0'}`);
  if (s.topDrills.length) {
    lines.push('');
    lines.push('Most used:');
    s.topDrills.forEach((d) => lines.push(`  ${d.count}x  ${d.title}`));
  }
  if (entries.length) {
    lines.push('');
    lines.push('Detail:');
    entries
      .slice(0, 40)
      .forEach((e) =>
        lines.push(`  ${e.date.slice(0, 10)}  ${e.minutes}min  ${e.players}p  ${e.title}${e.note ? ' — ' + e.note : ''}`)
      );
  }
  lines.push('');
  lines.push('Logged offline on the coach phone. Nothing was uploaded.');
  return lines.join('\n');
}

export function downloadLogText(): void {
  const text = summaryToText();
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `coach_log_${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Share the log as text — on Android this lands in the WhatsApp share sheet. */
export async function shareLog(): Promise<'shared' | 'copied' | 'failed'> {
  const text = summaryToText();
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Coach log', text });
      return 'shared';
    }
  } catch {
    /* user dismissed the sheet — fall through to copy */
  }
  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    downloadLogText();
    return 'failed';
  }
}
