
import React from 'react';
import { Routine, WashSession, AppView } from '../types';

interface DashboardProps {
  routines: Routine[];
  sessions: WashSession[];
  onStartWash: (routine: Routine) => void;
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ routines, sessions, onStartWash, onNavigate }) => {
  const totalEarnings = sessions.reduce((sum, s) => sum + s.earnings, 0);
  const totalWashes = sessions.length;
  
  const today = new Date().toDateString();
  const todayWashes = sessions.filter(s => new Date(s.date).toDateString() === today);
  const todayEarnings = todayWashes.reduce((sum, s) => sum + s.earnings, 0);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Today</p>
          <p className="text-2xl font-bold text-blue-400">${todayEarnings.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400 mt-1">{todayWashes.length} washes completed</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total All-Time</p>
          <p className="text-2xl font-bold text-indigo-400">${totalEarnings.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400 mt-1">{totalWashes} lifetime washes</p>
        </div>
      </div>

      {/* Start New Wash Section */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Quick Start Wash</h2>
          <button 
            onClick={() => onNavigate(AppView.ROUTINES)}
            className="text-xs text-blue-500 hover:text-blue-400"
          >
            See All
          </button>
        </div>
        
        <div className="space-y-3">
          {routines.slice(0, 3).map(routine => (
            <button
              key={routine.id}
              onClick={() => onStartWash(routine)}
              className="w-full bg-slate-900 hover:bg-slate-800 transition-colors p-4 rounded-2xl border border-slate-800 flex items-center justify-between group"
            >
              <div className="text-left">
                <h3 className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{routine.name}</h3>
                <p className="text-xs text-slate-500">{routine.tasks.length} steps • ~{Math.round(routine.tasks.reduce((s, t) => s + t.duration, 0) / 60)} mins</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-blue-600/20 flex items-center justify-center transition-colors">
                <i className="fa-solid fa-play text-blue-500 group-hover:text-blue-400"></i>
              </div>
            </button>
          ))}
          
          {routines.length === 0 && (
            <div className="bg-slate-900 border border-dashed border-slate-700 p-8 rounded-2xl text-center">
              <p className="text-slate-500 text-sm mb-4">No routines found. Create your first one to start!</p>
              <button 
                onClick={() => onNavigate(AppView.ROUTINES)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
              >
                Go to Routines
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Activity</h2>
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          {sessions.length > 0 ? (
            <div className="divide-y divide-slate-800">
              {sessions.slice(0, 5).map(session => (
                <div key={session.id} className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300">{session.routineName}</h4>
                    <p className="text-[10px] text-slate-500">{new Date(session.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-400">+${session.earnings.toFixed(2)}</p>
                    <p className="text-[10px] text-slate-500">{Math.floor(session.duration / 60)}m {session.duration % 60}s</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-slate-500 text-sm">No wash history yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
