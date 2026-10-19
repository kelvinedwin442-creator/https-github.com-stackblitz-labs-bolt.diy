import { Session, MatchFormat, KeyframeStep } from '../types/tactics';
import { DEFAULT_SESSIONS } from '../data/defaultSessions';
import { createPlayersFromFormation } from '../data/formations';
import { mirrorToIndexedDB } from './sessionMirror';

const STORAGE_KEY = 'tactical_coach_sessions_v1';
const ACTIVE_SESSION_ID_KEY = 'tactical_coach_active_session_id_v1';

export function loadSessions(): Session[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      saveSessions(DEFAULT_SESSIONS);
      return DEFAULT_SESSIONS;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_SESSIONS;
  } catch (err) {
    console.error('Failed to load sessions from storage:', err);
    return DEFAULT_SESSIONS;
  }
}

export function saveSessions(sessions: Session[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save sessions to storage:', err);
  }
  // Mirror to IndexedDB so a cleared cache or a browser storage purge does not erase a
  // season of work. localStorage is the fast path, the mirror is the safety net.
  void mirrorToIndexedDB(sessions);
}

export function getSessionById(id: string): Session | undefined {
  const sessions = loadSessions();
  return sessions.find((s) => s.id === id);
}

export function saveSession(session: Session): Session[] {
  const sessions = loadSessions();
  const existingIdx = sessions.findIndex((s) => s.id === session.id);
  const updatedSession = {
    ...session,
    updatedAt: new Date().toISOString(),
  };

  let updatedList: Session[];
  if (existingIdx >= 0) {
    updatedList = [...sessions];
    updatedList[existingIdx] = updatedSession;
  } else {
    updatedList = [updatedSession, ...sessions];
  }

  saveSessions(updatedList);
  return updatedList;
}

export function deleteSession(id: string): Session[] {
  const sessions = loadSessions();
  const updatedList = sessions.filter((s) => s.id !== id);
  saveSessions(updatedList);
  return updatedList;
}

export function duplicateSession(id: string): Session | null {
  const sessions = loadSessions();
  const original = sessions.find((s) => s.id === id);
  if (!original) return null;

  const duplicated: Session = {
    ...JSON.parse(JSON.stringify(original)),
    id: `session-${Date.now()}`,
    title: `${original.title} (Copy)`,
    isTemplate: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedList = [duplicated, ...sessions];
  saveSessions(updatedList);
  return duplicated;
}

export function createNewSession(
  format: MatchFormat = '11v11',
  title = 'Untitled Tactical Session'
): Session {
  const defaultFormationHome = format === '11v11' ? '4-3-3' : format === '9v9' ? '3-2-3' : format === '7v7' ? '2-3-1' : '1-2-1';
  const defaultFormationAway = format === '11v11' ? '4-2-3-1' : format === '9v9' ? '3-3-2' : format === '7v7' ? '2-3-1' : '1-2-1';

  const initialPlayers = createPlayersFromFormation(format, defaultFormationHome, defaultFormationAway);

  const initialStep: KeyframeStep = {
    id: `step-${Date.now()}-1`,
    name: 'Step 1: Setup & Starting Shape',
    description: 'Initial positioning and tactical structure.',
    duration: 2.0,
    players: initialPlayers,
    ball: { id: 'ball', x: 50, y: 50 },
    equipment: [],
    annotations: [],
  };

  const newSession: Session = {
    id: `session-${Date.now()}`,
    title,
    description: 'Create, demonstrate, and teach tactical movements.',
    format,
    phase: 'possession',
    category: 'senior',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    homeTeam: {
      name: 'Team Blue (Home)',
      primaryColor: '#2563eb',
      textColor: '#ffffff',
      gkColor: '#eab308',
      gkTextColor: '#000000',
      formation: defaultFormationHome,
    },
    awayTeam: {
      name: 'Team Red (Away)',
      primaryColor: '#dc2626',
      textColor: '#ffffff',
      gkColor: '#16a34a',
      gkTextColor: '#ffffff',
      formation: defaultFormationAway,
    },
    pitchConfig: {
      view: 'full',
      orientation: 'horizontal',
      theme: 'classic-grass',
      showGrid: true,
      gridType: 'channels',
      showPlayerLabels: true,
      showPlayerNumbers: true,
      showVisionCones: false,
      snapToGrid: false,
    },
    coachingPoints: [
      'Maintain tactical distances and defensive balance.',
      'Scan before receiving; make sharp movements into open space.',
    ],
    objectives: [
      'Master the positional rotation sequence',
      'Execute within 3 touches maximum',
    ],
    currentStepIndex: 0,
    steps: [initialStep],
  };

  saveSession(newSession);
  return newSession;
}

export function exportSessionAsJson(session: Session): void {
  const jsonStr = JSON.stringify(session, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${session.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_tactical_coach.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAllSessionsBackup(): void {
  const sessions = loadSessions();
  const jsonStr = JSON.stringify(sessions, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tactical_coach_all_sessions_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getActiveSessionId(): string | null {
  return localStorage.getItem(ACTIVE_SESSION_ID_KEY);
}

export function setActiveSessionId(id: string): void {
  localStorage.setItem(ACTIVE_SESSION_ID_KEY, id);
}
