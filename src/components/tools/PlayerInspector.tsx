import React from 'react';
import { Player, TeamConfig } from '../../types/tactics';
import {
  Shield,
  Eye,
  Compass,
  Trash2,
  Copy,
  X,
  User,
  Hash,
  Sparkles,
} from 'lucide-react';

interface PlayerInspectorProps {
  player: Player;
  teamConfig: TeamConfig;
  onUpdatePlayer: (updated: Partial<Player>) => void;
  onDeletePlayer: (id: string) => void;
  onDuplicatePlayer: (player: Player) => void;
  onClose: () => void;
}

export const PlayerInspector: React.FC<PlayerInspectorProps> = ({
  player,
  teamConfig,
  onUpdatePlayer,
  onDeletePlayer,
  onDuplicatePlayer,
  onClose,
}) => {
  const currentRotation = player.rotation ?? (player.team === 'home' ? 0 : 180);

  const ROLES_LIST = [
    'GK', 'CB', 'RCB', 'LCB', 'RB', 'LB', 'RWB', 'LWB',
    'DM', 'RDM', 'LDM', 'CM', 'RCM', 'LCM', 'AM', 'CAM', 'LAM', 'RAM',
    'RW', 'LW', 'RM', 'LM', 'ST', 'CF', 'SS', 'Fixo', 'Ala R', 'Ala L', 'Pivo'
  ];

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3.5 shadow-tactical w-72 text-slate-100 flex flex-col gap-3 animate-fade-in text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white border border-white/50"
            style={{ backgroundColor: player.color || (player.isGK ? teamConfig.gkColor : teamConfig.primaryColor) }}
          >
            {player.number}
          </div>
          <span className="font-semibold text-sm">
            {player.name || `Player #${player.number}`}
          </span>
          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            {player.team}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Number & Role */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <Hash className="w-3 h-3" /> Number
          </label>
          <input
            type="number"
            min="1"
            max="99"
            value={player.number}
            onChange={(e) => onUpdatePlayer({ number: parseInt(e.target.value) || 1 })}
            className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-white font-mono text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <User className="w-3 h-3" /> Role
          </label>
          <select
            value={player.role}
            onChange={(e) => onUpdatePlayer({ role: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
          >
            {ROLES_LIST.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Name Input */}
      <div>
        <label className="text-[10px] font-medium text-slate-400 mb-1 block">Player Name</label>
        <input
          type="text"
          value={player.name}
          placeholder="e.g. Saka, Saliba, CF"
          onChange={(e) => onUpdatePlayer({ name: e.target.value })}
          className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-white text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
        />
      </div>

      {/* Toggles: Goalkeeper & Vision Cone */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onUpdatePlayer({ isGK: !player.isGK })}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
            player.isGK
              ? 'bg-amber-950/60 border-amber-500 text-amber-300'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>{player.isGK ? 'Goalkeeper (GK)' : 'Outfield'}</span>
        </button>

        <button
          onClick={() => onUpdatePlayer({ coneVisible: !player.coneVisible })}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
            player.coneVisible
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Vision Cone</span>
        </button>
      </div>

      {/* Orientation / Facing Angle Slider */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
            <Compass className="w-3 h-3" /> Facing Angle
          </label>
          <span className="text-[10px] font-mono text-emerald-400">{currentRotation}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          step="5"
          value={currentRotation}
          onChange={(e) => onUpdatePlayer({ rotation: parseInt(e.target.value) })}
          className="w-full accent-emerald-500 bg-slate-800 cursor-pointer h-1.5 rounded-lg"
        />
        {/* Direction Quick Buttons */}
        <div className="flex justify-between mt-1 text-[10px] text-slate-400">
          <button onClick={() => onUpdatePlayer({ rotation: 0 })} className="hover:text-emerald-400">Right (0°)</button>
          <button onClick={() => onUpdatePlayer({ rotation: 90 })} className="hover:text-emerald-400">Down (90°)</button>
          <button onClick={() => onUpdatePlayer({ rotation: 180 })} className="hover:text-emerald-400">Left (180°)</button>
          <button onClick={() => onUpdatePlayer({ rotation: 270 })} className="hover:text-emerald-400">Up (270°)</button>
        </div>
      </div>

      {/* Action Buttons: Duplicate & Delete */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
        <button
          onClick={() => onDuplicatePlayer(player)}
          className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1 transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Duplicate</span>
        </button>
        <button
          onClick={() => onDeletePlayer(player.id)}
          className="flex-1 py-1.5 px-2.5 rounded-lg bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-800/60 flex items-center justify-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};
