
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { TrainerLevel } from '../types';

interface FocusLockProps {
  initialTask: string;
  timeLeft: number;
  totalTime: number;
  onEmergencyExit: () => void;
  level: TrainerLevel;
  streak: number;
}

const FocusLock: React.FC<FocusLockProps> = ({ initialTask, timeLeft, totalTime, onEmergencyExit, level, streak }) => {
  const [localTask, setLocalTask] = useState(initialTask);
  const [isEditing, setIsEditing] = useState(!initialTask); // If task provided, don't edit
  
  // Phase Logic
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;
  const minutesLeft = Math.ceil(timeLeft / 60);
  
  // Dynamic Messaging based on Copy Deck
  let bgClass = "from-[#FFD600] to-[#FFAA00]"; // Default Yellow
  let phaseText = "The Grind";
  let phaseMessage = "";

  // Phase 1: The Start (0-25%)
  if (progressPercent <= 25) {
      bgClass = "from-[#FFD600] to-[#E89B00]";
      phaseText = "The Start";
      if (progressPercent < 10) {
           phaseMessage = "The first 3 minutes hurt. That's normal.";
      } else {
           phaseMessage = "Your brain is settling. Stay with it.";
      }
  } 
  // Phase 2: The Middle (25-75%)
  else if (progressPercent <= 75) {
      bgClass = "from-[#FF8C00] to-[#E85D04]"; // Orange
      phaseText = "The Zone";
      if (progressPercent < 50) {
          phaseMessage = "This is where most people quit. You're not most people.";
      } else {
          phaseMessage = "You're in the zone. This is what focus feels like.";
      }
  } 
  // Phase 3: The Final Push (75-100%)
  else {
      bgClass = "from-[#D90429] to-[#8D0012]"; // Red
      phaseText = "Final Push";
      if (progressPercent < 90) {
          phaseMessage = "HOME STRETCH. You've done the work. Now finish it.";
      } else if (minutesLeft <= 1) {
           phaseMessage = "FINISH STRONG.";
      } else {
          phaseMessage = "DON'T QUIT NOW.";
      }
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  useEffect(() => {
    // Request fullscreen on mount
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    }
    return () => {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  const handleTaskSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (localTask.trim()) {
          setIsEditing(false);
      }
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden flex flex-col text-white select-none transition-colors duration-1000 ease-in-out bg-gradient-to-br ${bgClass}`}>
      
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      
      {/* Animated Pulses */}
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
        <div className="w-64 h-2 bg-black/20 rounded-full overflow-hidden mb-12 relative">
            <div 
                className="h-full bg-white transition-all duration-1000 relative z-10"
                style={{ width: `${progressPercent}%` }}
            ></div>
        </div>

         {/* Phase Message */}
         <div className="h-16 flex items-center justify-center">
            <p className="text-sm md:text-base font-bold uppercase tracking-widest animate-pulse-slow max-w-md leading-relaxed">
                {phaseMessage}
            </p>
         </div>

        {/* Task Input (Secondary) */}
        <div className="mt-8 w-full max-w-md">
            {isEditing ? (
                <form onSubmit={handleTaskSubmit} className="w-full animate-fade-in opacity-50 hover:opacity-100 transition-opacity">
                    <input
                        type="text"
                        value={localTask}
                        onChange={(e) => setLocalTask(e.target.value)}
                        placeholder="What are you working on?"
                        autoFocus
                        className="w-full bg-transparent border-b border-white/30 text-center text-sm font-bold uppercase text-white placeholder-white/40 focus:outline-none focus:border-white pb-2"
                    />
                </form>
            ) : (
                <div onClick={() => setIsEditing(true)} className="cursor-pointer group animate-fade-in text-center opacity-40 hover:opacity-100 transition-opacity">
                    <h2 className="text-xs font-bold uppercase tracking-widest border-b border-transparent group-hover:border-white/50 inline-block pb-1">
                        Target: {localTask}
                    </h2>
                </div>
            )}
        </div>

      </div>

      {/* Bottom Controls */}
      <div className="relative z-20 p-8 w-full flex justify-between items-end">
        <button 
          onClick={onEmergencyExit}
          className="group flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity"
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
