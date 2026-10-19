import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Session,
  Player,
  Ball,
  Equipment,
  Annotation,
  DrawingTool,
  MatchFormat,
  TeamId,
  EquipmentType,
  MarkingSize,
} from '../../types/tactics';
import { FootballPitch } from '../pitch/FootballPitch';
import { DrawingToolbar } from '../tools/DrawingToolbar';
import { PlayerInspector } from '../tools/PlayerInspector';
import { PitchSettingsPanel } from '../tools/PitchSettingsPanel';
import { FormationResetModal } from '../tools/FormationResetModal';
import { AddItemsDropdown } from '../tools/AddItemsDropdown';
import { AnimationTimeline } from '../animation/AnimationTimeline';
import { PresentationMode } from '../animation/PresentationMode';
import { VideoWorkspacePanel } from '../video/VideoWorkspacePanel';
import { SessionInfoDrawer } from '../session/SessionInfoDrawer';
import { createPlayersFromFormation } from '../../data/formations';
import { lerp, easeInOutCubic } from '../../utils/pitchGeometry';
import { exportPitchAsPng } from '../../utils/exportImage';
import { defaultMarkingSize, useKitSettings } from '../../utils/kitSettings';
import { CueRecorder } from '../kit/CueRecorder';
import { cueKeyForSession } from '../../utils/voiceNotes';
import { addLog } from '../../utils/coachLog';
import {
  ArrowLeft,
  Save,
  Video,
  FileText,
  Sliders,
  Maximize2,
  Check,
  RotateCcw,
  Camera,
  ChevronRight,
  Sparkles,
  ListChecks,
  Info,
} from 'lucide-react';

interface TacticalWorkspaceProps {
  session: Session;
  onSaveSession: (updatedSession: Session) => void;
  onBackToDashboard: () => void;
  onDuplicateSession: (id: string) => void;
  onExportJson: (session: Session) => void;
}

export const TacticalWorkspace: React.FC<TacticalWorkspaceProps> = ({
  session: initialSession,
  onSaveSession,
  onBackToDashboard,
  onDuplicateSession,
  onExportJson,
}) => {
  const [session, setSession] = useState<Session>(initialSession);
  const [currentStepIndex, setCurrentStepIndex] = useState(session.currentStepIndex || 0);

  // Active Tools & Drawing settings (Defaulting to small, refined marking size)
  const [activeTool, setActiveTool] = useState<DrawingTool>('select');
  const [drawingColor, setDrawingColor] = useState<string>('#ffffff');
  // Opens huddle-sized (big markings) when the coach is working in front of players on a
  // phone, and fine-sized when they are prepping on a laptop or projector.
  const [kitSettings] = useKitSettings();
  const [markingSize, setMarkingSize] = useState<MarkingSize>(
    () => initialSession.markingSize ?? defaultMarkingSize()
  );
  const [drawingStyle, setDrawingStyle] = useState<'solid' | 'dashed' | 'dotted' | 'wavy'>('solid');
  const [activeZoneText, setActiveZoneText] = useState<string>('');

  // Selected entities
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [isBallSelected, setIsBallSelected] = useState<boolean>(false);

  // Panels & Modals
  const [showPitchSettings, setShowPitchSettings] = useState(false);
  const [showSessionInfo, setShowSessionInfo] = useState(false);
  const [showVideoPanel, setShowVideoPanel] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [logFlash, setLogFlash] = useState(false);

  // Animation Playback Engine state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0); // 0 to 1
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(true);

  // Undo / Redo history stack
  const [history, setHistory] = useState<Session[]>([initialSession]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Push to history
  const pushHistory = useCallback((newSessionState: Session) => {
    setHistory((prev) => {
      const upToCurrent = prev.slice(0, historyIndex + 1);
      return [...upToCurrent, newSessionState].slice(-25);
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 24));
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const targetState = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setSession(targetState);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const targetState = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setSession(targetState);
    }
  }, [history, historyIndex]);

  const currentStep = session.steps[currentStepIndex] || session.steps[0];

  // Animated interpolations
  const [animatedPlayers, setAnimatedPlayers] = useState<Player[]>(currentStep.players);
  const [animatedBall, setAnimatedBall] = useState<Ball>(currentStep.ball);

  useEffect(() => {
    if (!isPlaying) {
      setAnimatedPlayers(currentStep.players);
      setAnimatedBall(currentStep.ball);
    }
  }, [currentStepIndex, session.steps, isPlaying]);

  // Animation Loop: 60fps interpolation
  const animationFrameRef = useRef<number | null>(null);
  const animStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const currentStepObj = session.steps[currentStepIndex];
    const nextStepIndex = (currentStepIndex + 1) % session.steps.length;
    const nextStepObj = session.steps[nextStepIndex];
    const stepDurationMs = ((currentStepObj.duration || 2.0) * 1000) / playbackSpeed;

    const stepStartPlayers = currentStepObj.players;
    const targetPlayers = nextStepObj.players;
    const stepStartBall = currentStepObj.ball;
    const targetBall = nextStepObj.ball;

    animStartTimeRef.current = performance.now();

    const frame = (now: number) => {
      const elapsed = now - (animStartTimeRef.current || now);
      const rawProgress = Math.min(1, elapsed / stepDurationMs);
      const easedProgress = easeInOutCubic(rawProgress);

      setPlaybackProgress(rawProgress);

      const interpolatedPlayers = stepStartPlayers.map((p1) => {
        const p2 = targetPlayers.find((p) => p.id === p1.id || (p.team === p1.team && p.number === p1.number));
        if (!p2) return p1;

        return {
          ...p1,
          x: lerp(p1.x, p2.x, easedProgress),
          y: lerp(p1.y, p2.y, easedProgress),
          rotation: lerp(p1.rotation ?? 0, p2.rotation ?? 0, easedProgress),
        };
      });

      const interpolatedBall = {
        ...stepStartBall,
        x: lerp(stepStartBall.x, targetBall.x, easedProgress),
        y: lerp(stepStartBall.y, targetBall.y, easedProgress),
      };

      setAnimatedPlayers(interpolatedPlayers);
      setAnimatedBall(interpolatedBall);

      if (rawProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(frame);
      } else {
        if (nextStepIndex === 0 && !isLooping) {
          setIsPlaying(false);
          setPlaybackProgress(0);
        } else {
          setCurrentStepIndex(nextStepIndex);
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(frame);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, currentStepIndex, session.steps, playbackSpeed, isLooping]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        if (currentStepIndex < session.steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStepIndex > 0) {
          setCurrentStepIndex((prev) => prev - 1);
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key.toLowerCase() === 'v') {
        setActiveTool('select');
      } else if (e.key.toLowerCase() === 'p') {
        setActiveTool('pass');
      } else if (e.key.toLowerCase() === 'a') {
        setActiveTool('movement');
      } else if (e.key.toLowerCase() === 'c') {
        setActiveTool('curved-run');
      } else if (e.key.toLowerCase() === 'd') {
        setActiveTool('dribble');
      } else if (e.key.toLowerCase() === 'z') {
        setActiveTool('zone-rect');
      } else if (e.key.toLowerCase() === 'f') {
        setActiveTool('freehand');
      } else if (e.key.toLowerCase() === 't') {
        setActiveTool('text');
      } else if (e.key.toLowerCase() === 'l') {
        setActiveTool('laser');
      } else if (e.key === 'Escape') {
        setSelectedPlayerId(null);
        setSelectedEquipmentId(null);
        setSelectedAnnotationId(null);
        setIsBallSelected(false);
        setActiveTool('select');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, session.steps.length, handleUndo, handleRedo]);

  const handleSave = () => {
    onSaveSession(session);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const updateCurrentStep = (updater: (step: typeof currentStep) => typeof currentStep) => {
    const updatedSteps = [...session.steps];
    const newStep = updater(currentStep);
    updatedSteps[currentStepIndex] = newStep;
    const newSession = {
      ...session,
      steps: updatedSteps,
      updatedAt: new Date().toISOString(),
    };
    setSession(newSession);
    pushHistory(newSession);
  };

  const handleUpdatePlayerPosition = (id: string, x: number, y: number) => {
    updateCurrentStep((step) => ({
      ...step,
      players: step.players.map((p) => (p.id === id ? { ...p, x, y } : p)),
    }));
  };

  const handleUpdateBallPosition = (x: number, y: number) => {
    updateCurrentStep((step) => ({
      ...step,
      ball: { ...step.ball, x, y },
    }));
  };

  const handleUpdateEquipmentPosition = (id: string, x: number, y: number) => {
    updateCurrentStep((step) => ({
      ...step,
      equipment: step.equipment.map((eq) => (eq.id === id ? { ...eq, x, y } : eq)),
    }));
  };

  const handleAddAnnotation = (ann: Annotation) => {
    updateCurrentStep((step) => ({
      ...step,
      annotations: [...step.annotations, { ...ann, size: ann.size || markingSize }],
    }));
  };

  const handleDeleteAnnotation = (id: string) => {
    updateCurrentStep((step) => ({
      ...step,
      annotations: step.annotations.filter((a) => a.id !== id),
    }));
    setSelectedAnnotationId(null);
  };

  const handleClearAnnotations = () => {
    if (window.confirm('Clear all drawings and annotations on this step?')) {
      updateCurrentStep((step) => ({
        ...step,
        annotations: [],
      }));
    }
  };

  const handleUpdatePlayerDetails = (updated: Partial<Player>) => {
    if (!selectedPlayerId) return;
    updateCurrentStep((step) => ({
      ...step,
      players: step.players.map((p) => (p.id === selectedPlayerId ? { ...p, ...updated } : p)),
    }));
  };

  const handleDeletePlayer = (id: string) => {
    updateCurrentStep((step) => ({
      ...step,
      players: step.players.filter((p) => p.id !== id),
    }));
    setSelectedPlayerId(null);
  };

  const handleDuplicatePlayer = (player: Player) => {
    const newPlayer: Player = {
      ...player,
      id: `p-${Date.now()}`,
      number: player.number + 1,
      x: Math.min(95, player.x + 4),
      y: Math.min(95, player.y + 4),
    };
    updateCurrentStep((step) => ({
      ...step,
      players: [...step.players, newPlayer],
    }));
    setSelectedPlayerId(newPlayer.id);
  };

  const handleAddPlayer = (team: TeamId, role: string, isGK = false) => {
    const existingCount = currentStep.players.filter((p) => p.team === team).length;
    const newPlayer: Player = {
      id: `p-${Date.now()}`,
      team,
      number: existingCount + 1,
      name: role,
      role,
      isGK,
      x: team === 'home' ? 30 : 70,
      y: 50,
      rotation: team === 'home' ? 0 : 180,
    };
    updateCurrentStep((step) => ({
      ...step,
      players: [...step.players, newPlayer],
    }));
    setSelectedPlayerId(newPlayer.id);
  };

  const handleAddEquipment = (type: EquipmentType, label?: string) => {
    const newEq: Equipment = {
      id: `eq-${Date.now()}`,
      type,
      x: 50,
      y: 50,
      label,
    };
    updateCurrentStep((step) => ({
      ...step,
      equipment: [...(step.equipment || []), newEq],
    }));
    setSelectedEquipmentId(newEq.id);
  };

  const handleApplyFormation = (target: 'both' | 'home' | 'away', homeForm: string, awayForm: string) => {
    const fullNewPlayers = createPlayersFromFormation(session.format, homeForm, awayForm);
    let updatedPlayers: Player[];

    if (target === 'both') {
      updatedPlayers = fullNewPlayers;
    } else if (target === 'home') {
      const homeNew = fullNewPlayers.filter((p) => p.team === 'home');
      const awayCurrent = currentStep.players.filter((p) => p.team !== 'home');
      updatedPlayers = [...homeNew, ...awayCurrent];
    } else {
      const awayNew = fullNewPlayers.filter((p) => p.team === 'away');
      const homeCurrent = currentStep.players.filter((p) => p.team !== 'away');
      updatedPlayers = [...homeCurrent, ...awayNew];
    }

    const newSession = {
      ...session,
      homeTeam: { ...session.homeTeam, formation: homeForm },
      awayTeam: { ...session.awayTeam, formation: awayForm },
      steps: session.steps.map((s, idx) =>
        idx === currentStepIndex ? { ...s, players: updatedPlayers } : s
      ),
    };
    setSession(newSession);
    pushHistory(newSession);
  };

  const handleAddStep = () => {
    const newStepIndex = session.steps.length;
    const newStep = {
      ...JSON.parse(JSON.stringify(currentStep)),
      id: `step-${Date.now()}`,
      name: `Step ${newStepIndex + 1}: Move`,
      duration: 2.0,
      annotations: [],
    };
    const updatedSteps = [...session.steps, newStep];
    const newSession = { ...session, steps: updatedSteps };
    setSession(newSession);
    setCurrentStepIndex(newStepIndex);
    pushHistory(newSession);
  };

  const handleDuplicateStep = (index: number) => {
    const original = session.steps[index];
    const dup = {
      ...JSON.parse(JSON.stringify(original)),
      id: `step-${Date.now()}`,
      name: `${original.name} (Copy)`,
    };
    const updatedSteps = [...session.steps];
    updatedSteps.splice(index + 1, 0, dup);
    const newSession = { ...session, steps: updatedSteps };
    setSession(newSession);
    setCurrentStepIndex(index + 1);
    pushHistory(newSession);
  };

  const handleDeleteStep = (index: number) => {
    if (session.steps.length <= 1) return;
    const updatedSteps = session.steps.filter((_, i) => i !== index);
    const newSession = { ...session, steps: updatedSteps };
    setSession(newSession);
    setCurrentStepIndex(Math.max(0, index - 1));
    pushHistory(newSession);
  };

  const handleMoveStep = (from: number, to: number) => {
    const updatedSteps = [...session.steps];
    const [moved] = updatedSteps.splice(from, 1);
    updatedSteps.splice(to, 0, moved);
    const newSession = { ...session, steps: updatedSteps };
    setSession(newSession);
    setCurrentStepIndex(to);
    pushHistory(newSession);
  };

  const handleUpdateStepName = (index: number, name: string, description?: string) => {
    const updatedSteps = [...session.steps];
    updatedSteps[index] = { ...updatedSteps[index], name, description };
    const newSession = { ...session, steps: updatedSteps };
    setSession(newSession);
    pushHistory(newSession);
  };

  const selectedPlayer = currentStep.players.find((p) => p.id === selectedPlayerId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between select-none overflow-x-hidden">
      {/* Top Workspace Header Bar */}
      <header className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-30 px-3 sm:px-5 py-2 flex items-center justify-between gap-2 shadow-md">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onBackToDashboard}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex-shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1
                onClick={() => setShowSessionInfo(true)}
                className="font-bold text-xs sm:text-sm md:text-base text-white hover:text-emerald-400 cursor-pointer truncate transition-colors max-w-[140px] sm:max-w-xs md:max-w-md"
                title="Click to edit session details"
              >
                {session.title}
              </h1>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                {session.format}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate hidden md:block">
              {session.homeTeam.name} vs {session.awayTeam.name}
            </p>
          </div>
        </div>

        {/* Center: Simplified Coach Workflow Guide Pill (Hidden on smallest mobile) */}
        <div className="hidden xl:flex items-center gap-1 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800 text-[11px] font-medium text-slate-400">
          <button
            onClick={() => setActiveTool('select')}
            className={`hover:text-white transition-colors ${activeTool === 'select' ? 'text-emerald-400 font-bold' : ''}`}
          >
            1. Set Up
          </button>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <button
            onClick={() => setActiveTool('pass')}
            className={`hover:text-white transition-colors ${activeTool !== 'select' && activeTool !== 'laser' ? 'text-emerald-400 font-bold' : ''}`}
          >
            2. Add Movements
          </button>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`hover:text-white transition-colors ${isPlaying ? 'text-emerald-400 font-bold' : ''}`}
          >
            3. Animate
          </button>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <button
            onClick={() => setShowPresentation(true)}
            className="hover:text-indigo-400 transition-colors"
          >
            4. Present
          </button>
        </div>

        {/* Right: Workspace Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {/* Add Items Dropdown */}
          <AddItemsDropdown
            onAddPlayer={handleAddPlayer}
            onAddEquipment={handleAddEquipment}
          />

          {/* Reset Formation Button */}
          <button
            onClick={() => setShowResetModal(true)}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Change Formations"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Formation</span>
          </button>

          {/* Video Workspace Toggle */}
          <button
            onClick={() => {
              setShowVideoPanel(!showVideoPanel);
              if (showSessionInfo) setShowSessionInfo(false);
            }}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
              showVideoPanel
                ? 'bg-indigo-950 border-indigo-500 text-indigo-300 shadow-glow-blue'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Toggle Video Studio"
          >
            <Video className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xl:inline">Video</span>
          </button>

          {/* Coaching Notes Drawer Toggle */}
          <button
            onClick={() => {
              setShowSessionInfo(!showSessionInfo);
              if (showVideoPanel) setShowVideoPanel(false);
            }}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
              showSessionInfo
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-glow-green'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Session Info & Coaching Cues"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">Notes</span>
          </button>

          {/* Pitch Config Toggle */}
          <button
            onClick={() => setShowPitchSettings(!showPitchSettings)}
            className={`p-1.5 sm:p-2 rounded-lg border text-xs transition-all ${
              showPitchSettings
                ? 'bg-slate-700 border-emerald-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Pitch Themes & Grid Settings"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* Export PNG Diagram */}
          <button
            onClick={() => {
              const svgEl = document.querySelector('svg.w-full.h-full') as SVGSVGElement;
              if (svgEl) {
                exportPitchAsPng(svgEl, session.title, currentStep.name);
              }
            }}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Download Tactical Diagram as PNG"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">PNG</span>
          </button>

          {/* Presentation Mode Button */}
          <button
            onClick={() => setShowPresentation(true)}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
            title="Present Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Present</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="px-2.5 py-1.5 sm:px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-glow-green transition-all"
          >
            {savedFeedback ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{savedFeedback ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </header>

      {/* Main Tactical Working Canvas Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-1.5 sm:p-3 flex flex-col gap-2 relative">
        {/* Drawing Toolbar directly above the pitch */}
        <DrawingToolbar
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          drawingColor={drawingColor}
          onChangeColor={setDrawingColor}
          markingSize={markingSize}
          onChangeMarkingSize={(nextSize) => {
            setMarkingSize(nextSize);
            setSession((prev) => ({ ...prev, markingSize: nextSize }));
          }}
          drawingStyle={drawingStyle}
          onChangeStyle={setDrawingStyle}
          activeZoneText={activeZoneText}
          onChangeZoneText={setActiveZoneText}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClearAnnotations={handleClearAnnotations}
          selectedAnnotationId={selectedAnnotationId}
          onDeleteSelectedAnnotation={() => {
            if (selectedAnnotationId) handleDeleteAnnotation(selectedAnnotationId);
          }}
        />

          {/* Pitch-side cue strip: the one sentence to say out loud, recordable on the spot */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl px-2.5 py-2">
            <div className="flex-1 min-w-0">
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-extrabold">
                Say this · step {currentStepIndex + 1} of {session.steps.length}
              </p>
              <p
                className={`font-display font-extrabold text-emerald-400 leading-tight ${
                  markingSize === 'large' ? 'text-xl sm:text-2xl' : markingSize === 'medium' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                }`}
              >
                {currentStep.description || 'Add the sentence you will say (Notes), so the board speaks for you'}
              </p>
              {session.kitMeta?.cues?.[currentStepIndex]?.cuePcm && kitSettings.showPidginCues && (
                <p className="mt-0.5 text-[11px] font-semibold text-amber-300/90">
                  “{session.kitMeta.cues[currentStepIndex].cuePcm}”
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <CueRecorder storeKey={cueKeyForSession(session.id, currentStepIndex)} script={currentStep.description} compact />
              <button
                onClick={() => {
                  addLog({
                    date: new Date().toISOString(),
                    drillId: session.drillId,
                    title: session.title,
                    band: session.ageGroup,
                    minutes: session.kitMeta?.minutes ?? 45,
                    players: currentStep.players.length,
                    note: `${session.format} · ${session.steps.length} steps`,
                  });
                  setLogFlash(true);
                  window.setTimeout(() => setLogFlash(false), 2200);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1.5"
                title="Count this session in your coach log (stays on this phone)"
              >
                <ListChecks className="w-3.5 h-3.5 text-emerald-400" />
                {logFlash ? 'Logged' : 'I ran it'}
              </button>
              {session.kitMeta && (
                <span className="text-[10px] text-slate-500 flex items-center gap-1" title={session.kitMeta.space}>
                  <Info className="w-3 h-3" />
                  {session.kitMeta.balls}
                </span>
              )}
            </div>
          </div>

        {/* Pitch Container & Side Panels Grid */}
        <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-2.5 min-h-[420px] relative">
          {/* Main Pitch Field */}
          <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-1 sm:p-3 flex items-center justify-center relative overflow-hidden shadow-tactical">
            <FootballPitch
              pitchConfig={session.pitchConfig}
              homeTeam={session.homeTeam}
              awayTeam={session.awayTeam}
              players={isPlaying ? animatedPlayers : currentStep.players}
              ball={isPlaying ? animatedBall : currentStep.ball}
              equipment={currentStep.equipment || []}
              annotations={currentStep.annotations || []}
              activeTool={activeTool}
              drawingColor={drawingColor}
              markingSize={markingSize}
              drawingStyle={drawingStyle}
              activeZoneText={activeZoneText}
              selectedPlayerId={selectedPlayerId}
              selectedEquipmentId={selectedEquipmentId}
              selectedAnnotationId={selectedAnnotationId}
              isBallSelected={isBallSelected}
              isInteractive={!isPlaying}
              onSelectPlayer={(id) => {
                setSelectedPlayerId(id);
                setSelectedEquipmentId(null);
                setSelectedAnnotationId(null);
                setIsBallSelected(false);
              }}
              onSelectEquipment={(id) => {
                setSelectedEquipmentId(id);
                setSelectedPlayerId(null);
                setSelectedAnnotationId(null);
                setIsBallSelected(false);
              }}
              onSelectAnnotation={(id) => {
                setSelectedAnnotationId(id);
                setSelectedPlayerId(null);
                setSelectedEquipmentId(null);
                setIsBallSelected(false);
              }}
              onSelectBall={(sel) => {
                setIsBallSelected(sel);
                setSelectedPlayerId(null);
                setSelectedEquipmentId(null);
                setSelectedAnnotationId(null);
              }}
              onUpdatePlayerPosition={handleUpdatePlayerPosition}
              onUpdateBallPosition={handleUpdateBallPosition}
              onUpdateEquipmentPosition={handleUpdateEquipmentPosition}
              onAddAnnotation={handleAddAnnotation}
              onDeleteAnnotation={handleDeleteAnnotation}
            />

            {/* Floating Player Inspector Widget */}
            {selectedPlayer && !isPlaying && (
              <div className="absolute top-3 right-3 z-20">
                <PlayerInspector
                  player={selectedPlayer}
                  teamConfig={selectedPlayer.team === 'home' ? session.homeTeam : session.awayTeam}
                  onUpdatePlayer={handleUpdatePlayerDetails}
                  onDeletePlayer={handleDeletePlayer}
                  onDuplicatePlayer={handleDuplicatePlayer}
                  onClose={() => setSelectedPlayerId(null)}
                />
              </div>
            )}
          </div>

          {/* Pitch Settings Slide-over Drawer */}
          {showPitchSettings && (
            <div className="w-full lg:w-72 flex-shrink-0 animate-slide-up">
              <PitchSettingsPanel
                format={session.format}
                onChangeFormat={(f) => {
                  setSession((prev) => ({ ...prev, format: f }));
                  setShowResetModal(true);
                }}
                pitchConfig={session.pitchConfig}
                onChangePitchConfig={(cfg) => {
                  setSession((prev) => ({
                    ...prev,
                    pitchConfig: { ...prev.pitchConfig, ...cfg },
                  }));
                }}
                homeTeam={session.homeTeam}
                awayTeam={session.awayTeam}
                onUpdateHomeTeam={(t) => {
                  setSession((prev) => ({
                    ...prev,
                    homeTeam: { ...prev.homeTeam, ...t },
                  }));
                }}
                onUpdateAwayTeam={(t) => {
                  setSession((prev) => ({
                    ...prev,
                    awayTeam: { ...prev.awayTeam, ...t },
                  }));
                }}
                onOpenResetModal={() => setShowResetModal(true)}
              />
            </div>
          )}

          {/* Video Side Panel */}
          {showVideoPanel && (
            <div className="w-full lg:w-[440px] flex-shrink-0 animate-slide-up">
              <VideoWorkspacePanel
                videoUrl={session.videoUrl}
                videoFileName={session.videoFileName}
                bookmarks={session.videoBookmarks || []}
                currentStepIndex={currentStepIndex}
                steps={session.steps}
                onSetVideo={(url, fileName) => {
                  setSession((prev) => ({
                    ...prev,
                    videoUrl: url,
                    videoFileName: fileName,
                  }));
                }}
                onAddBookmark={(time, label, stepId) => {
                  const newBm = {
                    id: `bm-${Date.now()}`,
                    time,
                    label,
                    stepId,
                  };
                  setSession((prev) => ({
                    ...prev,
                    videoBookmarks: [...(prev.videoBookmarks || []), newBm],
                  }));
                }}
                onDeleteBookmark={(id) => {
                  setSession((prev) => ({
                    ...prev,
                    videoBookmarks: (prev.videoBookmarks || []).filter((b) => b.id !== id),
                  }));
                }}
                onStepSelect={setCurrentStepIndex}
                onClose={() => setShowVideoPanel(false)}
              />
            </div>
          )}

          {/* Session Info / Coaching Points Drawer */}
          {showSessionInfo && (
            <div className="w-full lg:w-[380px] flex-shrink-0 animate-slide-up">
              <SessionInfoDrawer
                session={session}
                onUpdateSession={(updated) => {
                  setSession((prev) => ({ ...prev, ...updated }));
                }}
                onSaveSession={handleSave}
                onExportJson={() => onExportJson(session)}
                onDuplicateSession={() => onDuplicateSession(session.id)}
                onClose={() => setShowSessionInfo(false)}
              />
            </div>
          )}
        </div>

        {/* Bottom Animation Timeline Bar */}
        <AnimationTimeline
          steps={session.steps}
          currentStepIndex={currentStepIndex}
          isPlaying={isPlaying}
          playbackProgress={playbackProgress}
          playbackSpeed={playbackSpeed}
          isLooping={isLooping}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onRestart={() => {
            setIsPlaying(false);
            setCurrentStepIndex(0);
            setPlaybackProgress(0);
          }}
          onStepSelect={(idx) => {
            setIsPlaying(false);
            setCurrentStepIndex(idx);
            setPlaybackProgress(0);
          }}
          onStepNext={() => {
            if (currentStepIndex < session.steps.length - 1) {
              setCurrentStepIndex(currentStepIndex + 1);
            }
          }}
          onStepPrev={() => {
            if (currentStepIndex > 0) {
              setCurrentStepIndex(currentStepIndex - 1);
            }
          }}
          onAddStep={handleAddStep}
          onDuplicateStep={handleDuplicateStep}
          onDeleteStep={handleDeleteStep}
          onMoveStep={handleMoveStep}
          onUpdateStepName={handleUpdateStepName}
          onChangeSpeed={setPlaybackSpeed}
          onToggleLoop={() => setIsLooping(!isLooping)}
          onOpenPresentation={() => setShowPresentation(true)}
          onScrubTimeline={(f) => {
            setIsPlaying(false);
            const targetStep = Math.min(session.steps.length - 1, Math.floor(f * session.steps.length));
            setCurrentStepIndex(targetStep);
          }}
        />
      </main>

      {/* Formation Reset Modal */}
      <FormationResetModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        format={session.format}
        homeTeam={session.homeTeam}
        awayTeam={session.awayTeam}
        onApplyFormation={handleApplyFormation}
      />

      {/* Fullscreen Presentation Mode */}
      {showPresentation && (
        <PresentationMode
          session={session}
          currentStepIndex={currentStepIndex}
          isPlaying={isPlaying}
          playbackProgress={playbackProgress}
          playbackSpeed={playbackSpeed}
          currentPlayers={isPlaying ? animatedPlayers : currentStep.players}
          currentBall={isPlaying ? animatedBall : currentStep.ball}
          currentEquipment={currentStep.equipment || []}
          currentAnnotations={currentStep.annotations || []}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onRestart={() => {
            setIsPlaying(false);
            setCurrentStepIndex(0);
          }}
          onStepNext={() => {
            if (currentStepIndex < session.steps.length - 1) {
              setCurrentStepIndex(currentStepIndex + 1);
            }
          }}
          onStepPrev={() => {
            if (currentStepIndex > 0) {
              setCurrentStepIndex(currentStepIndex - 1);
            }
          }}
          onStepSelect={setCurrentStepIndex}
          onClose={() => setShowPresentation(false)}
          onAddAnnotation={handleAddAnnotation}
        />
      )}
    </div>
  );
};
