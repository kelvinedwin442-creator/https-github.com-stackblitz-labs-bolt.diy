import React, { useRef, useState, useEffect } from 'react';
import { VideoBookmark, KeyframeStep } from '../../types/tactics';
import {
  Video,
  Upload,
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Bookmark,
  Plus,
  Trash2,
  X,
  Volume2,
  VolumeX,
  Maximize2,
  ExternalLink,
  Film,
} from 'lucide-react';

interface VideoWorkspacePanelProps {
  videoUrl?: string;
  videoFileName?: string;
  bookmarks: VideoBookmark[];
  currentStepIndex: number;
  steps: KeyframeStep[];
  onSetVideo: (url: string, fileName: string) => void;
  onAddBookmark: (time: number, label: string, stepId?: string) => void;
  onDeleteBookmark: (id: string) => void;
  onSyncStepToTime?: (stepIndex: number, time: number) => void;
  onStepSelect: (index: number) => void;
  onClose: () => void;
}

export const VideoWorkspacePanel: React.FC<VideoWorkspacePanelProps> = ({
  videoUrl,
  videoFileName,
  bookmarks,
  currentStepIndex,
  steps,
  onSetVideo,
  onAddBookmark,
  onDeleteBookmark,
  onStepSelect,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [newBookmarkLabel, setNewBookmarkLabel] = useState('');

  // Sample video options for quick coaching demo
  const SAMPLE_VIDEOS = [
    {
      title: 'Tactical Build-Up & Press Drill (Demo MP4)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    {
      title: 'Counter Attack Transition (Demo MP4)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onSetVideo(url, file.name);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleFrameStep = (deltaSeconds: number) => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + deltaSeconds));
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleChangeRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleCreateBookmark = () => {
    const currentStep = steps[currentStepIndex];
    const label = newBookmarkLabel || `${currentStep?.name || 'Moment'} (${formatTime(currentTime)})`;
    onAddBookmark(currentTime, label, currentStep?.id);
    setNewBookmarkLabel('');
  };

  const handleJumpToBookmark = (bm: VideoBookmark) => {
    if (videoRef.current) {
      videoRef.current.currentTime = bm.time;
      setCurrentTime(bm.time);
    }
    if (bm.stepId) {
      const stepIdx = steps.findIndex((s) => s.id === bm.stepId);
      if (stepIdx >= 0) {
        onStepSelect(stepIdx);
      }
    }
  };

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div className="bg-slate-900/98 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-tactical flex flex-col gap-3 text-xs text-slate-100 h-full max-h-[84vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Video className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Video Analysis Workspace</h3>
            <p className="text-[10px] text-slate-400">Match footage & tactical diagramming</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Video Display or Upload Prompt */}
      {videoUrl ? (
        <div className="flex flex-col gap-2">
          {/* HTML5 Video Element */}
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
            <video
              ref={videoRef}
              src={videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-contain"
              playsInline
            />
          </div>

          {/* Video Controls Bar */}
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex flex-col gap-2">
            {/* Seek Slider */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-emerald-400 w-12 text-left">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.05"
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 accent-emerald-500 bg-slate-800 cursor-pointer h-1.5 rounded-lg"
              />
              <span className="font-mono text-[10px] text-slate-400 w-12 text-right">
                {formatTime(duration)}
              </span>
            </div>

            {/* Playback Buttons & Speeds */}
            <div className="flex items-center justify-between gap-1 pt-1">
              <div className="flex items-center gap-1">
                {/* Slow Step Backward */}
                <button
                  onClick={() => handleFrameStep(-0.1)}
                  title="Step -0.1s back"
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1 shadow-sm"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                {/* Slow Step Forward */}
                <button
                  onClick={() => handleFrameStep(0.1)}
                  title="Step +0.1s forward"
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700/60">
                {[0.25, 0.5, 1, 1.5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleChangeRate(rate)}
                    className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
                      playbackRate === rate ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Replace Video */}
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Change Video File"
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Video Upload Prompt */
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-950/40 text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-indigo-400">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-200 text-sm">Import Match Footage or Clip</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Load a local match recording (.mp4, .mov, .webm) to analyze alongside your tactical pitch.
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Select Local Video</span>
          </button>

          {/* Quick Demo Clips */}
          <div className="mt-2 pt-3 border-t border-slate-800/80 w-full">
            <p className="text-[11px] text-slate-400 mb-2">Or try a sample coaching clip:</p>
            <div className="flex flex-col gap-1.5">
              {SAMPLE_VIDEOS.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => onSetVideo(sample.url, sample.title)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-left text-[11px] flex items-center justify-between"
                >
                  <span className="truncate">{sample.title}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg,video/quicktime"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Video Bookmarks & Step Linking */}
      {videoUrl && (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-indigo-400" /> Timestamp Bookmarks
            </label>
            <span className="text-[10px] text-slate-400">
              Synced with Step {currentStepIndex + 1}
            </span>
          </div>

          {/* Add Bookmark Input */}
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              placeholder={`Bookmark @ ${formatTime(currentTime)} (e.g. Overlap Trigger)...`}
              value={newBookmarkLabel}
              onChange={(e) => setNewBookmarkLabel(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleCreateBookmark}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tag</span>
            </button>
          </div>

          {/* Bookmark List */}
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto mt-1">
            {bookmarks && bookmarks.length > 0 ? (
              bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  onClick={() => handleJumpToBookmark(bm)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-emerald-400 text-[11px] font-bold">
                      {formatTime(bm.time)}
                    </span>
                    <span className="text-slate-200 truncate">{bm.label}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBookmark(bm.id);
                    }}
                    className="p-1 hover:bg-red-900/60 rounded text-slate-500 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-slate-500 italic text-center py-2">
                No timestamps tagged yet. Pause video at key moment and click 'Tag'.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
