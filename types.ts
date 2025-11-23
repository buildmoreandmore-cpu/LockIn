
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
  actualDuration?: number;
  dayOfWeek?: string;
  timeOfDay?: string;
  exitReason?: string;
}

export interface ExitReason {
  id: string;
  label: string;
  category: 'urgent' | 'difficulty' | 'motivation' | 'physical';
  responseTitle: string;
  responseText: string[];
  actionText: string;
  resumeAvailable: boolean;
}

export interface ActivityPreset {
  id: string;
  label: string;
  icon: string;
  category: 'WORK' | 'PHYSICAL' | 'FOCUS';
}

export const PRESET_ACTIVITIES: ActivityPreset[] = [
  { id: 'deep_work', label: 'Deep Work', icon: 'Briefcase', category: 'WORK' },
  { id: 'studying', label: 'Studying', icon: 'BookOpen', category: 'WORK' },
  { id: 'coding', label: 'Coding', icon: 'Terminal', category: 'WORK' },
  { id: 'gym', label: 'At the Gym', icon: 'Dumbbell', category: 'PHYSICAL' },
  { id: 'meditation', label: 'Meditation', icon: 'Brain', category: 'PHYSICAL' },
  { id: 'no_social', label: 'No Social Media', icon: 'SmartphoneOff', category: 'FOCUS' },
  { id: 'reading', label: 'Reading', icon: 'Book', category: 'FOCUS' },
  { id: 'writing', label: 'Writing', icon: 'PenTool', category: 'WORK' },
];

export const EXIT_REASONS: ExitReason[] = [
  { 
    id: 'urgent', 
    label: 'Actual Emergency (Phone call, urgent issue)', 
    category: 'urgent',
    responseTitle: "FAIR ENOUGH.",
    responseText: [
      "Life happens.",
      "That's not quitting—that's handling your business.",
      "Your streak continues if you resume within 5 minutes."
    ],
    actionText: "RESUME",
    resumeAvailable: true
  },
  { 
    id: 'hard', 
    label: 'Task was too hard (Need adjustments)', 
    category: 'difficulty',
    responseTitle: "LET'S ADJUST.",
    responseText: [
      "Hard tasks need different approaches, not shorter sessions.",
      "Try breaking it into smaller pieces before your next session.",
      "Come back when you've got a clearer first step."
    ],
    actionText: "GOT IT",
    resumeAvailable: false
  },
  { 
    id: 'distracted', 
    label: 'Got distracted (Notification, thought)', 
    category: 'motivation',
    responseTitle: "IT HAPPENS.",
    responseText: [
      "Distractions win sometimes.",
      "The difference between you and most people: You're aware of it.",
      "Next time, put your phone in another room."
    ],
    actionText: "WILL DO",
    resumeAvailable: false
  },
  { 
    id: 'feeling', 
    label: "Just didn't feel like it (Honest)", 
    category: 'motivation',
    responseTitle: "AT LEAST YOU'RE HONEST.",
    responseText: [
      "Most people lie to themselves about why they quit. You didn't.",
      "But here's the truth: Motivation is bullshit.",
      "You'll never 'feel like it'. You just have to do it anyway.",
      "Can you do that tomorrow?"
    ],
    actionText: "YES",
    resumeAvailable: false
  },
  {
    id: 'physical',
    label: "Physical need (Bathroom, water)",
    category: 'physical',
    responseTitle: "TAKE CARE OF YOURSELF.",
    responseText: [
      "Your body is not negotiable.",
      "But pro tip: Hit the bathroom BEFORE you start next time.",
      "Your streak is safe if you resume in 5 minutes."
    ],
    actionText: "RESUME",
    resumeAvailable: true
  }
];

export interface UserPatterns {
  bestTimeOfDay: string;
  bestDayOfWeek: string;
  commonQuitMinute: number | null;
  totalFocusMinutes: number;
}

export interface BurnoutStatus {
  detected: boolean;
  message?: string;
  recommendation?: string;
}
