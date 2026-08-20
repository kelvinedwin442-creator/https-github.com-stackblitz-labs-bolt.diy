import React, { useState } from 'react';
import { Session, MatchFormat, TacticalPhase } from '../../types/tactics';
import {
  Plus,
  FolderOpen,
  Copy,
  Trash2,
  Download,
  Upload,
  Layers,
  Sparkles,
  Play,
  Clock,
  Shield,
  Search,
  Filter,
  Activity,
  Award,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface DashboardProps {
  sessions: Session[];
  onOpenSession: (id: string) => void;
  onCreateNewSession: (format: MatchFormat, title?: string) => void;
  onDuplicateSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onExportSession: (session: Session) => void;
  onExportAll: () => void;
  onImportSession: (file: File) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  sessions,
  onOpenSession,
  onCreateNewSession,
  onDuplicateSession,
  onDeleteSession,
  onExportSession,
  onExportAll,
  onImportSession,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportSession(file);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.homeTeam?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.awayTeam?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFormat = selectedFormat === 'all' || s.format === selectedFormat;
    const matchesPhase = selectedPhase === 'all' || s.phase === selectedPhase;

    return matchesSearch && matchesFormat && matchesPhase;
  });

  const getPhaseBadge = (phase: TacticalPhase) => {
    switch (phase) {
      case 'possession':
        return { label: 'In Possession', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' };
      case 'out-of-possession':
        return { label: 'Out of Possession', color: 'bg-red-950/80 text-red-300 border-red-500/40' };
      case 'transition-attack':
        return { label: 'Transition (Att)', color: 'bg-amber-950/80 text-amber-300 border-amber-500/40' };
      case 'transition-defense':
        return { label: 'Transition (Def)', color: 'bg-orange-950/80 text-orange-300 border-orange-500/40' };
      case 'set-piece':
        return { label: 'Set Piece', color: 'bg-purple-950/80 text-purple-300 border-purple-500/40' };
      default:
        return { label: 'Tactical Drill', color: 'bg-blue-950/80 text-blue-300 border-blue-500/40' };
    }
  };

  const formatRelativeDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-0.5 shadow-glow-green flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 font-bold text-xs">
                  TC
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Tactical Coach
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-semibold">
                  PRO STUDIO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Modern Football Tactical Teaching & Planning Workspace
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                const a = document.createElement('a');
                a.href = '/tactical_coach_preview.html';
                a.download = 'Tactical_Coach_Offline_App.html';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 text-xs font-semibold shadow-sm transition-all"
              title="Download standalone offline HTML app"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download App (.html)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>

            <button
              onClick={onExportAll}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup All</span>
            </button>

            <button
              onClick={() => onCreateNewSession('11v11', 'Match Tactical Plan')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-glow-green transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Session</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hidden File Input for JSON import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileInput}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-8">
        {/* Quick Launch Format Presets */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Quick Session Builder
              </h2>
              <p className="text-xs text-slate-400">Choose match format to launch workspace with preset formations</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { format: '11v11' as MatchFormat, title: '11v11 Senior Match', desc: '4-3-3 vs 4-2-3-1 Game Model', color: 'from-emerald-900/40 to-slate-900', border: 'border-emerald-500/30' },
              { format: '9v9' as MatchFormat, title: '9v9 Development', desc: '3-2-3 Positional Play & Spacing', color: 'from-blue-900/40 to-slate-900', border: 'border-blue-500/30' },
              { format: '7v7' as MatchFormat, title: '7v7 Academy', desc: '2-3-1 Build-Up & Third Man', color: 'from-amber-900/40 to-slate-900', border: 'border-amber-500/30' },
              { format: '5v5' as MatchFormat, title: '5v5 / Futsal', desc: '1-2-1 Diamond & Rotations', color: 'from-purple-900/40 to-slate-900', border: 'border-purple-500/30' },
            ].map((preset) => (
              <button
                key={preset.format}
                onClick={() => onCreateNewSession(preset.format, `${preset.format} Tactical Plan`)}
                className={`p-4 rounded-2xl bg-gradient-to-b ${preset.color} border ${preset.border} hover:scale-[1.02] hover:border-white/40 transition-all text-left flex flex-col justify-between group shadow-tactical`}
              >
                <div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 inline-block mb-2">
                    {preset.format}
                  </span>
                  <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                    {preset.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">{preset.desc}</p>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-emerald-400 pt-2 border-t border-slate-800/80">
                  <span>Open Pitch</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sessions Workspace & Filter Bar */}
        <div>
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-emerald-400" /> Saved Tactical Sessions
              </h2>
              <p className="text-xs text-slate-400">
                {filteredSessions.length} {filteredSessions.length === 1 ? 'session' : 'sessions'} stored offline on this device
              </p>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search sessions or teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Format Filter */}
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">All Formats</option>
                <option value="11v11">11v11</option>
                <option value="9v9">9v9</option>
                <option value="7v7">7v7</option>
                <option value="5v5">5v5</option>
              </select>

              {/* Phase Filter */}
              <select
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">All Tactical Phases</option>
                <option value="possession">In Possession</option>
                <option value="out-of-possession">Out of Possession</option>
                <option value="transition-attack">Transition (Att)</option>
                <option value="transition-defense">Transition (Def)</option>
                <option value="set-piece">Set Pieces</option>
                <option value="drill">Drills</option>
              </select>
            </div>
          </div>

          {/* Sessions Grid */}
          {filteredSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions.map((session) => {
                const phaseBadge = getPhaseBadge(session.phase);
                const stepCount = session.steps?.length || 1;
                const playerCount = session.steps?.[0]?.players?.length || 0;

                return (
                  <div
                    key={session.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4.5 flex flex-col justify-between shadow-tactical transition-all hover:shadow-2xl group relative"
                  >
                    {/* Top Meta */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 border border-slate-700/80">
                            {session.format}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${phaseBadge.color}`}
                          >
                            {phaseBadge.label}
                          </span>
                        </div>

                        {session.isTemplate && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-600/40">
                            TEMPLATE
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3
                        onClick={() => onOpenSession(session.id)}
                        className="font-bold text-base text-white group-hover:text-emerald-400 cursor-pointer transition-colors line-clamp-1"
                      >
                        {session.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {session.description || 'No description provided.'}
                      </p>

                      {/* Teams & Formation Badges */}
                      <div className="flex items-center gap-2 mt-3.5 text-[11px] text-slate-300">
                        <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: session.homeTeam.primaryColor }}
                          />
                          <span className="font-medium truncate max-w-[90px]">
                            {session.homeTeam.name}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">
                            ({session.homeTeam.formation})
                          </span>
                        </div>
                        <span className="text-slate-600 text-xs font-bold">vs</span>
                        <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: session.awayTeam.primaryColor }}
                          />
                          <span className="font-medium truncate max-w-[90px]">
                            {session.awayTeam.name}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">
                            ({session.awayTeam.formation})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Info & Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3 text-emerald-400" />
                          {stepCount} {stepCount === 1 ? 'Step' : 'Steps'}
                        </span>
                        <span>•</span>
                        <span>{playerCount} Players</span>
                        <span>•</span>
                        <span>{formatRelativeDate(session.updatedAt)}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onDuplicateSession(session.id)}
                          title="Duplicate Session"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onExportSession(session)}
                          title="Export JSON"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteSession(session.id)}
                          title="Delete Session"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenSession(session.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                        >
                          <span>Open</span>
                          <Play className="w-3 h-3 fill-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">No Tactical Sessions Found</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                No sessions matched your search or filters. Create a new session or clear filters to view all sessions.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFormat('all');
                  setSelectedPhase('all');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold mt-2"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Tactical Reference Guide / Coaching Cheat Sheet */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-tactical">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Tactical Coaching Principles & Space Terminology</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <span className="font-bold text-emerald-400 block mb-1">Half-Spaces (Zwischenräume)</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Vertical corridors between the center and wings. Prime zones for progressive diagonal passes, third-man combinations, and diagonal crosses.
              </p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <span className="font-bold text-amber-400 block mb-1">Zone 14 (Central Danger Pocket)</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                The central attacking space just outside the opponent 18-yard box. Highest statistical probability of generating shots on target and assists.
              </p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <span className="font-bold text-blue-400 block mb-1">Rest Defense & Rest Offense</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Positional structure of non-attacking players during possession (e.g. 3-2 or 2-3 rest defense) to immediately counter-press and prevent breaks.
              </p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <span className="font-bold text-red-400 block mb-1">Pressing Triggers & Cover Shadow</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Cues that trigger coordinated pressing: backward pass, closed body shape, poor touch, or pass into full-back on the touchline.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-slate-500 text-xs">
        Tactical Coach • Football Coaching & Tactical Teaching Workspace • Offline-Ready
      </footer>
    </div>
  );
};
