
export enum AppMode {
  DASHBOARD = 'DASHBOARD',
  FOCUS = 'FOCUS',
  EMERGENCY_EXIT = 'EMERGENCY_EXIT',
  COMPLETED = 'COMPLETED',
}

export enum TrainerLevel {
  RECRUIT = 'RECRUIT',       // 0-5 sessions
  SOLDIER = 'SOLDIER',       // 6-20 sessions
  WARRIOR = 'WARRIOR',       // 21-50 sessions
  COMMANDER = 'COMMANDER',   // 51+ sessions
}

export interface FocusSession {
  id: string;
  duration: number; // in seconds
  completed: boolean;
  taskName: string;
  timestamp: number;
  mode: 'QUICK' | 'STANDARD' | 'BEAST';
}

export interface ExitReason {
  id: string;
  label: string;
  category: 'urgent' | 'difficulty' | 'motivation';
}

export const EXIT_REASONS: ExitReason[] = [
  { id: 'urgent', label: 'Actual Emergency', category: 'urgent' },
  { id: 'hard', label: 'Task was too hard (Adjusting)', category: 'difficulty' },
  { id: 'feeling', label: "Just didn't feel like it", category: 'motivation' },
  { id: 'distracted', label: "Got distracted", category: 'motivation' },
];
