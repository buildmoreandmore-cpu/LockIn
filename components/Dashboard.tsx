import React, { useState } from 'react';
import { Lock, Zap, ShieldAlert, ChevronRight, ChevronDown, Briefcase, BookOpen, Terminal, Dumbbell, Brain, PhoneOff, Book, PenTool } from 'lucide-react';
import { TrainerLevel, PRESET_ACTIVITIES, ActivityPreset } from '../types';

interface DashboardProps {
  onStartSession: (duration: number, modeLabel: 'QUICK' | 'STANDARD' | 'BEAST', taskName?: string) => void;
  streak: number;
  level: TrainerLevel;
  totalSessions: number;
  burnoutStatus?: { detected: boolean; message?: string };
  patterns?: { bestTime: string; bestDay: string; quitMinute: number | null };
}

// Icon mapping helper
const getIcon = (iconName: string) => {
  const icons:Record<string, React.ReactNode> = {
    Briefcase: <Briefcase className="w-4 h-4" />,
    BookOpen: <BookOpen className="w-4 h-4" />,
    Terminal: <Terminal className="w-4 h-4" />,
    Dumbbell: <Dumbbell className="w-4 h-4" />,
    Brain: <Brain className="w-4 h-4" />,
    SmartphoneOff: <PhoneOff className="w-4 h-4" />,
    Book: <Book className="w-4 h-4" />,
    PenTool: <PenTool className="w-4 h-4" />,
  };
  return icons[iconName] || <Zap className="w-4 h-4" />;
};

const Dashboard: React.FC<DashboardProps> = ({ onStartSession, streak, level, totalSessions, burnoutStatus, patterns }) => {
  const [duration, setDuration] = useState(25);
  const [showAllPresets, setShowAllPresets] = useState(false);
  
  const handleStart = (taskName?: string) => {
    if (burnoutStatus?.detected) return;
    
    let mode: 'QUICK' | 'STANDARD' | 'BEAST' = 'STANDARD';
    if (duration <= 15) mode = 'QUICK';
    if (duration >= 45) mode = 'BEAST';
    onStartSession(duration * 60, mode, taskName);
  };

  const getModeLabel = () => {
    if (duration <= 15) return "Quick Hit (15m)";
    if (duration >= 45) return "Beast Mode (50m)";
    return "Standard (25m)";
  };

  const getLevelColor = () => {
      switch(level) {
          case TrainerLevel.RECRUIT: return "text-white/70";
          case TrainerLevel.SOLDIER: return "text-[#FFD600]";
          case TrainerLevel.WARRIOR: return "text-[#FF7D00]";
          case TrainerLevel.COMMANDER: return "text-[#D90429]";
      }
  };

  // Determine which presets to show
  const visiblePresets = showAllPresets ? PRESET_ACTIVITIES : PRESET_ACTIVITIES.slice(0, 3);

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
        
        {/* Burnout / Intro Messages */}
        {burnoutStatus?.detected ? (
           <div className="mb-8 p-4 border-l-4 border-[#D90429] bg-white/5 text-left max-w-lg w-full">
               <h3 className="text-[#D90429] font-black uppercase tracking-wider text-xs mb-1">Training Blocked</h3>
               <p className="text-sm font-bold text-white/90 leading-relaxed">
                   {burnoutStatus.message}
               </p>
           </div>
        ) : totalSessions < 3 ? (
            <div className="mb-8 p-4 border-l-2 border-[#FFD600] bg-white/5 text-left max-w-lg">
                <p className="text-sm font-medium italic text-white/80 leading-relaxed">
                    "Most productivity apps lie. They say you can't focus. This one tells the truth: You CAN focus. You just need someone to stop you from quitting."
                </p>
            </div>
        ) : null}

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
            <div className="w-full px-2 mb-10">
                <input 
                    type="range" 
                    min="5" 
                    max="90" 
                    step="5" 
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    disabled={!!burnoutStatus?.detected}
                    className={`w-full h-2 bg-white/10 rounded-none appearance-none cursor-pointer accent-[#FFD600] hover:bg-white/20 transition-colors ${burnoutStatus?.detected ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <div className="flex justify-between mt-3 text-[10px] font-mono text-white/40 uppercase">
                    <span>Quick Hit</span>
                    <span>Standard</span>
                    <span>Beast Mode</span>
                </div>
            </div>

            {/* PRESET ACTIVITIES SECTION */}
            {!burnoutStatus?.detected && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Select Mission</h3>
                   <button 
                      onClick={() => setShowAllPresets(!showAllPresets)}
                      className="text-[10px] font-bold uppercase tracking-wider text-[#FFD600] flex items-center gap-1 hover:text-white transition-colors"
                   >
                     {showAllPresets ? 'Show Less' : 'Show All'}
                     <ChevronDown className={`w-3 h-3 transition-transform ${showAllPresets ? 'rotate-180' : ''}`} />
                   </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {visiblePresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleStart(preset.label)}
                      className="group relative flex flex-col items-center justify-center p-4 border border-white/10 bg-white/5 hover:bg-[#FFD600] hover:border-[#FFD600] transition-all duration-200 active:scale-[0.98]"
                    >
                      <div className="mb-2 text-white/70 group-hover:text-black transition-colors">
                        {getIcon(preset.icon)}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white group-hover:text-black transition-colors">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Warning (Only if manual start needed, otherwise presets handle it) */}
            <div className="mb-8 flex items-start justify-center gap-2 opacity-60">
                <ShieldAlert className="w-4 h-4 text-[#D90429] mt-0.5" />
                <p className="text-[10px] text-left max-w-[200px] leading-tight font-medium uppercase text-white/80">
                    Don't pick Beast Mode just to look tough.<br/>
                    Pick what you can finish.
                </p>
            </div>

            {/* Manual Lock In Button */}
            <button
            onClick={() => handleStart()}
            disabled={!!burnoutStatus?.detected}
            className={`group w-full py-5 bg-white/10 hover:bg-white text-white hover:text-black clip-path-polygon flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] border border-white/20 ${burnoutStatus?.detected ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
            <Lock className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
            <span className="text-lg font-black uppercase tracking-widest">CUSTOM LOCK IN</span>
            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
            </button>
            
             <p className="text-[10px] text-white/30 font-medium uppercase mt-4 tracking-wider">
                Once you start, the only way out is through.
            </p>
        </div>
        
        {/* Quick Stats Footer */}
        {patterns && (
            <div className="mt-8 grid grid-cols-2 gap-8 text-center opacity-60 w-full max-w-md">
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">Peak Time</div>
                    <div className="text-xs font-mono text-[#FFD600]">{patterns.bestTime}</div>
                </div>
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">Danger Zone</div>
                    <div className="text-xs font-mono text-[#D90429]">Min {patterns.quitMinute || '--'}</div>
                </div>
            </div>
        )}

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