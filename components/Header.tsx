
import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const getTitle = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return 'SparkleWash Pro';
      case AppView.ROUTINES: return 'Manage Routines';
      case AppView.EDIT_ROUTINE: return 'Edit Routine';
      case AppView.TIMER: return 'Wash in Progress';
      case AppView.STATS: return 'Earnings & Stats';
      default: return 'SparkleWash Pro';
    }
  };

  return (
    <header className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center sticky top-0 z-50">
      <div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          {getTitle()}
        </h1>
        {currentView === AppView.DASHBOARD && (
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Business Suite</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <i className="fa-solid fa-car-wash text-white text-xs"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
