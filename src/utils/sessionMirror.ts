import { Session } from '../types/tactics';

/**
 * Season-loss insurance.
 *
 * A grassroots coach in Lagos often has one phone, no laptop, no email backup and no
 * second device. Their whole season lives in this app's storage. If the browser decides to
 * evict localStorage (it does that under storage pressure) or the coach clears site data to
 * free space, and the season disappears, we do not get a second chance with that user —
 * we get a reputation as "the app that ate my sessions".
 *
 * So every write is mirrored into IndexedDB, and at boot we compare the two and offer to
 * put things back. No server, no account, nothing leaves the device.
 */

const MIRROR_DB = 'coachkit-mirror';
const STORE = 'sessions';
const KEY = 'current';
const LOCAL_KEY = 'tactical_coach_sessions_v1';

function idbOk(): boolean {
  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null;
  } catch {
    return false;
  }
}

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openMirror(): Promise<IDBDatabase | null> {
  if (!idbOk()) return Promise.resolve(null);
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      try {
        const req = indexedDB.open(MIRROR_DB, 1);
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

export async function mirrorToIndexedDB(sessions: Session[]): Promise<void> {
  const db = await openMirror();
  if (!db) return;
  try {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put({ at: new Date().toISOString(), sessions }, KEY);
  } catch {
    /* storage full or origin blocked: the localStorage copy is still the source of truth */
  }
}

export interface MirrorSnapshot {
  at: string;
  sessions: Session[];
}

export async function readMirror(): Promise<MirrorSnapshot | null> {
  const db = await openMirror();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = () => resolve((req.result as MirrorSnapshot) ?? null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export function localStoreHasSessions(): boolean {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0;
  } catch {
    return false;
  }
}

/**
 * Returns sessions to restore when local storage lost data but the mirror still has it
 * (or holds strictly more), otherwise null. Also reports mirror metadata so the UI can say
 * when the backup was taken.
 */
export async function recoverIfNeeded(): Promise<{ sessions: Session[]; reason: 'lost' | 'newer' } | null> {
  const snapshot = await readMirror();
  if (!snapshot || !Array.isArray(snapshot.sessions) || snapshot.sessions.length === 0) return null;

  let localCount = 0;
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) localCount = parsed.length;
    }
  } catch {
    localCount = 0;
  }

  if (localCount === 0) return { sessions: snapshot.sessions, reason: 'lost' };
  if (snapshot.sessions.length > localCount) return { sessions: snapshot.sessions, reason: 'newer' };
  return null;
}
