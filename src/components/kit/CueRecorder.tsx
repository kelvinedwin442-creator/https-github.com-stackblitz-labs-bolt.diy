import React, { useEffect, useRef, useState } from 'react';
import { Mic, Play, Square, Trash2, AlertTriangle } from 'lucide-react';
import { loadCue, saveCue, deleteCue, startRecording, recordingSupported, Recorder, VoiceCue } from '../../utils/voiceNotes';

/**
 * One recorded spoken cue, stored on the device.
 * Built for a coach who cannot read a screen while 14 kids are waiting.
 */
interface CueRecorderProps {
  storeKey: string;
  /** the sentence the coach should say, as a prompt */
  script?: string;
  compact?: boolean;
}

type Status = 'loading' | 'empty' | 'ready' | 'recording' | 'playing' | 'unsupported' | 'error';

export const CueRecorder: React.FC<CueRecorderProps> = ({ storeKey, script, compact = false }) => {
  const [status, setStatus] = useState<Status>('loading');
  const [cue, setCue] = useState<VoiceCue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const recorderRef = useRef<Recorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;
    if (!recordingSupported()) {
      setStatus('unsupported');
      return;
    }
    loadCue(storeKey).then((found) => {
      if (!alive) return;
      setCue(found);
      setStatus(found ? 'ready' : 'empty');
    });
    return () => {
      alive = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [storeKey]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const beginRecording = async () => {
    setError(null);
    try {
      const rec = await startRecording();
      recorderRef.current = rec;
      setElapsed(0);
      setStatus('recording');
      const started = Date.now();
      timerRef.current = window.setInterval(() => {
        const ms = Date.now() - started;
        setElapsed(ms);
        // hard cap: a tactical cue should never be a speech
        if (ms > 45000) void endRecording();
      }, 200);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Could not start recording.');
    }
  };

  const endRecording = async () => {
    const rec = recorderRef.current;
    if (!rec) return;
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    recorderRef.current = null;
    const { blob, ms } = await rec.stop();
    if (blob.size > 0 && ms > 300) {
      const saved: VoiceCue = { key: storeKey, blob, ms, createdAt: new Date().toISOString() };
      await saveCue(saved);
      setCue(saved);
      setStatus('ready');
    } else {
      setStatus(cue ? 'ready' : 'empty');
      setError('Too short — hold the button and speak for a second or two.');
    }
  };

  const play = () => {
    if (!cue) return;
    const url = URL.createObjectURL(cue.blob);
    const audio = new Audio(url);
    audioRef.current = audio;
    setStatus('playing');
    audio.onended = () => {
      setStatus('ready');
      URL.revokeObjectURL(url);
    };
    audio.onerror = () => {
      setStatus('ready');
      setError('This phone could not play the recording format.');
    };
    void audio.play().catch(() => setStatus('ready'));
  };

  const remove = async () => {
    await deleteCue(storeKey);
    setCue(null);
    setStatus('empty');
  };

  if (status === 'unsupported') {
    return (
      <p className="text-[11px] text-slate-500 leading-snug">
        Voice recording needs a recent Chrome or Safari on this device. The written cue still works.
      </p>
    );
  }

  const seconds = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {status === 'recording' ? (
        <>
          <button
            onClick={() => void endRecording()}
            className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold flex items-center gap-1.5 animate-pulse"
          >
            <Square className="w-3 h-3" />
            Stop · {seconds(elapsed)}
          </button>
          {script && !compact && <span className="text-[10px] text-slate-400 italic">say: “{script}”</span>}
        </>
      ) : (
        <>
          {status === 'ready' && cue ? (
            <>
              <button
                onClick={play}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1.5"
              >
                <Play className="w-3 h-3" />
                Play cue · {seconds(cue.ms)}
              </button>
              <button
                onClick={() => void beginRecording()}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                title="Record over this cue"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => void remove()}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 border border-slate-700"
                title="Delete recording"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => void beginRecording()}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 border border-slate-700"
            >
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
              Record cue
            </button>
          )}
          {status === 'loading' && <span className="text-[10px] text-slate-500">checking…</span>}
        </>
      )}
      {error && (
        <span className="text-[10px] text-amber-400 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {error}
        </span>
      )}
    </div>
  );
};
