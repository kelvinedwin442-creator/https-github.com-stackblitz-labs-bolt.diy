import React, { useState } from 'react';
import { Player, Equipment, EquipmentType, TeamId } from '../../types/tactics';
import {
  Plus,
  UserPlus,
  Target,
  Shield,
  Flag,
  Goal,
  Boxes,
  HelpCircle,
} from 'lucide-react';

interface AddItemsDropdownProps {
  onAddPlayer: (team: TeamId, role: string, isGK?: boolean) => void;
  onAddEquipment: (type: EquipmentType, label?: string) => void;
}

export const AddItemsDropdown: React.FC<AddItemsDropdownProps> = ({
  onAddPlayer,
  onAddEquipment,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Items</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 z-50 w-56 bg-slate-900/98 backdrop-blur-md border border-slate-700 rounded-xl p-2 shadow-tactical text-xs text-slate-200 animate-slide-up flex flex-col gap-1.5">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Add Players
            </div>
            <button
              onClick={() => {
                onAddPlayer('home', 'MID', false);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-blue-400 transition-colors text-left"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>+ Home Player</span>
            </button>
            <button
              onClick={() => {
                onAddPlayer('away', 'MID', false);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-red-400 transition-colors text-left"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>+ Away Player</span>
            </button>
            <button
              onClick={() => {
                onAddPlayer('neutral', 'JOKER', false);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-amber-400 transition-colors text-left"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>+ Neutral / Joker (Yellow)</span>
            </button>

            <div className="border-t border-slate-800 my-1"></div>
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Add Training Equipment
            </div>
            <button
              onClick={() => {
                onAddEquipment('cone');
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-orange-400 transition-colors text-left"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Training Cone</span>
            </button>
            <button
              onClick={() => {
                onAddEquipment('mini-goal');
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-emerald-400 transition-colors text-left"
            >
              <Goal className="w-3.5 h-3.5" />
              <span>Mini Goal</span>
            </button>
            <button
              onClick={() => {
                onAddEquipment('mannequin');
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors text-left"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Mannequin Dummy</span>
            </button>
            <button
              onClick={() => {
                onAddEquipment('passing-gate');
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-cyan-400 transition-colors text-left"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Passing Gate</span>
            </button>
            <button
              onClick={() => {
                onAddEquipment('ladder');
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-yellow-400 transition-colors text-left"
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Agility Ladder</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
