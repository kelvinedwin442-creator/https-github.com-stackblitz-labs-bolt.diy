/**
 * Voice cues. A coach on a pitch cannot read a screen, and many learners in the
 * grassroots game are stronger listeners than readers — so every drill step can carry a
 * 10-second spoken cue, recorded on the same phone.
 *
 * Storage: IndexedDB (never a server, never uploaded). Falls back to in-memory blobs when
 * IndexedDB is unavailable — e.g. when the single-file app is opened straight from
 * WhatsApp on the file:// origin, where browsers block IDB.
 */

const DB_NAME = 'coachkit-voice';
const STORE = 'cues';

export interface VoiceCue {
  key: string;
  blob: Blob;
  ms: number;
  createdAt: string;
}

const memory = new Map<string, VoiceCue>();

function idbAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null;
  } catch {
    return false;
  }
}

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  if (!idbAvailable()) return Promise.resolve(null);
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }
  return dbPromise;
}

export function recordingSupported(): boolean {
  return typeof window !== 'undefined' && typeof window.MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
}

export async function saveCue(cue: VoiceCue): Promise<void> {
  memory.set(cue.key, cue);
  const db = await openDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(cue, cue.key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function loadCue(key: string): Promise<VoiceCue | null> {
  if (memory.has(key)) return memory.get(key) as VoiceCue;
  const db = await openDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => {
        const val = req.result as VoiceCue | undefined;
        if (val) memory.set(key, val);
        resolve(val ?? null);
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function deleteCue(key: string): Promise<void> {
  memory.delete(key);
  const db = await openDb();
  if (!db) return;
  try {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(key);
  } catch {
    /* nothing to clean up */
  }
}

/**
 * Minimal recorder handle: start() then stop() which resolves the recorded clip.
 * Throws a human-readable error so the UI can say what to do about it.
 */
export interface Recorder {
  stop: () => Promise<{ blob: Blob; ms: number }>;
  cancel: () => void;
}

export async function startRecording(): Promise<Recorder> {
  if (!recordingSupported()) {
    throw new Error('This browser cannot record audio. Use Chrome on Android.');
  }
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    throw new Error('Microphone blocked. Allow the mic for this site, then try again.');
  }

  const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'].find(
    (m) => typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(m)
  );
  const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
  const chunks: BlobPart[] = [];
  const startedAt = Date.now();

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  recorder.start(250);

  const teardown = () => {
    stream.getTracks().forEach((t) => t.stop());
  };

  return {
    stop: () =>
      new Promise((resolve) => {
        recorder.onstop = () => {
          teardown();
          const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
          resolve({ blob, ms: Date.now() - startedAt });
        };
        try {
          recorder.stop();
        } catch {
          teardown();
          resolve({ blob: new Blob(chunks, { type: 'audio/webm' }), ms: Date.now() - startedAt });
        }
      }),
    cancel: () => {
      try {
        recorder.stop();
      } catch {
        /* already stopped */
      }
      teardown();
    },
  };
}

export function cueKeyFor(drillId: string, stepIndex: number): string {
  return `drill:${drillId}:${stepIndex}`;
}

export function cueKeyForSession(sessionId: string, stepIndex: number): string {
  return `session:${sessionId}:${stepIndex}`;
}
