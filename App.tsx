
import React, { useState, useEffect, useCallback } from 'react';
import { Routine, Task, WashSession, AppView } from './types';
import Dashboard from './components/Dashboard';
import RoutineList from './components/RoutineList';
import RoutineEditor from './components/RoutineEditor';
import TimerDisplay from './components/TimerDisplay';
import StatsView from './components/StatsView';
import Header from './components/Header';

const DEFAULT_ROUTINES: Routine[] = [
  {
    id: '1',
    name: 'Standard Exterior Wash',
    tasks: [
      { id: 't1', title: 'Rinse', duration: 120, guide: 'Rinse the entire vehicle from top to bottom to remove loose debris.' },
      { id: 't2', title: 'Foam Cannon', duration: 180, guide: 'Apply a thick layer of snow foam and let it dwell for three minutes.' },
      { id: 't3', title: 'Contact Wash', duration: 600, guide: 'Use a two-bucket method to clean panels with a soft wash mitt.' },
      { id: 't4', title: 'Final Rinse', duration: 120, guide: 'Rinse all soap away thoroughly including crevices.' },
      { id: 't5', title: 'Drying', duration: 300, guide: 'Dry the car with a premium microfiber towel or air blower.' }
    ]
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [sessions, setSessions] = useState<WashSession[]>([]);
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedRoutines = localStorage.getItem('sw_routines');
    const savedSessions = localStorage.getItem('sw_sessions');
    
    if (savedRoutines) {
      setRoutines(JSON.parse(savedRoutines));
    } else {
      setRoutines(DEFAULT_ROUTINES);
    }
    
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save routines to localStorage
  useEffect(() => {
    if (routines.length > 0) {
      localStorage.setItem('sw_routines', JSON.stringify(routines));
    }
  }, [routines]);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('sw_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleSaveRoutine = (routine: Routine) => {
    setRoutines(prev => {
      const index = prev.findIndex(r => r.id === routine.id);
      if (index > -1) {
        const updated = [...prev];
        updated[index] = routine;
        return updated;
      }
      return [...prev, routine];
    });
    setView(AppView.ROUTINES);
  };

  const handleDeleteRoutine = (id: string) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
  };

  const handleStartWash = (routine: Routine) => {
    setActiveRoutine(routine);
    setView(AppView.TIMER);
  };

  const handleFinishWash = (earnings: number, totalSeconds: number) => {
    if (!activeRoutine) return;
    
    const newSession: WashSession = {
      id: Date.now().toString(),
      routineId: activeRoutine.id,
      routineName: activeRoutine.name,
      date: new Date().toISOString(),
      earnings,
      duration: totalSeconds
    };
    
    setSessions(prev => [newSession, ...prev]);
    setActiveRoutine(null);
    setView(AppView.DASHBOARD);
  };

  const renderView = () => {
    switch (view) {
      case AppView.DASHBOARD:
        return <Dashboard 
          routines={routines} 
          sessions={sessions} 
          onStartWash={handleStartWash}
          onNavigate={(v) => setView(v)}
        />;
      case AppView.ROUTINES:
        return <RoutineList 
          routines={routines} 
          onEdit={(r) => { setEditingRoutine(r); setView(AppView.EDIT_ROUTINE); }}
          onDelete={handleDeleteRoutine}
          onCreate={() => { setEditingRoutine(null); setView(AppView.EDIT_ROUTINE); }}
          onStart={handleStartWash}
        />;
      case AppView.EDIT_ROUTINE:
        return <RoutineEditor 
          routine={editingRoutine} 
          onSave={handleSaveRoutine}
          onCancel={() => setView(AppView.ROUTINES)}
        />;
      case AppView.TIMER:
        return activeRoutine ? (
          <TimerDisplay 
            routine={activeRoutine} 
            onFinish={handleFinishWash}
            onCancel={() => { setActiveRoutine(null); setView(AppView.DASHBOARD); }}
          />
        ) : null;
      case AppView.STATS:
        return <StatsView sessions={sessions} onBack={() => setView(AppView.DASHBOARD)} />;
      default:
        return <Dashboard routines={routines} sessions={sessions} onStartWash={handleStartWash} onNavigate={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col max-w-lg mx-auto border-x border-slate-800 shadow-2xl">
      <Header currentView={view} onNavigate={setView} />
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {renderView()}
      </main>
      
      {/* Tab Navigation */}
      <nav className="fixed bottom-0 w-full max-w-lg bg-slate-900 border-t border-slate-800 flex justify-around py-3 px-2 z-50">
        <button 
          onClick={() => setView(AppView.DASHBOARD)}
          className={`flex flex-col items-center gap-1 transition-colors ${view === AppView.DASHBOARD ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-house text-xl"></i>
          <span className="text-[10px] uppercase font-bold tracking-wider">Home</span>
        </button>
        <button 
          onClick={() => setView(AppView.ROUTINES)}
          className={`flex flex-col items-center gap-1 transition-colors ${view === AppView.ROUTINES || view === AppView.EDIT_ROUTINE ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-list-check text-xl"></i>
          <span className="text-[10px] uppercase font-bold tracking-wider">Routines</span>
        </button>
        <button 
          onClick={() => setView(AppView.STATS)}
          className={`flex flex-col items-center gap-1 transition-colors ${view === AppView.STATS ? 'text-blue-400' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-chart-line text-xl"></i>
          <span className="text-[10px] uppercase font-bold tracking-wider">Stats</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
