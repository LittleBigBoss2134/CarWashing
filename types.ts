
export interface Task {
  id: string;
  title: string;
  duration: number; // in seconds
  guide: string;
}

export interface Routine {
  id: string;
  name: string;
  tasks: Task[];
}

export interface WashSession {
  id: string;
  routineId: string;
  routineName: string;
  date: string;
  earnings: number;
  duration: number; // total actual time spent
}

export enum AppView {
  DASHBOARD = 'dashboard',
  ROUTINES = 'routines',
  TIMER = 'timer',
  STATS = 'stats',
  EDIT_ROUTINE = 'edit_routine'
}
