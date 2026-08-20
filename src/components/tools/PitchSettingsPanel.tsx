import React from 'react';
import {
  MatchFormat,
  PitchConfig,
  PitchTheme,
  PitchView,
  PitchGridType,
  TeamConfig,
} from '../../types/tactics';
import {
  Layers,
  Layout,
  Palette,
  Eye,
  Grid,
  Shield,
  Sliders,
  Check,
} from 'lucide-react';

interface PitchSettingsPanelProps {
  format: MatchFormat;
  onChangeFormat: (format: MatchFormat) => void;
  pitchConfig: PitchConfig;
  onChangePitchConfig: (updated: Partial<PitchConfig>) => void;
  homeTeam: TeamConfig;
  awayTeam: TeamConfig;
  onUpdateHomeTeam: (updated: Partial<TeamConfig>) => void;
  onUpdateAwayTeam: (updated: Partial<TeamConfig>) => void;
  onOpenResetModal: () => void;
}

export const PitchSettingsPanel: React.FC<PitchSettingsPanelProps> = ({
  format,
  onChangeFormat,
  pitchConfig,
  onChangePitchConfig,
  homeTeam,
  awayTeam,
  onUpdateHomeTeam,
  onUpdateAwayTeam,
  onOpenResetModal,
}) => {
  const FORMATS: MatchFormat[] = ['11v11', '9v9', '7v7', '5v5'];

  const VIEWS: { id: PitchView; label: string }[] = [
    { id: 'full', label: 'Full Pitch' },
    { id: 'half-right', label: 'Half Pitch (Attacking)' },
    { id: 'half-left', label: 'Half Pitch (Defensive)' },
    { id: 'attacking-third', label: 'Final Third' },
    { id: 'penalty-box', label: 'Penalty Box' },
  ];

  const THEMES: { id: PitchTheme; label: string; bg: string }[] = [
    { id: 'classic-grass', label: 'Classic Grass', bg: '#15803d' },
    { id: 'striped-grass', label: 'Stadium Stripes', bg: '#1b4d3e' },
    { id: 'tactical-dark', label: 'Tactical Dark', bg: '#0f172a' },
    { id: 'blueprint', label: 'Blueprint', bg: '#0c2340' },
    { id: 'chalkboard', label: 'Chalkboard', bg: '#1c1917' },
    { id: 'indoor-wood', label: 'Indoor / Futsal', bg: '#854d0e' },
  ];

  const GRIDS: { id: PitchGridType; label: string }[] = [
    { id: 'none', label: 'No Grid' },
    { id: 'channels', label: '5 Channels' },
    { id: 'zones-18', label: '18 Zones (Zone 14)' },
    { id: 'thirds', label: '3 Thirds' },
  ];

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-tactical text-xs text-slate-100 flex flex-col gap-4">
      {/* Format Selector */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-400" /> Match Format
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {FORMATS.map((f) => (
            <button
              key={f}
              onClick={() => onChangeFormat(f)}
              className={`py-1.5 px-2 rounded-lg font-bold transition-all ${
                format === f
                  ? 'bg-emerald-600 text-white shadow-glow-green ring-1 ring-emerald-400'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Pitch View */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-emerald-400" /> Pitch View
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => onChangePitchConfig({ view: v.id })}
              className={`py-1.5 px-2.5 rounded-lg text-left truncate font-medium transition-all ${
                pitchConfig.view === v.id
                  ? 'bg-slate-700 text-white border border-emerald-500/60 font-semibold'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pitch Theme */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-emerald-400" /> Pitch Theme
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {THEMES.map((th) => (
            <button
              key={th.id}
              onClick={() => onChangePitchConfig({ theme: th.id })}
              className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-left transition-all ${
                pitchConfig.theme === th.id
                  ? 'bg-slate-800 border-emerald-500 text-white font-semibold'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full border border-white/30 flex-shrink-0"
                style={{ backgroundColor: th.bg }}
              />
              <span className="truncate text-[10px]">{th.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tactical Grid Overlays */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Grid className="w-3.5 h-3.5 text-emerald-400" /> Tactical Grid
          </label>
          <button
            onClick={() => onChangePitchConfig({ showGrid: !pitchConfig.showGrid })}
            className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
              pitchConfig.showGrid ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {pitchConfig.showGrid ? 'ON' : 'OFF'}
          </button>
        </div>
        {pitchConfig.showGrid && (
          <div className="grid grid-cols-2 gap-1.5">
            {GRIDS.map((g) => (
              <button
                key={g.id}
                onClick={() => onChangePitchConfig({ gridType: g.id })}
                className={`py-1 px-2 rounded-lg text-left truncate text-[11px] font-medium transition-all ${
                  pitchConfig.gridType === g.id
                    ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/40'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Visual Toggles */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-emerald-400" /> Display Toggles
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onChangePitchConfig({ showPlayerLabels: !pitchConfig.showPlayerLabels })}
            className={`py-1.5 px-2 rounded-lg border text-left flex items-center justify-between text-[11px] font-medium transition-all ${
              pitchConfig.showPlayerLabels ? 'bg-slate-800 border-emerald-500/70 text-white' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'
            }`}
          >
            <span>Names / Roles</span>
            {pitchConfig.showPlayerLabels && <Check className="w-3 h-3 text-emerald-400" />}
          </button>
          <button
            onClick={() => onChangePitchConfig({ showPlayerNumbers: !pitchConfig.showPlayerNumbers })}
            className={`py-1.5 px-2 rounded-lg border text-left flex items-center justify-between text-[11px] font-medium transition-all ${
              pitchConfig.showPlayerNumbers ? 'bg-slate-800 border-emerald-500/70 text-white' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'
            }`}
          >
            <span>Jersey Numbers</span>
            {pitchConfig.showPlayerNumbers && <Check className="w-3 h-3 text-emerald-400" />}
          </button>
          <button
            onClick={() => onChangePitchConfig({ showVisionCones: !pitchConfig.showVisionCones })}
            className={`py-1.5 px-2 rounded-lg border text-left flex items-center justify-between text-[11px] font-medium transition-all ${
              pitchConfig.showVisionCones ? 'bg-slate-800 border-emerald-500/70 text-white' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'
            }`}
          >
            <span>Vision Cones</span>
            {pitchConfig.showVisionCones && <Check className="w-3 h-3 text-emerald-400" />}
          </button>
          <button
            onClick={() => onChangePitchConfig({ snapToGrid: !pitchConfig.snapToGrid })}
            className={`py-1.5 px-2 rounded-lg border text-left flex items-center justify-between text-[11px] font-medium transition-all ${
              pitchConfig.snapToGrid ? 'bg-slate-800 border-emerald-500/70 text-white' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'
            }`}
          >
            <span>Snap to Grid</span>
            {pitchConfig.snapToGrid && <Check className="w-3 h-3 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Team Colors & Reset Formation button */}
      <div className="border-t border-slate-800 pt-3 flex flex-col gap-2">
        <button
          onClick={onOpenResetModal}
          className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Reset Formations</span>
        </button>
      </div>
    </div>
  );
};
