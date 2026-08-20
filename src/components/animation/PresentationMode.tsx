import React, { useState, useEffect } from 'react';
import {
  Session,
  Player,
  Ball,
  Equipment,
  Annotation,
  DrawingTool,
} from '../../types/tactics';
import { FootballPitch } from '../pitch/FootballPitch';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sparkles,
  Minimize2,
  FileText,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface PresentationModeProps {
  session: Session;
  currentStepIndex: number;
  isPlaying: boolean;
  playbackProgress: number;
  playbackSpeed: number;
  currentPlayers: Player[];
  currentBall: Ball;
  currentEquipment: Equipment[];
  currentAnnotations: Annotation[];
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onStepNext: () => void;
  onStepPrev: () => void;
  onStepSelect: (index: number) => void;
  onClose: () => void;
  onAddAnnotation: (ann: Annotation) => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  session,
  currentStepIndex,
  isPlaying,
  playbackProgress,
  playbackSpeed,
  currentPlayers,
  currentBall,
  currentEquipment,
  currentAnnotations,
  onPlay,
  onPause,
  onRestart,
  onStepNext,
  onStepPrev,
  onStepSelect,
  onClose,
  onAddAnnotation,
}) => {
  const [activeTool, setActiveTool] = useState<DrawingTool>('laser');
  const [showNotes, setShowNotes] = useState(true);

  const currentStep = session.steps[currentStepIndex] || session.steps[0];

  // Key navigation in presentation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        if (isPlaying) onPause();
        else onPlay();
      } else if (e.key === 'ArrowRight') {
        onStepNext();
      } else if (e.key === 'ArrowLeft') {
        onStepPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, onPlay, onPause, onStepNext, onStepPrev, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between select-none overflow-hidden animate-fade-in">
      {/* Top Floating Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-4 py-2 rounded-2xl shadow-tactical pointer-events-auto flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h1 className="font-bold text-sm text-white">{session.title}</h1>
            <p className="text-[11px] text-slate-400 font-mono">
              {session.format} • {currentStep.name} (Step {currentStepIndex + 1}/{session.steps.length})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
              showNotes
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle Coaching Points"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white backdrop-blur-md transition-all"
            title="Exit Fullscreen (Esc)"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Large Pitch Area */}
      <div className="w-full h-full flex items-center justify-center p-2 sm:p-6">
        <div className="w-full max-w-6xl h-full max-h-[86vh] flex items-center justify-center">
          <FootballPitch
            pitchConfig={session.pitchConfig}
            homeTeam={session.homeTeam}
            awayTeam={session.awayTeam}
            players={currentPlayers}
            ball={currentBall}
            equipment={currentEquipment}
            annotations={currentAnnotations}
            activeTool={activeTool}
            drawingColor="#ef4444"
            markingSize="small"
            drawingStyle="solid"
            activeZoneText=""
            selectedPlayerId={null}
            selectedEquipmentId={null}
            selectedAnnotationId={null}
            isBallSelected={false}
            isInteractive={true}
            onSelectPlayer={() => {}}
            onSelectEquipment={() => {}}
            onSelectAnnotation={() => {}}
            onSelectBall={() => {}}
            onUpdatePlayerPosition={() => {}}
            onUpdateBallPosition={() => {}}
            onUpdateEquipmentPosition={() => {}}
            onAddAnnotation={onAddAnnotation}
          />
        </div>
      </div>

      {/* Slide-out Coaching Notes Overlay */}
      {showNotes && (session.coachingPoints?.length > 0 || currentStep.description) && (
        <div className="absolute bottom-24 right-6 z-20 max-w-sm bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-4 rounded-2xl shadow-tactical text-xs text-slate-200 animate-slide-up">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Coaching Cues
            </span>
            <button
              onClick={() => setShowNotes(false)}
              className="text-slate-400 hover:text-white"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          {currentStep.description && (
            <p className="text-slate-300 mb-2 font-medium bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              {currentStep.description}
            </p>
          )}
          {session.coachingPoints && session.coachingPoints.length > 0 && (
            <ul className="space-y-1.5 text-slate-300">
              {session.coachingPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Bottom Floating Remote Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-tactical">
        <button
          onClick={onRestart}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={onStepPrev}
          disabled={currentStepIndex === 0}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 transition-colors"
          title="Previous Step"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={isPlaying ? onPause : onPlay}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-white shadow-md transition-all ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-500 shadow-glow-yellow'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-glow-green'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
        <button
          onClick={onStepNext}
          disabled={currentStepIndex === session.steps.length - 1}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 transition-colors"
          title="Next Step"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-slate-700 mx-1" />

        {/* Laser Tool Toggle */}
        <button
          onClick={() => setActiveTool(activeTool === 'laser' ? 'select' : 'laser')}
          className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
            activeTool === 'laser'
              ? 'bg-red-950/80 border-red-500 text-red-400 shadow-glow-red'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Laser Pointer</span>
        </button>

        {/* Step Indicator Pills */}
        <div className="flex items-center gap-1 ml-2">
          {session.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => onStepSelect(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentStepIndex ? 'bg-emerald-400 scale-125 ring-2 ring-emerald-500/40' : 'bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
