import React, { useState } from 'react';
import { MatchFormat, TeamConfig } from '../../types/tactics';
import { ALL_FORMATIONS } from '../../data/formations';
import { RotateCcw, X, Shield, Check } from 'lucide-react';

interface FormationResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  format: MatchFormat;
  homeTeam: TeamConfig;
  awayTeam: TeamConfig;
  onApplyFormation: (target: 'both' | 'home' | 'away', homeForm: string, awayForm: string) => void;
}

export const FormationResetModal: React.FC<FormationResetModalProps> = ({
  isOpen,
  onClose,
  format,
  homeTeam,
  awayTeam,
  onApplyFormation,
}) => {
  if (!isOpen) return null;

  const formationGroup = ALL_FORMATIONS[format] || ALL_FORMATIONS['11v11'];
  const formationList = Object.keys(formationGroup);

  const [selectedHomeFormation, setSelectedHomeFormation] = useState(homeTeam.formation || formationList[0]);
  const [selectedAwayFormation, setSelectedAwayFormation] = useState(awayTeam.formation || formationList[0]);
  const [resetTarget, setResetTarget] = useState<'both' | 'home' | 'away'>('both');

  const handleApply = () => {
    onApplyFormation(resetTarget, selectedHomeFormation, selectedAwayFormation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-tactical flex flex-col gap-4 text-slate-100 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Reset Tactical Formation</h3>
              <p className="text-xs text-slate-400">Format: {format} System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Selector (Both / Home Only / Away Only) */}
        <div>
          <label className="text-xs font-semibold text-slate-300 mb-2 block">Apply To:</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setResetTarget('both')}
              className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                resetTarget === 'both'
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-glow-green font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Both Teams
            </button>
            <button
              onClick={() => setResetTarget('home')}
              className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                resetTarget === 'home'
                  ? 'bg-blue-600 border-blue-400 text-white font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {homeTeam.name || 'Home Team'}
            </button>
            <button
              onClick={() => setResetTarget('away')}
              className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                resetTarget === 'away'
                  ? 'bg-red-600 border-red-400 text-white font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {awayTeam.name || 'Away Team'}
            </button>
          </div>
        </div>

        {/* Home Formation Options */}
        {(resetTarget === 'both' || resetTarget === 'home') && (
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <label className="text-xs font-semibold text-blue-400 mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Home Formation: {homeTeam.name}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {formationList.map((f) => (
                <button
                  key={`home-${f}`}
                  onClick={() => setSelectedHomeFormation(f)}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-mono font-semibold transition-all ${
                    selectedHomeFormation === f
                      ? 'bg-blue-600/90 border-blue-400 text-white shadow-glow-blue'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Away Formation Options */}
        {(resetTarget === 'both' || resetTarget === 'away') && (
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <label className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Away Formation: {awayTeam.name}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {formationList.map((f) => (
                <button
                  key={`away-${f}`}
                  onClick={() => setSelectedAwayFormation(f)}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-mono font-semibold transition-all ${
                    selectedAwayFormation === f
                      ? 'bg-red-600/90 border-red-400 text-white shadow-glow-red'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-glow-green flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Apply Formation
          </button>
        </div>
      </div>
    </div>
  );
};
