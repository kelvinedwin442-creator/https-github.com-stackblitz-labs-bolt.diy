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
  Sliders,
} from 'lucide-react';
import { DrawingTool } from '../../types/tactics';

interface DrawingToolbarProps {
  activeTool: DrawingTool;
  onSelectTool: (tool: DrawingTool) => void;
  drawingColor: string;
  onChangeColor: (color: string) => void;
  drawingStyle: 'solid' | 'dashed' | 'dotted' | 'wavy';
  onChangeStyle: (style: 'solid' | 'dashed' | 'dotted' | 'wavy') => void;
  strokeWidth: number;
  onChangeStrokeWidth: (width: number) => void;
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
  drawingStyle,
  onChangeStyle,
  strokeWidth,
  onChangeStrokeWidth,
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
    { label: 'Red', color: '#dc2626' },
    { label: 'Blue', color: '#2563eb' },
    { label: 'Green', color: '#16a34a' },
    { label: 'Yellow', color: '#eab308' },
    { label: 'Orange', color: '#ea580c' },
    { label: 'Purple', color: '#9333ea' },
    { label: 'Cyan', color: '#06b6d4' },
  ];

  const tools = [
    { id: 'select' as DrawingTool, label: 'Select / Move (V)', icon: MousePointer, hotkey: 'V' },
    { id: 'pass' as DrawingTool, label: 'Passing Line (P)', icon: ArrowRight, hotkey: 'P' },
    { id: 'movement' as DrawingTool, label: 'Movement Arrow (A)', icon: MoveUpRight, hotkey: 'A' },
    { id: 'curved-run' as DrawingTool, label: 'Curved Run (C)', icon: TrendingUp, hotkey: 'C' },
    { id: 'dribble' as DrawingTool, label: 'Dribble Run (D)', icon: Activity, hotkey: 'D' },
    { id: 'zone-rect' as DrawingTool, label: 'Zone Box (Z)', icon: Square, hotkey: 'Z' },
    { id: 'zone-circle' as DrawingTool, label: 'Zone Circle (O)', icon: Circle, hotkey: 'O' },
    { id: 'freehand' as DrawingTool, label: 'Pen Sketch (F)', icon: Pencil, hotkey: 'F' },
    { id: 'text' as DrawingTool, label: 'Text Label (T)', icon: Type, hotkey: 'T' },
    { id: 'laser' as DrawingTool, label: 'Laser Pointer (L)', icon: Sparkles, hotkey: 'L' },
  ];

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 shadow-tactical flex flex-wrap items-center justify-between gap-2 text-xs">
      {/* Tool Buttons */}
      <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTool(t.id)}
              title={t.label}
              className={`p-2 rounded-lg flex items-center justify-center transition-all duration-150 relative ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-glow-green font-semibold ring-2 ring-emerald-400/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Center Group: Colors, Styles & Zone Label */}
      <div className="flex items-center gap-3">
        {/* Color Swatches */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1.5 rounded-lg border border-slate-700/60">
          {COLOR_PALETTE.map((c) => (
            <button
              key={c.color}
              onClick={() => onChangeColor(c.color)}
              title={c.label}
              style={{ backgroundColor: c.color }}
              className={`w-4 h-4 rounded-full transition-transform ${
                drawingColor === c.color ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-slate-900' : 'hover:scale-110 opacity-80 hover:opacity-100'
              }`}
            />
          ))}
        </div>

        {/* Line Style (Solid / Dashed / Dotted) */}
        <div className="hidden sm:flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
          <button
            onClick={() => onChangeStyle('solid')}
            title="Solid Line"
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              drawingStyle === 'solid' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Solid
          </button>
          <button
            onClick={() => onChangeStyle('dashed')}
            title="Dashed Line"
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              drawingStyle === 'dashed' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dashed
          </button>
          <button
            onClick={() => onChangeStyle('dotted')}
            title="Dotted Line"
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              drawingStyle === 'dotted' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dotted
          </button>
        </div>

        {/* Stroke Width Toggle */}
        <div className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
          {[1.5, 2.5, 4].map((w) => (
            <button
              key={w}
              onClick={() => onChangeStrokeWidth(w)}
              title={`Stroke width ${w}`}
              className={`px-1.5 py-0.5 rounded font-mono text-[11px] ${
                strokeWidth === w ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {w === 1.5 ? '1x' : w === 2.5 ? '2x' : '3x'}
            </button>
          ))}
        </div>

        {/* Optional Zone Tag Input */}
        {(activeTool === 'zone-rect' || activeTool === 'zone-circle' || activeTool === 'text') && (
          <input
            type="text"
            placeholder="Label text..."
            value={activeZoneText}
            onChange={(e) => onChangeZoneText(e.target.value)}
            className="bg-slate-800 text-white px-2 py-1 rounded-md border border-slate-700 text-xs w-28 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        )}
      </div>

      {/* Right Group: Undo, Redo, Delete, Clear */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z / Cmd+Z)"
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y / Cmd+Shift+Z)"
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        {selectedAnnotationId && onDeleteSelectedAnnotation && (
          <button
            onClick={onDeleteSelectedAnnotation}
            title="Delete Selected Drawing"
            className="p-2 rounded-lg bg-red-950/60 text-red-400 hover:bg-red-900 border border-red-800/50 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Delete Item</span>
          </button>
        )}

        <button
          onClick={onClearAnnotations}
          title="Clear all drawings on this step"
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-red-900/50 hover:text-red-300 transition-colors flex items-center gap-1"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span className="hidden xl:inline text-[11px]">Clear Drawings</span>
        </button>
      </div>
    </div>
  );
};
