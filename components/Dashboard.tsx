
import React, { useState } from 'react';
import { Lock, Zap, ShieldAlert, ChevronRight } from 'lucide-react';
import { TrainerLevel } from '../types';

interface DashboardProps {
  onStartSession: (duration: number, modeLabel: 'QUICK' | 'STANDARD' | 'BEAST') => void;
  streak: number;
  level: TrainerLevel;
  totalSessions: number;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartSession, streak, level, totalSessions }) => {
  const [duration, setDuration] = useState(25);
  
  const handleStart = () => {
    let mode: 'QUICK' | 'STANDARD' | 'BEAST' = 'STANDARD';
    if (duration <= 15) mode = 'QUICK';
    if (duration >= 45) mode = 'BEAST';
    onStartSession(duration * 60, mode);
  };

  const getModeLabel = () => {
    if (duration <= 15) return "Quick Hit";
    if (duration >= 45) return "Beast Mode";
    return "Standard";
  };

  const getLevelColor = () => {
      switch(level) {
          case TrainerLevel.RECRUIT: return "text-white/70";
          case TrainerLevel.SOLDIER: return "text-[#FFD600]";
          case TrainerLevel.WARRIOR: return "text-[#FF7D00]";
          case TrainerLevel.COMMANDER: return "text-[#D90429]";
      }
  };

  return (
    <div className="min-h-screen w-full bg-[#111] flex flex-col relative overflow-hidden text-white font-sans selection:bg-[#FFD600] selection:text-black">
      
      {/* Gritty Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Header */}
      <header className="flex justify-between items-center p-6 md:p-8 relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="flex flex-col">
            <h1 className="text-2xl font-black uppercase tracking-tighter italic">LOCKIN</h1>
            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Training System</span>
        </div>
        <div className="flex flex-col items-end">
            <div className={`flex items-center gap-2 font-black uppercase tracking-wider text-sm ${getLevelColor()}`}>
                <Zap className="w-4 h-4" fill="currentColor" />
                <span>{level}</span>
            </div>
            <span className="text-[10px] text-white/40 font-mono">STRK: {streak} | SES: {totalSessions}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full max-w-xl mx-auto text-center pb-12">
        
        <div className="w-full border-t border-l border-r border-white/20 rounded-t-sm p-2 flex justify-between items-center bg-white/5">
             <span className="text-[10px] font-mono text-white/50 uppercase">SYSTEM STATUS: READY</span>
             <span className="text-[10px] font-mono text-[#FFD600] uppercase animate-pulse">AWAITING INPUT</span>
        </div>

        <div className="w-full border border-white/20 bg-[#1a1a1a] p-8 md:p-12 relative shadow-2xl">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FFD600]"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FFD600]"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FFD600]"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FFD600]"></div>

            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/50 mb-8">
                How long can you go?
            </h2>

            {/* Time Display */}
            <div className="relative mb-8">
                <span className="text-[6rem] md:text-[8rem] leading-none font-black tracking-tighter text-white tabular-nums">
                    {duration}
                </span>
                <span className="text-xl font-bold text-[#FFD600] uppercase tracking-widest absolute top-2 right-4 md:right-12">MINS</span>
            </div>

            {/* Mode Label */}
            <div className="mb-10">
                <span className={`inline-block px-4 py-1 rounded-sm text-xs font-black uppercase tracking-[0.2em] ${
                    duration >= 45 ? 'bg-[#D90429] text-white' : 
                    duration <= 15 ? 'bg-white/20 text-white' : 'bg-[#FFD600] text-black'
                }`}>
                    {getModeLabel()}
                </span>
            </div>

            {/* Slider */}
            <div className="w-full px-2 mb-8">
                <input 
                    type="range" 
                    min="5" 
                    max="90" 
                    step="5" 
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-none appearance-none cursor-pointer accent-[#FFD600] hover:bg-white/20 transition-colors"
                />
                <div className="flex justify-between mt-3 text-[10px] font-mono text-white/40 uppercase">
                    <span>Quick Hit</span>
                    <span>Standard</span>
                    <span>Beast Mode</span>
                </div>
            </div>

            {/* Warning */}
            <div className="mb-8 flex items-start justify-center gap-2 opacity-60">
                <ShieldAlert className="w-4 h-4 text-[#D90429] mt-0.5" />
                <p className="text-[10px] text-left max-w-[200px] leading-tight font-medium uppercase text-white/80">
                    Don't start unless you're serious.<br/>
                    No quitting without consequences.
                </p>
            </div>

            {/* Lock In Button */}
            <button
            onClick={handleStart}
            className="group w-full py-5 bg-[#FFD600] hover:bg-white text-black clip-path-polygon flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98]"
            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
            <Lock className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
            <span className="text-lg font-black uppercase tracking-widest">LOCK IN NOW</span>
            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
            </button>
        </div>

      </main>

      {/* Footer Settings */}
      <footer className="p-6 text-center z-10">
         <button className="text-white/20 hover:text-white/50 uppercase tracking-widest text-[10px] font-bold transition-colors">
            Configure System
         </button>
      </footer>
    </div>
  );
};

export default Dashboard;
