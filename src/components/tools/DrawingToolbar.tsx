import React from 'react';
import {
  MousePointer,
  MoveUpRight,
  ArrowRight,
  TrendingUp,
  Activity,
  Square,
  Circle,
  Pencil,
  Type,
  Sparkles,
  Eraser,
  RotateCcw,
  RotateCw,
  Trash2,
} from 'lucide-react';
import { DrawingTool, MarkingSize } from '../../types/tactics';

interface DrawingToolbarProps {
  activeTool: DrawingTool;
  onSelectTool: (tool: DrawingTool) => void;
  drawingColor: string;
  onChangeColor: (color: string) => void;
  markingSize: MarkingSize;
  onChangeMarkingSize: (size: MarkingSize) => void;
  drawingStyle: 'solid' | 'dashed' | 'dotted' | 'wavy';
  onChangeStyle: (style: 'solid' | 'dashed' | 'dotted' | 'wavy') => void;
  activeZoneText: string;
  onChangeZoneText: (text: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClearAnnotations: () => void;
  selectedAnnotationId: string | null;
  onDeleteSelectedAnnotation?: () => void;
}

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  activeTool,
  onSelectTool,
  drawingColor,
  onChangeColor,
  markingSize,
  onChangeMarkingSize,
  drawingStyle,
  onChangeStyle,
  activeZoneText,
  onChangeZoneText,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClearAnnotations,
  selectedAnnotationId,
  onDeleteSelectedAnnotation,
}) => {
  const COLOR_PALETTE = [
    { label: 'White', color: '#ffffff' },
    { label: 'Yellow', color: '#eab308' },
    { label: 'Red', color: '#dc2626' },
    { label: 'Blue', color: '#2563eb' },
    { label: 'Green', color: '#16a34a' },
    { label: 'Orange', color: '#ea580c' },
    { label: 'Cyan', color: '#06b6d4' },
  ];

  // Tool categories with explicit coach labels
  const tacticalLineTools = [
    { id: 'pass' as DrawingTool, label: 'Pass', icon: ArrowRight, shortcut: 'P' },
    { id: 'movement' as DrawingTool, label: 'Move', icon: MoveUpRight, shortcut: 'A' },
    { id: 'curved-run' as DrawingTool, label: 'Curved', icon: TrendingUp, shortcut: 'C' },
    { id: 'dribble' as DrawingTool, label: 'Dribble', icon: Activity, shortcut: 'D' },
  ];

  const tacticalAreaTools = [
    { id: 'zone-rect' as DrawingTool, label: 'Zone', icon: Square, shortcut: 'Z' },
    { id: 'zone-circle' as DrawingTool, label: 'Circle', icon: Circle, shortcut: 'O' },
    { id: 'freehand' as DrawingTool, label: 'Draw', icon: Pencil, shortcut: 'F' },
    { id: 'text' as DrawingTool, label: 'Text', icon: Type, shortcut: 'T' },
  ];

  return (
    <div className="bg-slate-900/98 backdrop-blur-md border border-slate-800 rounded-xl p-2 shadow-tactical flex flex-wrap items-center justify-between gap-2 text-xs">
      {/* Left: Tools with Clear Text Labels */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
        {/* Select Tool */}
        <button
          onClick={() => onSelectTool('select')}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
            activeTool === 'select'
              ? 'bg-emerald-600 text-white shadow-glow-green ring-1 ring-emerald-400'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
          title="Select & Move Players (V)"
        >
          <MousePointer className="w-3.5 h-3.5" />
          <span>Select</span>
        </button>

        <div className="h-5 w-px bg-slate-800 mx-0.5 hidden sm:block" />

        {/* Tactical Line Tools */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-lg border border-slate-800">
          {tacticalLineTools.map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTool(t.id)}
                title={`${t.label} (${t.shortcut})`}
                className={`px-2 py-1 rounded-md flex items-center gap-1 text-[11px] font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden md:inline">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tactical Area / Text Tools */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-lg border border-slate-800">
          {tacticalAreaTools.map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTool(t.id)}
                title={`${t.label} (${t.shortcut})`}
                className={`px-2 py-1 rounded-md flex items-center gap-1 text-[11px] font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden md:inline">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Laser Tool */}
        <button
          onClick={() => onSelectTool('laser')}
          className={`px-2 py-1.5 rounded-lg flex items-center gap-1 text-[11px] font-semibold transition-all ${
            activeTool === 'laser'
              ? 'bg-red-950/90 border border-red-500 text-red-300 shadow-glow-red'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
          title="Laser Pointer for Presentations (L)"
        >
          <Sparkles className="w-3 h-3 text-red-400" />
          <span className="hidden sm:inline">Laser</span>
        </button>
      </div>

      {/* Center/Right: Marking Size Control (Small / Medium / Large), Colors & Styles */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Marking Size Selector (S / M / L) */}
        <div className="flex items-center bg-slate-950/80 px-1 py-0.5 rounded-lg border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 px-1.5 hidden xl:inline">
            Size:
          </span>
          <button
            onClick={() => onChangeMarkingSize('small')}
            className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
              markingSize === 'small'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Small marking size (Default - Clean)"
          >
            Small
          </button>
          <button
            onClick={() => onChangeMarkingSize('medium')}
            className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
              markingSize === 'medium'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Medium marking size"
          >
            Medium
          </button>
          <button
            onClick={() => onChangeMarkingSize('large')}
            className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
              markingSize === 'large'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Large marking size"
          >
            Large
          </button>
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-1 bg-slate-950/80 px-1.5 py-1 rounded-lg border border-slate-800">
          {COLOR_PALETTE.map((c) => (
            <button
              key={c.color}
              onClick={() => onChangeColor(c.color)}
              title={c.label}
              style={{ backgroundColor: c.color }}
              className={`w-3.5 h-3.5 rounded-full transition-transform ${
                drawingColor === c.color ? 'scale-125 ring-2 ring-white' : 'opacity-75 hover:opacity-100'
              }`}
            />
          ))}
        </div>

        {/* Line Style (Solid / Dashed) */}
        <div className="hidden lg:flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => onChangeStyle('solid')}
            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
              drawingStyle === 'solid' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Solid
          </button>
          <button
            onClick={() => onChangeStyle('dashed')}
            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
              drawingStyle === 'dashed' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dashed
          </button>
        </div>

        {/* Undo, Redo, Delete, Clear */}
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {selectedAnnotationId && onDeleteSelectedAnnotation && (
            <button
              onClick={onDeleteSelectedAnnotation}
              title="Delete Selected Drawing"
              className="p-1.5 rounded-lg bg-red-950/70 text-red-300 border border-red-800/60 hover:bg-red-900 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[10px]">Delete</span>
            </button>
          )}

          <button
            onClick={onClearAnnotations}
            title="Clear all drawings on this step"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 transition-colors"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
