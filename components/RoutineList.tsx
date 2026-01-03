
import React from 'react';
import { Routine } from '../types';

interface RoutineListProps {
  routines: Routine[];
  onEdit: (r: Routine) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  onStart: (r: Routine) => void;
}

const RoutineList: React.FC<RoutineListProps> = ({ routines, onEdit, onDelete, onCreate, onStart }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-100">Your Routines</h2>
        <button 
          onClick={onCreate}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
        >
          <i className="fa-solid fa-plus"></i>
          New Routine
        </button>
      </div>

      <div className="grid gap-4">
        {routines.map(routine => (
          <div key={routine.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{routine.name}</h3>
                  <p className="text-xs text-slate-500">{routine.tasks.length} tasks defined</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onEdit(routine)}
                    className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    <i className="fa-solid fa-pen text-xs"></i>
                  </button>
                  <button 
                    onClick={() => {
                      if(window.confirm('Delete this routine?')) onDelete(routine.id);
                    }}
                    className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <i className="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 my-4">
                {routine.tasks.slice(0, 3).map((t, idx) => (
                  <span key={t.id} className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] rounded-md border border-slate-700">
                    {t.title}
                  </span>
                ))}
                {routine.tasks.length > 3 && (
                  <span className="px-2 py-1 bg-slate-800 text-slate-500 text-[10px] rounded-md">
                    +{routine.tasks.length - 3} more
                  </span>
                )}
              </div>
            </div>
            
            <button 
              onClick={() => onStart(routine)}
              className="w-full bg-slate-800/50 hover:bg-blue-600/20 text-blue-400 py-3 text-sm font-bold transition-all border-t border-slate-800 flex items-center justify-center gap-2 group"
            >
              <i className="fa-solid fa-circle-play transition-transform group-hover:scale-110"></i>
              Start Session
            </button>
          </div>
        ))}

        {routines.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800">
              <i className="fa-solid fa-clipboard-list text-slate-700 text-2xl"></i>
            </div>
            <p className="text-slate-500">You don't have any routines yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineList;
