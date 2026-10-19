import React, { useState, useEffect } from 'react';
import { Session, MatchFormat } from './types/tactics';
import {
  loadSessions,
  saveSessions,
  saveSession,
  deleteSession,
  duplicateSession,
  createNewSession,
  exportSessionAsJson,
  exportAllSessionsBackup,
  getActiveSessionId,
  setActiveSessionId,
} from './utils/storage';
import { recoverIfNeeded } from './utils/sessionMirror';
import { Dashboard } from './components/dashboard/Dashboard';
import { TacticalWorkspace } from './components/workspace/TacticalWorkspace';
import { CoachKitPanel } from './components/kit/CoachKitPanel';

type View = 'dashboard' | 'workspace' | 'kit';

export function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [view, setView] = useState<View>(() =>
    typeof window !== 'undefined' && window.location.search.includes('view=kit') ? 'kit' : 'dashboard'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [recovery, setRecovery] = useState<{ count: number; reason: 'lost' | 'newer' } | null>(null);
  const [pendingRestore, setPendingRestore] = useState<Session[] | null>(null);

  // Initialize and load saved sessions, then check the IndexedDB mirror for lost work.
  useEffect(() => {
    const loaded = loadSessions();
    setSessions(loaded);

    const activeId = getActiveSessionId();
    if (activeId) {
      const found = loaded.find((s) => s.id === activeId);
      if (found) setActiveSession(found);
    }
    setIsLoading(false);

    let alive = true;
    recoverIfNeeded().then((result) => {
      if (!alive || !result) return;
      setPendingRestore(result.sessions);
      setRecovery({ count: result.sessions.length, reason: result.reason });
    });
    return () => {
      alive = false;
    };
  }, []);

  const confirmRestore = () => {
    if (!pendingRestore) return;
    saveSessions(pendingRestore);
    setSessions(pendingRestore);
    setRecovery(null);
    setPendingRestore(null);
  };

  const dismissRestore = () => {
    setRecovery(null);
    setPendingRestore(null);
  };

  // Open a session in workspace
  const handleOpenSession = (id: string) => {
    const session = sessions.find((s) => s.id === id);
    if (session) {
      setActiveSession(session);
      setActiveSessionId(id);
      setView('workspace');
    }
  };

  // Create brand new session
  const handleCreateNewSession = (format: MatchFormat = '11v11', title = 'Untitled Tactical Plan') => {
    const created = createNewSession(format, title);
    const updatedList = [created, ...sessions];
    setSessions(updatedList);
    setActiveSession(created);
    setActiveSessionId(created.id);
    setView('workspace');
  };

  // A drill from the Coach Kit arrives as a ready-made, fully editable session
  const handleLaunchKitSession = (session: Session) => {
    saveSession(session);
    setSessions(loadSessions());
    setActiveSession(session);
    setActiveSessionId(session.id);
    setView('workspace');
  };

  // Save session from workspace
  const handleSaveSession = (updatedSession: Session) => {
    const updatedList = saveSession(updatedSession);
    setSessions(updatedList);
    setActiveSession(updatedSession);
  };

  // Duplicate session
  const handleDuplicateSession = (id: string) => {
    const duplicated = duplicateSession(id);
    if (duplicated) {
      const updated = loadSessions();
      setSessions(updated);
      setActiveSession(duplicated);
      setActiveSessionId(duplicated.id);
      setView('workspace');
    }
  };

  // Delete session
  const handleDeleteSession = (id: string) => {
    if (window.confirm('Are you sure you want to delete this tactical session?')) {
      const updatedList = deleteSession(id);
      setSessions(updatedList);
      if (activeSession?.id === id) {
        setActiveSession(null);
        localStorage.removeItem('tactical_coach_active_session_id_v1');
        setView('dashboard');
      }
    }
  };

  // Import session from JSON file
  const handleImportSession = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed && parsed.title && parsed.steps) {
          const importedSession: Session = {
            ...parsed,
            id: `session-${Date.now()}`,
            isTemplate: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const updated = saveSession(importedSession);
          setSessions(updated);
          setActiveSession(importedSession);
          setActiveSessionId(importedSession.id);
          setView('workspace');
        } else if (Array.isArray(parsed)) {
          // Backup list
          saveSessions(parsed);
          setSessions(parsed);
        } else {
          alert('Invalid tactical session JSON file format.');
        }
      } catch (err) {
        console.error('Failed to parse tactical JSON:', err);
        alert('Could not parse the selected file.');
      }
    };
    reader.readAsText(file);
  };

  // Return back to dashboard
  const handleBackToDashboard = () => {
    setActiveSession(null);
    setView('dashboard');
    localStorage.removeItem('tactical_coach_active_session_id_v1');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading Coach Kit...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {recovery && (
        <div className="fixed inset-x-0 bottom-0 z-[80] p-2.5 sm:p-4">
          <div className="max-w-2xl mx-auto bg-amber-950/95 border border-amber-700 rounded-2xl p-3.5 shadow-tactical backdrop-blur">
            <p className="text-[13px] text-amber-100 leading-snug">
              <strong className="font-extrabold">Saved work found.</strong> This phone’s app storage had{' '}
              {recovery.reason === 'lost' ? 'no sessions' : 'fewer sessions'} but a local backup holds{' '}
              <strong>{recovery.count}</strong>. Restore {recovery.reason === 'lost' ? 'it' : 'the larger backup'}?
              Nothing is uploaded — this is a copy kept on this device.
            </p>
            <div className="mt-2.5 flex gap-2">
              <button
                onClick={confirmRestore}
                className="px-3 py-1.5 rounded-lg bg-amber-400 text-amber-950 text-xs font-extrabold hover:bg-amber-300"
              >
                Restore my sessions
              </button>
              <button
                onClick={dismissRestore}
                className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-amber-800 text-amber-200 text-xs font-bold"
              >
                Leave it
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'kit' ? (
        <CoachKitPanel onBack={() => setView('dashboard')} onLaunchSession={handleLaunchKitSession} />
      ) : view === 'workspace' && activeSession ? (
        <TacticalWorkspace
          session={activeSession}
          onSaveSession={handleSaveSession}
          onBackToDashboard={handleBackToDashboard}
          onDuplicateSession={handleDuplicateSession}
          onExportJson={exportSessionAsJson}
        />
      ) : (
        <Dashboard
          sessions={sessions}
          onOpenSession={handleOpenSession}
          onCreateNewSession={handleCreateNewSession}
          onDuplicateSession={handleDuplicateSession}
          onDeleteSession={handleDeleteSession}
          onExportSession={exportSessionAsJson}
          onExportAll={exportAllSessionsBackup}
          onImportSession={handleImportSession}
          onOpenKit={() => setView('kit')}
        />
      )}
    </div>
  );
}

export default App;
