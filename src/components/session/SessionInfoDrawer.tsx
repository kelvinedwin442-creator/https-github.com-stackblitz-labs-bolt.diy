import React, { useState } from 'react';
import { Session, TacticalPhase } from '../../types/tactics';
import {
  FileText,
  Save,
  Download,
  Copy,
  Trash2,
  X,
  Plus,
  Check,
  Shield,
  Tag,
  Target,
  Sparkles,
} from 'lucide-react';

interface SessionInfoDrawerProps {
  session: Session;
  onUpdateSession: (updated: Partial<Session>) => void;
  onSaveSession: () => void;
  onExportJson: () => void;
  onDuplicateSession: () => void;
  onClose: () => void;
}

export const SessionInfoDrawer: React.FC<SessionInfoDrawerProps> = ({
  session,
  onUpdateSession,
  onSaveSession,
  onExportJson,
  onDuplicateSession,
  onClose,
}) => {
  const [newCoachingPoint, setNewCoachingPoint] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const PHASES: { id: TacticalPhase; label: string; color: string }[] = [
    { id: 'possession', label: 'In Possession (Build-Up & Attack)', color: 'text-emerald-400' },
    { id: 'out-of-possession', label: 'Out of Possession (Defending & Pressing)', color: 'text-red-400' },
    { id: 'transition-attack', label: 'Transition: Defend to Attack', color: 'text-amber-400' },
    { id: 'transition-defense', label: 'Transition: Attack to Defend', color: 'text-orange-400' },
    { id: 'set-piece', label: 'Set Piece Routine', color: 'text-purple-400' },
    { id: 'drill', label: 'Technical Drill / SSG', color: 'text-blue-400' },
  ];

  const QUICK_CUES = [
    'Open body shape on half-turn',
    'Scan over shoulder before receiving',
    'Trigger press on back pass',
    'Cut passing lane with cover shadow',
    'Create 3rd man running option',
    'Underlapping run into half-space',
    'Compact defensive block (max 30m)',
  ];

  const handleSave = () => {
    onSaveSession();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddCoachingPoint = (text?: string) => {
    const pointToAdd = text || newCoachingPoint.trim();
    if (!pointToAdd) return;
    const updated = [...(session.coachingPoints || []), pointToAdd];
    onUpdateSession({ coachingPoints: updated });
    setNewCoachingPoint('');
  };

  const handleRemoveCoachingPoint = (idx: number) => {
    const updated = (session.coachingPoints || []).filter((_, i) => i !== idx);
    onUpdateSession({ coachingPoints: updated });
  };

  const handleAddObjective = () => {
    if (!newObjective.trim()) return;
    const updated = [...(session.objectives || []), newObjective.trim()];
    onUpdateSession({ objectives: updated });
    setNewObjective('');
  };

  const handleRemoveObjective = (idx: number) => {
    const updated = (session.objectives || []).filter((_, i) => i !== idx);
    onUpdateSession({ objectives: updated });
  };

  return (
    <div className="bg-slate-900/98 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-tactical flex flex-col gap-4 text-xs text-slate-100 h-full max-h-[84vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Session Information</h3>
            <p className="text-[10px] text-slate-400">Tactical plan, notes & coaching cues</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Session Title & Description */}
      <div className="flex flex-col gap-2">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
            Session Title
          </label>
          <input
            type="text"
            value={session.title}
            onChange={(e) => onUpdateSession({ title: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-semibold focus:ring-1 focus:ring-emerald-500 outline-none"
            placeholder="e.g. Breaking the Press: 4-3-3 Build-Up"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
            Description & Context
          </label>
          <textarea
            rows={2}
            value={session.description}
            onChange={(e) => onUpdateSession({ description: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500 outline-none resize-none"
            placeholder="Tactical overview, opponent context, learning objectives..."
          />
        </div>
      </div>

      {/* Match Phase & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-emerald-400" /> Match Phase
          </label>
          <select
            value={session.phase}
            onChange={(e) => onUpdateSession({ phase: e.target.value as TacticalPhase })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {PHASES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
            <Target className="w-3 h-3 text-emerald-400" /> Category / Age Group
          </label>
          <select
            value={session.category}
            onChange={(e) => onUpdateSession({ category: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="senior">First Team / Senior</option>
            <option value="youth-u18">Youth U18 / U17</option>
            <option value="youth-u14">Junior U15 / U14</option>
            <option value="academy-u10">Academy U12 / U10</option>
            <option value="grassroots">Grassroots / Community</option>
          </select>
        </div>
      </div>

      {/* Team Names & Colors */}
      <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
        <div>
          <label className="text-[10px] font-bold text-blue-400 flex items-center gap-1 mb-1">
            <Shield className="w-3 h-3" /> Home Team
          </label>
          <input
            type="text"
            value={session.homeTeam.name}
            onChange={(e) =>
              onUpdateSession({
                homeTeam: { ...session.homeTeam, name: e.target.value },
              })
            }
            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-xs outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] text-slate-400">Kit:</span>
            <input
              type="color"
              value={session.homeTeam.primaryColor}
              onChange={(e) =>
                onUpdateSession({
                  homeTeam: { ...session.homeTeam, primaryColor: e.target.value },
                })
              }
              className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-red-400 flex items-center gap-1 mb-1">
            <Shield className="w-3 h-3" /> Away Team
          </label>
          <input
            type="text"
            value={session.awayTeam.name}
            onChange={(e) =>
              onUpdateSession({
                awayTeam: { ...session.awayTeam, name: e.target.value },
              })
            }
            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-xs outline-none focus:ring-1 focus:ring-red-500"
          />
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] text-slate-400">Kit:</span>
            <input
              type="color"
              value={session.awayTeam.primaryColor}
              onChange={(e) =>
                onUpdateSession({
                  awayTeam: { ...session.awayTeam, primaryColor: e.target.value },
                })
              }
              className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
            />
          </div>
        </div>
      </div>

      {/* Coaching Points */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Coaching Points & Key Triggers</span>
          <span className="text-[10px] text-emerald-400">
            {session.coachingPoints?.length || 0} cues
          </span>
        </label>

        {/* Quick Cues suggestions */}
        <div className="flex flex-wrap gap-1 mb-1">
          {QUICK_CUES.slice(0, 4).map((cue, i) => (
            <button
              key={i}
              onClick={() => handleAddCoachingPoint(cue)}
              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
            >
              + {cue}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            placeholder="Add custom coaching cue..."
            value={newCoachingPoint}
            onChange={(e) => setNewCoachingPoint(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCoachingPoint()}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleAddCoachingPoint()}
            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-1 mt-1 max-h-36 overflow-y-auto">
          {session.coachingPoints?.map((pt, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 group"
            >
              <div className="flex items-start gap-1.5 flex-1 pr-2">
                <span className="text-emerald-400 font-bold text-xs leading-none mt-0.5">•</span>
                <span className="text-slate-200 text-[11px]">{pt}</span>
              </div>
              <button
                onClick={() => handleRemoveCoachingPoint(i)}
                className="p-1 hover:bg-red-900/60 rounded text-slate-500 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions: Save, Export, Duplicate */}
      <div className="border-t border-slate-800 pt-3 flex flex-col gap-2">
        <button
          onClick={handleSave}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-glow-green"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Session</span>
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onExportJson}
            className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center gap-1.5 text-[11px] font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onDuplicateSession}
            className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center gap-1.5 text-[11px] font-medium transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
