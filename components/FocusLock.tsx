
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getFocusMotivation } from '../services/geminiService';
import { TrainerLevel } from '../types';

interface FocusLockProps {
  task: string;
  timeLeft: number;
  totalTime: number;
  onEmergencyExit: () => void;
  onUpdateTask: (newTask: string) => void;
  level: TrainerLevel;
  streak: number;
}

const FocusLock: React.FC<FocusLockProps> = ({ task, timeLeft, totalTime, onEmergencyExit, onUpdateTask, level, streak }) => {
  const [motivation, setMotivation] = useState<string>('');
  const [localTask, setLocalTask] = useState(task);
  const [isEditing, setIsEditing] = useState(!task);
  
  // Phase Logic
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;
  
  // Phase 1: The Grind (0-40%) - Warm Yellow
  // Phase 2: The Push (40-75%) - Deep Orange
  // Phase 3: Final Push (75-100%) - Red
  
  let bgClass = "from-[#FFD600] to-[#FFAA00]"; // Default Yellow
  let phaseText = "The Grind";
  let phaseMessage = "This is where most people quit. You're not most people.";
  
  if (progressPercent > 40 && progressPercent <= 75) {
      bgClass = "from-[#FF8C00] to-[#E85D04]"; // Orange
      phaseText = "The Push";
      phaseMessage = "You're in the zone. Keep digging.";
  } else if (progressPercent > 75) {
      bgClass = "from-[#D90429] to-[#8D0012]"; // Red
      phaseText = "Final Push";
      phaseMessage = "FINISH STRONG.";
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  useEffect(() => {
    // Request fullscreen on mount
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    }

    // Dynamic Motivation Fetching based on phase
    let phaseKey: 'START' | 'MIDDLE' | 'END' = 'START';
    if (progressPercent > 40) phaseKey = 'MIDDLE';
    if (progressPercent > 80) phaseKey = 'END';

    // Fetch on start, and potentially on phase change (simplified here to start/task change)
    if (task) {
        getFocusMotivation(task, level, phaseKey).then(setMotivation);
    }

    return () => {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [task, level, progressPercent > 40, progressPercent > 80]); // Refetch on phase thresholds roughly

  const handleTaskSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (localTask.trim()) {
          onUpdateTask(localTask);
          setIsEditing(false);
          getFocusMotivation(localTask, level, 'START').then(setMotivation);
      }
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden flex flex-col text-white select-none transition-colors duration-1000 ease-in-out bg-gradient-to-br ${bgClass}`}>
      
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      
      {/* Animated Pulses - Adjusted for intensity */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vh] h-[90vh] bg-white/5 rounded-full blur-3xl animate-wave-1 pointer-events-none ${progressPercent > 75 ? 'animate-pulse' : ''}`}></div>

      {/* Top Bar */}
      <div className="relative z-20 w-full flex justify-between items-center p-6 bg-black/10 backdrop-blur-sm border-b border-white/10">
        <span className="font-black uppercase tracking-wider text-sm">
             LOCKIN
        </span>
        <span className="font-black uppercase tracking-wider text-sm opacity-80">
             Level: {level} ⚡
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6">
        
        {/* Phase Indicator */}
        <div className="mb-8 opacity-80">
            <span className="inline-block px-3 py-1 bg-black/20 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-white/10">
                Phase: {phaseText}
            </span>
        </div>

        {/* Hero Timer */}
        <div className="mb-8 relative">
             <h1 className="text-[7rem] md:text-[11rem] font-black tabular-nums tracking-tighter leading-none drop-shadow-2xl">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
             </h1>
             <p className="font-bold uppercase tracking-[0.4em] text-xs mt-2 opacity-60">Remaining</p>
        </div>

        {/* Progress Bar (Visual) */}
        <div className="w-64 h-2 bg-black/20 rounded-full overflow-hidden mb-12">
            <div 
                className="h-full bg-white transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
            ></div>
        </div>

        {/* Task & Motivation */}
        <div className="w-full max-w-lg min-h-[120px] flex flex-col items-center justify-center space-y-4">
            {isEditing ? (
                <form onSubmit={handleTaskSubmit} className="w-full animate-fade-in">
                    <input
                        type="text"
                        value={localTask}
                        onChange={(e) => setLocalTask(e.target.value)}
                        placeholder="DEFINE TARGET"
                        className="w-full bg-transparent border-b-2 border-white/30 text-center text-2xl font-black uppercase text-white placeholder-white/20 focus:outline-none focus:border-white pb-2 transition-all"
                        autoFocus
                    />
                </form>
            ) : (
                <div onClick={() => setIsEditing(true)} className="cursor-pointer group animate-fade-in text-center">
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide group-hover:text-white/80 transition-colors">
                        {localTask}
                    </h2>
                    <p className="text-lg font-medium italic opacity-80 mt-2 max-w-md leading-relaxed text-[#111] bg-white/90 px-4 py-2 rounded-sm shadow-lg">
                        "{motivation}"
                    </p>
                </div>
            )}
        </div>
        
        {/* Phase Message */}
         <p className="mt-8 text-xs font-bold uppercase tracking-widest opacity-60 animate-pulse-slow">
            {phaseMessage}
        </p>

      </div>

      {/* Bottom Controls */}
      <div className="relative z-20 p-8 w-full flex justify-between items-end">
        <button 
          onClick={onEmergencyExit}
          className="group flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-white border-b border-transparent group-hover:border-white transition-all">
            Emergency Exit
          </span>
          <X className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
};

export default FocusLock;
