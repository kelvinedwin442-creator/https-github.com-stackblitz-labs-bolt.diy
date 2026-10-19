import React, { useState } from 'react';
import { KeyframeStep } from '../../types/tactics';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Plus,
  Copy,
  Trash2,
  Maximize2,
  Repeat,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Check,
} from 'lucide-react';

interface AnimationTimelineProps {
  steps: KeyframeStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  playbackProgress: number;
  playbackSpeed: number;
  isLooping: boolean;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onStepSelect: (index: number) => void;
  onStepNext: () => void;
  onStepPrev: () => void;
  onAddStep: () => void;
  onDuplicateStep: (index: number) => void;
  onDeleteStep: (index: number) => void;
  onMoveStep: (fromIndex: number, toIndex: number) => void;
  onUpdateStepName: (index: number, name: string, description?: string) => void;
  onChangeSpeed: (speed: number) => void;
  onToggleLoop: () => void;
  onOpenPresentation: () => void;
  onScrubTimeline: (progressFraction: number) => void;
}

export const AnimationTimeline: React.FC<AnimationTimelineProps> = ({
  steps,
  currentStepIndex,
  isPlaying,
  playbackProgress,
  playbackSpeed,
  isLooping,
  onPlay,
  onPause,
  onRestart,
  onStepSelect,
  onStepNext,
  onStepPrev,
  onAddStep,
  onDuplicateStep,
  onDeleteStep,
  onMoveStep,
  onUpdateStepName,
  onChangeSpeed,
  onToggleLoop,
  onOpenPresentation,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDesc, setEditingDesc] = useState('');

  const currentStep = steps[currentStepIndex] || steps[0];

  const handleStartEdit = () => {
    setEditingTitle(currentStep.name);
    setEditingDesc(currentStep.description || '');
    setIsEditingName(true);
  };

  const handleSaveEdit = () => {
    onUpdateStepName(currentStepIndex, editingTitle, editingDesc);
    setIsEditingName(false);
  };

  return (
    <div className="bg-slate-900/98 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 shadow-tactical flex flex-col gap-2 text-xs text-slate-100">
      {/* Top Row: Playback Controls, Step Title, Speed & Presentation */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        {/* Play/Pause & Step Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={onRestart}
            title="Restart to Step 1"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onStepPrev}
            disabled={currentStepIndex === 0}
            title="Previous Step"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {/* Primary Play/Pause Button */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            title={isPlaying ? 'Pause Sequence (Space)' : 'Play Sequence (Space)'}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-glow-yellow'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-green'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Play Movement</span>
              </>
            )}
          </button>

          <button
            onClick={onStepNext}
            disabled={currentStepIndex === steps.length - 1}
            title="Next Step"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Loop toggle */}
          <button
            onClick={onToggleLoop}
            title="Toggle Continuous Loop"
            className={`p-1.5 rounded-lg border transition-all ${
              isLooping
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Repeat className="w-3 h-3" />
          </button>
        </div>

        {/* Center: Current Step Title */}
        <div className="flex-1 min-w-[160px] max-w-sm px-2 flex items-center justify-between bg-slate-950/70 py-1 px-2.5 rounded-lg border border-slate-800">
          {isEditingName ? (
            <div className="flex items-center gap-1.5 w-full">
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-xs text-white outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Step name..."
              />
              <button
                onClick={handleSaveEdit}
                className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-500"
              >
                <Check className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="truncate">
                <span className="font-semibold text-slate-200">
                  {currentStep.name}
                </span>
                {currentStep.description && (
                  <span className="hidden sm:inline text-slate-400 text-[10px] ml-2">
                    — {currentStep.description}
                  </span>
                )}
              </div>
              <button
                onClick={handleStartEdit}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 ml-1 flex-shrink-0"
                title="Rename step"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Speed & Add Step */}
        <div className="flex items-center gap-1.5">
          {/* Speed Buttons — 0.25x exists because "show me the movement again, slower"
              is the single most common request from a player who missed it at full pace */}
          <div className="flex items-center bg-slate-950/80 rounded-lg p-0.5 border border-slate-800 overflow-x-auto">
            {[0.25, 0.5, 1, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold ${
                  playbackSpeed === s
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s === 0.25 ? '¼×' : `${s}x`}
              </button>
            ))}
          </div>

          {/* Quick Present */}
          <button
            onClick={onOpenPresentation}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
            title="Present Fullscreen"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden sm:inline">Present</span>
          </button>
        </div>
      </div>

      {/* Middle Row: Scrubber Timeline Bar */}
      <div className="flex items-center gap-2 pt-0.5">
        <span className="text-[10px] font-mono text-slate-400 w-12 text-right">
          Step {currentStepIndex + 1}/{steps.length}
        </span>
        <div className="flex-1 relative h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-75"
            style={{
              width: `${
                ((currentStepIndex + playbackProgress) / Math.max(1, steps.length)) * 100
              }%`,
            }}
          />
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {(steps.reduce((acc, s) => acc + s.duration, 0) / playbackSpeed).toFixed(1)}s
        </span>
      </div>

      {/* Bottom Row: Step Thumbnails */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        {steps.map((step, idx) => {
          const isSelected = idx === currentStepIndex;
          return (
            <div
              key={step.id}
              onClick={() => onStepSelect(idx)}
              className={`flex-shrink-0 cursor-pointer rounded-lg px-2 py-1 border transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-glow-green'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center font-mono font-bold text-[9px] ${
                  isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {idx + 1}
              </div>
              <span className="font-semibold text-xs truncate max-w-[90px]">
                {step.name}
              </span>

              {/* Step Quick Actions */}
              {isSelected && steps.length > 1 && (
                <div className="flex items-center gap-0.5 ml-1 pl-1 border-l border-slate-700">
                  {idx > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveStep(idx, idx - 1);
                      }}
                      title="Move left"
                      className="p-0.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                    >
                      <ChevronLeft className="w-2.5 h-2.5" />
                    </button>
                  )}
                  {idx < steps.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveStep(idx, idx + 1);
                      }}
                      title="Move right"
                      className="p-0.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                    >
                      <ChevronRight className="w-2.5 h-2.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateStep(idx);
                    }}
                    title="Duplicate step"
                    className="p-0.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                  >
                    <Copy className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteStep(idx);
                    }}
                    title="Delete step"
                    className="p-0.5 hover:bg-red-900/60 rounded text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Step Button */}
        <button
          onClick={onAddStep}
          className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 flex items-center gap-1 transition-all text-xs font-bold"
          title="Add Next Tactical Movement Step"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>+ Next Step</span>
        </button>
      </div>
    </div>
  );
};
