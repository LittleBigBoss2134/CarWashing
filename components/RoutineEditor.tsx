
import React, { useState } from 'react';
import { Routine, Task } from '../types';

interface RoutineEditorProps {
  routine: Routine | null;
  onSave: (r: Routine) => void;
  onCancel: () => void;
}

const RoutineEditor: React.FC<RoutineEditorProps> = ({ routine, onSave, onCancel }) => {
  const [name, setName] = useState(routine?.name || '');
  const [tasks, setTasks] = useState<Task[]>(routine?.tasks || [
    { id: 't1', title: 'Task 1', duration: 300, guide: 'Perform the first cleaning step.' }
  ]);

  const addTask = () => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      duration: 300,
      guide: ''
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const removeTask = (id: string) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const handleSave = () => {
    if (!name.trim()) return alert('Routine name is required');
    if (tasks.some(t => !t.title.trim())) return alert('All tasks must have a title');

    const newRoutine: Routine = {
      id: routine?.id || Math.random().toString(36).substr(2, 9),
      name,
      tasks
    };
    onSave(newRoutine);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Routine Name</label>
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Deluxe Exterior Prep"
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tasks & Guides</label>
          <span className="text-[10px] text-slate-600">Total: {Math.round(tasks.reduce((s, t) => s + t.duration, 0) / 60)}m</span>
        </div>

        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div key={task.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 relative group">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                  {index + 1}
                </span>
                <input 
                  type="text"
                  value={task.title}
                  onChange={(e) => updateTask(task.id, { title: e.target.value })}
                  placeholder="Task Name (e.g. Wheel Scrub)"
                  className="flex-1 bg-transparent border-b border-slate-800 focus:border-blue-500 outline-none py-1 text-sm font-semibold"
                />
                <button 
                  onClick={() => removeTask(task.id)}
                  className="text-slate-600 hover:text-red-400 transition-colors"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Duration (sec)</label>
                  <input 
                    type="number"
                    value={task.duration}
                    onChange={(e) => updateTask(task.id, { duration: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-blue-400"
                  />
                </div>
                <div className="flex items-end pb-1 text-[10px] text-slate-600 italic">
                  ≈ {Math.floor(task.duration / 60)}m {task.duration % 60}s
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase">Audio Guide (One sentence)</label>
                <textarea 
                  value={task.guide}
                  onChange={(e) => updateTask(task.id, { guide: e.target.value })}
                  placeholder="The bot will read this out at the start of this task..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 resize-none outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={addTask}
          className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 hover:text-blue-500 hover:border-blue-500/50 transition-all flex items-center justify-center gap-2 group"
        >
          <i className="fa-solid fa-circle-plus group-hover:scale-110 transition-transform"></i>
          <span className="text-sm font-bold">Add Step</span>
        </button>
      </div>

      <div className="flex gap-4 pt-4 sticky bottom-24">
        <button 
          onClick={onCancel}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-bold transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          className="flex-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-900/40 transition-all"
        >
          Save Routine
        </button>
      </div>
    </div>
  );
};

export default RoutineEditor;
