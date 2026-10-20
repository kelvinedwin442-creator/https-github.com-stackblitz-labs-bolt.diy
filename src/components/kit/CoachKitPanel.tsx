import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Search,
  X,
  Play,
  Share2,
  Copy,
  Check,
  Clipboard,
  Download,
  Smartphone,
  Users,
  Clock,
  AlertTriangle,
  ListChecks,
  Send,
  Trash2,
  Radio,
  Layers,
} from 'lucide-react';
import { Session } from '../../types/tactics';
import { DRILLS, Drill, AGE_BANDS, DRILL_THEMES, AgeBand, DrillTheme, sessionFromDrill } from '../../data/drills';
import { LANGUAGES, t } from '../../i18n/kit';
import { useKitSettings, defaultMarkingSize } from '../../utils/kitSettings';
import { CueRecorder } from './CueRecorder';
import { cueKeyFor } from '../../utils/voiceNotes';
import { drillCardDataUrl, shareDrillCard, drillToText } from '../../utils/exportCard';
import { addLog, getLog, LogEntry, summarise, shareLog, clearLog } from '../../utils/coachLog';

interface CoachKitPanelProps {
  onBack: () => void;
  /** hands a fully built session to the app so the existing workspace opens it */
  onLaunchSession: (session: Session) => void;
}

type Tab = 'drills' | 'log' | 'phone';

const REALITY_FILTERS: { id: string; key: string; tags: string[] }[] = [
  { id: 'oneball', key: 'kit.reality.oneball', tags: ['no-balls', 'pairs', 'low-equipment', 'no-equipment'] },
  { id: 'nocones', key: 'kit.reality.nocones', tags: ['no-cones', 'no-equipment'] },
  { id: 'biggroup', key: 'kit.reality.biggroup', tags: ['large-group', 'high-reps'] },
  { id: 'heat', key: 'kit.reality.heat', tags: ['heat-ok', 'reflection', 'no-equipment'] },
];

export const CoachKitPanel: React.FC<CoachKitPanelProps> = ({ onBack, onLaunchSession }) => {
  const [settings, setSettings] = useKitSettings();
  const lang = settings.lang;
  const [tab, setTab] = useState<Tab>('drills');
  const [band, setBand] = useState<AgeBand | 'all'>('all');
  const [theme, setTheme] = useState<DrillTheme | 'all'>('all');
  const [reality, setReality] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [shareNote, setShareNote] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DRILLS.filter((d) => {
      if (band !== 'all' && d.band !== band) return false;
      if (theme !== 'all' && d.theme !== theme) return false;
      if (reality.length) {
        const allowed = new Set(REALITY_FILTERS.filter((f) => reality.includes(f.id)).flatMap((f) => f.tags));
        if (!d.tags.some((tag) => allowed.has(tag))) return false;
      }
      if (q) {
        const hay = `${d.title} ${d.titlePcm ?? ''} ${d.theme} ${d.band} ${d.tags.join(' ')} ${d.steps
          .map((s) => `${s.cue} ${s.cuePcm ?? ''}`)
          .join(' ')} ${d.coachingPoints.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [band, theme, reality, query]);

  const open = openId ? DRILLS.find((d) => d.id === openId) ?? null : null;
  const safeStep = open ? Math.min(stepIndex, open.steps.length - 1) : 0;

  const preview = useMemo(
    () =>
      open
        ? drillCardDataUrl(open, safeStep, { width: 720, compact: false, academyName: settings.academyName, showPidgin: settings.showPidginCues })
        : null,
    [open, safeStep, settings.academyName, settings.showPidginCues]
  );

  useEffect(() => {
    if (!shareNote) return;
    const id = window.setTimeout(() => setShareNote(null), 2600);
    return () => window.clearTimeout(id);
  }, [shareNote]);

  const launch = (drill: Drill) => {
    const session = sessionFromDrill(drill, { markingSize: defaultMarkingSize() });
    onLaunchSession(session);
  };

  const copyText = async (drill: Drill) => {
    const text = drillToText(drill);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  const doShare = async (drill: Drill, step: number) => {
    const result = await shareDrillCard(drill, step, {
      academyName: settings.academyName,
      showPidgin: settings.showPidginCues,
    });
    setShareNote(
      result === 'shared'
        ? 'Sent to the share sheet.'
        : result === 'saved'
          ? 'Saved the image — attach it in WhatsApp from your gallery.'
          : 'Could not build the image on this device.'
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-2.5 sm:px-4 py-2 flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300"
            title={t(lang, 'kit.back')}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="font-display font-extrabold text-sm sm:text-lg leading-tight truncate">{t(lang, 'kit.title')}</h1>
            <p className="text-[10px] sm:text-xs text-slate-400 truncate">{t(lang, 'kit.tagline')}</p>
          </div>
          <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-1 rounded-lg">
            <Radio className="w-3 h-3" />
            {t(lang, 'kit.offline')}
          </span>
          <select
            value={lang}
            onChange={(e) => setSettings({ lang: e.target.value as typeof lang })}
            className="bg-slate-900 border border-slate-700 rounded-lg text-[11px] px-1.5 py-2 outline-none focus:ring-1 focus:ring-emerald-500"
            aria-label={t(lang, 'kit.language')}
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div className="max-w-5xl mx-auto px-2.5 sm:px-4 pb-2 flex items-center gap-1.5 overflow-x-auto">
          {(['drills', 'log', 'phone'] as Tab[]).map((tb) => (
            <button
              key={tb}
              onClick={() => setTab(tb)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border transition-colors ${
                tab === tb
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {t(lang, `kit.tab.${tb}`)}
            </button>
          ))}
          <button
            onClick={() => setSettings({ huddleMode: !settings.huddleMode })}
            className={`ml-auto px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap border flex items-center gap-1.5 transition-colors ${
              settings.huddleMode
                ? 'bg-indigo-950 border-indigo-600 text-indigo-200'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title={settings.huddleMode ? t(lang, 'kit.huddle.on') : t(lang, 'kit.huddle.off')}
          >
            <Layers className="w-3.5 h-3.5" />
            {t(lang, 'kit.huddle')}
            <span className={settings.huddleMode ? 'text-indigo-300' : 'text-slate-500'}>{settings.huddleMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-2.5 sm:px-4 py-3 sm:py-5">
        {tab === 'drills' && (
          <>
            {/* Search + reality filters */}
            <div className="flex flex-col gap-2 mb-3">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="1 ball · no cones · girls · pressing · rondo"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-slate-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                <button
                  onClick={() => setBand('all')}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap border ${
                    band === 'all' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {t(lang, 'kit.filter.band')}: All
                </button>
                {AGE_BANDS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBand(b === band ? 'all' : b)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap border ${
                      band === b ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                <button
                  onClick={() => setTheme('all')}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap border ${
                    theme === 'all' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {t(lang, 'kit.filter.theme')}
                </button>
                {DRILL_THEMES.filter((th) => DRILLS.some((d) => d.theme === th)).map((th) => (
                  <button
                    key={th}
                    onClick={() => setTheme(th === theme ? 'all' : th)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap border ${
                      theme === th ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    {th}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{t(lang, 'kit.filter.reality')}</span>
                {REALITY_FILTERS.map((f) => {
                  const on = reality.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      onClick={() => setReality(on ? reality.filter((r) => r !== f.id) : [...reality, f.id])}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        on
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {t(lang, f.key)}
                    </button>
                  );
                })}
                <span className="text-[10px] text-slate-500 ml-auto">
                  {filtered.length}/{DRILLS.length}
                </span>
              </div>
            </div>

            {/* Drill list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filtered.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setOpenId(d.id);
                    setStepIndex(0);
                    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
                  }}
                  className="text-left bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-emerald-600/60 rounded-2xl p-3 transition-all"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-800/60 whitespace-nowrap">
                      {d.band}
                    </span>
                    {d.audience === 'girls' && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-pink-500/15 text-pink-300 border border-pink-800/60 whitespace-nowrap">
                        girls
                      </span>
                    )}
                    {d.audience === 'inclusive' && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-800/60 whitespace-nowrap">
                        inclusive
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 font-semibold ml-auto whitespace-nowrap">
                      {d.minutes} min · {d.steps.length} steps
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-display font-extrabold text-[15px] leading-snug">{d.title}</h3>
                  {settings.lang === 'pcm' && d.titlePcm && <p className="text-[11px] text-amber-300/90">{d.titlePcm}</p>}
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">{d.steps[0].cue}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {d.theme}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {d.players.split('.')[0]}
                    </span>
                  </div>
                </button>
              ))}
              {!filtered.length && (
                <p className="col-span-full text-sm text-slate-400 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                  No drill matches that. Clear a filter, or build it yourself from the Dashboard.
                </p>
              )}
            </div>
          </>
        )}

        {tab === 'log' && <LogTab lang={lang} onSaved={() => setTab('log')} />}

        {tab === 'phone' && <PhoneTab lang={lang} academyName={settings.academyName} onAcademy={(v) => setSettings({ academyName: v })} />}
      </main>

      {/* Drill detail sheet */}
      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/97 overflow-y-auto">
          <div className="min-h-full max-w-2xl mx-auto bg-slate-900 border-x border-slate-800">
            <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-3 py-2 flex items-center gap-2">
              <button onClick={() => setOpenId(null)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
                <X className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <h2 className="font-display font-extrabold text-sm truncate">{open.title}</h2>
                <p className="text-[10px] text-slate-400">
                  {open.band} · {open.theme} · {open.minutes} min · {open.format}
                </p>
              </div>
              <button
                onClick={() => launch(open)}
                className="ml-auto px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-glow-green whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5" />
                {t(lang, 'kit.open')}
              </button>
            </div>

            <div className="p-3 space-y-3">
              {preview && (
                <img
                  src={preview}
                  alt={`${open.title} diagram`}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950"
                />
              )}

              {/* step switch */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {open.steps.map((s, i) => (
                  <button
                    key={`${open.id}-${i}`}
                    onClick={() => setStepIndex(i)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border ${
                      i === safeStep ? 'bg-white text-slate-900 border-white' : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    {i + 1}. {s.label}
                  </button>
                ))}
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Say it</p>
                <p className="font-display font-extrabold text-xl leading-snug text-emerald-400">{open.steps[safeStep].cue}</p>
                {open.steps[safeStep].cuePcm && (
                  <p className="mt-1.5 text-sm font-semibold text-amber-300/90">“{open.steps[safeStep].cuePcm}”</p>
                )}
                <div className="mt-2.5 pt-2.5 border-t border-slate-800">
                  <CueRecorder storeKey={cueKeyFor(open.id, safeStep)} script={open.steps[safeStep].cue} />
                </div>
              </div>

              <Block title={t(lang, 'kit.why')} body={open.why} />
              <BlockList title={t(lang, 'kit.points')} items={open.coachingPoints} tone="emerald" />
              <BlockList title="Objectives" items={open.objectives} tone="slate" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <BlockList title={t(lang, 'kit.easier')} items={[open.easier]} tone="sky" />
                <BlockList title={t(lang, 'kit.harder')} items={[open.harder]} tone="amber" />
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <Info label={t(lang, 'kit.players')} value={open.players} />
                <Info label={t(lang, 'kit.space')} value={open.space} />
                <Info label={t(lang, 'kit.balls')} value={open.balls} />
                <Info label={t(lang, 'kit.makeshift')} value={open.makeshift} />
                {open.safety && <Info label={t(lang, 'kit.safety')} value={open.safety} warn />}
              </div>

              <div className="flex flex-wrap gap-1.5 pb-6">
                <button
                  onClick={() => void doShare(open, safeStep)}
                  className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {t(lang, 'kit.share')}
                </button>
                <button
                  onClick={() => void copyText(open)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : t(lang, 'kit.copy')}
                </button>
                <button
                  onClick={() => {
                    addLog({
                      date: new Date().toISOString(),
                      drillId: open.id,
                      title: open.title,
                      band: open.band,
                      minutes: open.minutes,
                      players: 0,
                      note: 'from Coach Kit',
                    });
                    setShareNote('Logged. Add the player number on the My log tab if you want it counted.');
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
                >
                  <ListChecks className="w-3.5 h-3.5" />
                  {t(lang, 'kit.log.run')}
                </button>
                {shareNote && <p className="w-full text-[11px] text-emerald-400">{shareNote}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Block: React.FC<{ title: string; body: string }> = ({ title, body }) => (
  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">{title}</p>
    <p className="text-[13px] text-slate-300 leading-relaxed">{body}</p>
  </div>
);

const BlockList: React.FC<{ title: string; items: string[]; tone: 'emerald' | 'amber' | 'sky' | 'slate' }> = ({ title, items, tone }) => {
  const toneMap: Record<string, string> = {
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    sky: 'text-sky-400',
    slate: 'text-slate-400',
  };
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">{title}</p>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-[13px] text-slate-300 leading-snug">
            <span className={`${toneMap[tone]} font-bold`}>•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Info: React.FC<{ label: string; value: string; warn?: boolean }> = ({ label, value, warn }) => (
  <div>
    <p className={`text-[10px] uppercase tracking-wider font-bold mb-0.5 ${warn ? 'text-amber-400' : 'text-slate-500'}`}>{label}</p>
    <p className={`text-[11px] leading-snug ${warn ? 'text-amber-200' : 'text-slate-300'}`}>{value}</p>
  </div>
);

// ─────────────────────────── log tab ───────────────────────────

const LogTab: React.FC<{ lang: Parameters<typeof t>[0]; onSaved: () => void }> = ({ lang }) => {
  const [entries, setEntries] = useState<LogEntry[]>(() => getLog());
  const [minutes, setMinutes] = useState('45');
  const [players, setPlayers] = useState('12');
  const [title, setTitle] = useState('');
  const summary = useMemo(() => summarise(entries), [entries]);

  return (
    <div className="space-y-3">
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3">
        <h2 className="font-display font-extrabold text-sm mb-2">{t(lang, 'kit.log.title')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { k: t(lang, 'kit.log.sessions'), v: summary.sessions },
            { k: t(lang, 'kit.log.minutes'), v: summary.minutes },
            { k: t(lang, 'kit.log.players'), v: summary.playerSlots },
            { k: 'last 7 days', v: summary.last7 },
          ].map((c) => (
            <div key={c.k} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
              <p className="text-2xl font-display font-extrabold text-emerald-400 leading-none">{c.v}</p>
              <p className="text-[10px] text-slate-500 mt-1">{c.k}</p>
            </div>
          ))}
        </div>
        {summary.topDrills.length > 0 && (
          <ul className="mt-2 space-y-1 text-[11px] text-slate-400">
            {summary.topDrills.map((d) => (
              <li key={d.title} className="flex justify-between border-b border-slate-800/70 pb-1">
                <span>{d.title}</span>
                <span className="font-bold text-slate-300">{d.count}×</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 space-y-2">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Add a session</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Session title (e.g. Saturday U11 — 1v1 confidence)"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <div className="flex gap-2">
            <input
              value={minutes}
              onChange={(e) => setMinutes(e.target.value.replace(/[^0-9]/g, ''))}
              inputMode="numeric"
              className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500"
              aria-label="minutes"
            />
            <input
              value={players}
              onChange={(e) => setPlayers(e.target.value.replace(/[^0-9]/g, ''))}
              inputMode="numeric"
              className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500"
              aria-label="players"
            />
          </div>
          <button
            onClick={() => {
              addLog({
                date: new Date().toISOString(),
                title: title.trim() || 'Training session',
                minutes: Number(minutes) || 45,
                players: Number(players) || 0,
              });
              setEntries(getLog());
              setTitle('');
            }}
            className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold whitespace-nowrap"
          >
            Add
          </button>
        </div>
        <p className="text-[10px] text-slate-500">Minutes first, players second. Everything stays on this phone.</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => void shareLog()}
          className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
        >
          <Send className="w-3.5 h-3.5" />
          {t(lang, 'kit.log.share')}
        </button>
        <button
          onClick={() => {
            if (window.confirm('Clear the whole log from this phone?')) {
              clearLog();
              setEntries([]);
            }
          }}
          className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-red-900/50 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {t(lang, 'kit.log.clear')}
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-slate-400 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">{t(lang, 'kit.log.empty')}</p>
      ) : (
        <ul className="space-y-1.5">
          {entries.slice(0, 60).map((e) => (
            <li key={e.id} className="flex items-center gap-2 bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2">
              <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{e.date.slice(0, 10)}</span>
              <span className="text-xs flex-1 min-w-0 truncate">{e.title}</span>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                {e.minutes} min · {e.players} p
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ─────────────────────────── phone / install tab ───────────────────────────

const PhoneTab: React.FC<{ lang: Parameters<typeof t>[0]; academyName: string; onAcademy: (v: string) => void }> = ({
  lang,
  academyName,
  onAcademy,
}) => {
  const [note, setNote] = useState<string | null>(null);
  const [installEvent, setInstallEvent] = useState<{ prompt: () => void } | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as unknown as { prompt: () => void });
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const saveFile = () => {
    const a = document.createElement('a');
    a.href = './coach_kit.html';
    a.download = 'coach_kit.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setNote('Saved as coach_kit.html — now send that file to any phone.');
  };

  const forwardApp = async () => {
    try {
      const res = await fetch('./coach_kit.html').catch(() => fetch('./tactical_coach_preview.html'));
      const blob = await res.blob();
      const file = new File([blob], 'coach_kit.html', { type: 'text/html' });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] }) && nav.share) {
        await nav.share({ files: [file], title: 'Coach Kit — offline football drills', text: 'Free, works with no internet. Open in Chrome.' });
        setNote('Sent to the share sheet.');
        return;
      }
    } catch {
      /* offline or file:// origin */
    }
    saveFile();
  };

  return (
    <div className="space-y-3">
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5">
        <div className="flex items-center gap-2 mb-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <h2 className="font-display font-extrabold text-sm">{t(lang, 'kit.tab.phone')}</h2>
        </div>
        <p className="text-[13px] text-slate-300 leading-relaxed">{t(lang, 'kit.phone.intro')}</p>
        <ol className="mt-3 space-y-2">
          {[t(lang, 'kit.phone.step1'), t(lang, 'kit.phone.step2'), t(lang, 'kit.phone.step3')].map((s, i) => (
            <li key={i} className="flex gap-2.5 items-start">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold grid place-items-center">
                {i + 1}
              </span>
              <span className="text-[13px] text-slate-300 leading-snug">{s}</span>
            </li>
          ))}
        </ol>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            onClick={saveFile}
            className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            {t(lang, 'kit.phone.download')}
          </button>
          <button
            onClick={() => void forwardApp()}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
          >
            <Share2 className="w-3.5 h-3.5" />
            {t(lang, 'kit.forward')}
          </button>
          {installEvent && (
            <button
              onClick={() => installEvent.prompt()}
              className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              Add to home screen
            </button>
          )}
        </div>
        {note && <p className="mt-2 text-[11px] text-emerald-400">{note}</p>}
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 space-y-2">
        <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold">Name on shared cards (optional)</label>
        <input
          value={academyName}
          onChange={(e) => onAcademy(e.target.value)}
          placeholder="e.g. Shomolu Youth FC"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <p className="text-[10px] text-slate-500">
          Every drill card you share gets this footer, so the next coach knows who sent it. Nothing is uploaded anywhere.
        </p>
      </div>

      <div className="bg-amber-950/30 border border-amber-900/60 rounded-2xl p-3 flex gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-200/90 leading-relaxed">
          Voice cues and your log are saved on the phone. If you open the app from the WhatsApp file, recordings last for that
          session only — install it to the home screen to keep them.
        </p>
      </div>
    </div>
  );
};

export default CoachKitPanel;
