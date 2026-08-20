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
import { Dashboard } from './components/dashboard/Dashboard';
import { TacticalWorkspace } from './components/workspace/TacticalWorkspace';

export function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and load saved sessions
  useEffect(() => {
    const loaded = loadSessions();
    setSessions(loaded);

    const activeId = getActiveSessionId();
    if (activeId) {
      const found = loaded.find((s) => s.id === activeId);
      if (found) {
        setActiveSession(found);
      }
    }
    setIsLoading(false);
  }, []);

  // Open a session in workspace
  const handleOpenSession = (id: string) => {
    const session = sessions.find((s) => s.id === id);
    if (session) {
      setActiveSession(session);
      setActiveSessionId(id);
    }
  };

  // Create brand new session
  const handleCreateNewSession = (format: MatchFormat = '11v11', title = 'Untitled Tactical Plan') => {
    const created = createNewSession(format, title);
    const updatedList = [created, ...sessions];
    setSessions(updatedList);
    setActiveSession(created);
    setActiveSessionId(created.id);
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
    localStorage.removeItem('tactical_coach_active_session_id_v1');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading Tactical Coach Studio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {activeSession ? (
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
        />
      )}
    </div>
  );
}

export default App;
