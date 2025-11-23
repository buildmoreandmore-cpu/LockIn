
import React, { useState } from 'react';
import { ChevronRight, PlayCircle, AlertTriangle } from 'lucide-react';
import { EXIT_REASONS, TrainerLevel, ExitReason } from '../types';

interface EmergencyExitProps {
  onCancelExit: () => void;
  onConfirmExit: (reason: string) => void;
  timeLeft: number;
  streak: number;
  task: string;
  level: TrainerLevel;
}

const EmergencyExit: React.FC<EmergencyExitProps> = ({ onCancelExit, onConfirmExit, timeLeft, streak, task, level }) => {
  const [step, setStep] = useState<'FRICTION' | 'SURVEY' | 'REFLECTION'>('FRICTION');
  const [selectedReason, setSelectedReason] = useState<ExitReason | null>(null);

  const minutesLeft = Math.ceil(timeLeft / 60);

  // STEP 1: The "Really?" Screen (Friction)
  if (step === 'FRICTION') {
      const isLateStage = minutesLeft <= 5;

      return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#111] p-6 animate-fade-in text-white">
            <div className="max-w-md w-full border border-white/10 bg-[#1a1a1a] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#D90429]"></div>

                <div className="text-center mb-8">
                    <h2 className="text-4xl font-black uppercase italic mb-4 text-white">
                        {isLateStage ? "ARE YOU KIDDING?" : "HOLD UP."}
                    </h2>
                    
                    <p className="text-lg font-bold text-white/80 mb-6 uppercase tracking-wide">
                        You have <span className="text-[#D90429]">{minutesLeft} minutes</span> remaining.
                    </p>
                    
                    <div className="bg-white/5 p-6 border-l-4 border-[#D90429] text-left mb-8">
                        <p className="text-sm font-bold uppercase leading-relaxed text-white/90">
                            {isLateStage 
                                ? "You've already done the hard work. Quitting now is worse than not starting at all."
                                : "This is the moment where discipline is built. Don't waste it."
                            }
                        </p>
                    </div>

                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                        I can't force you to stay.<br/>
                        But you told me you wanted this.
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={onCancelExit}
                        className="w-full py-4 bg-white text-black hover:bg-gray-200 font-black uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02]"
                    >
                        <PlayCircle className="w-5 h-5 fill-current" />
                        {isLateStage ? "FINISH THE SESSION" : "STAY LOCKED IN"}
                    </button>
                    
                    <button
                        onClick={() => setStep('SURVEY')}
                        className="w-full py-3 text-white/30 hover:text-[#D90429] font-bold uppercase text-[10px] tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
                    >
                        {isLateStage ? "Exit anyway" : "Yes, I need to exit"} &rarr;
                    </button>
                </div>
            </div>
        </div>
      )
  }

  // STEP 2: The Survey (Accountability)
  if (step === 'SURVEY') {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#111] p-6 text-white">
        <div className="max-w-md w-full border border-white/10 bg-[#1a1a1a] p-8 shadow-2xl animate-fade-in">
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h2 className="text-xl font-black uppercase tracking-wider italic">What Happened?</h2>
          </div>
          
          <div className="space-y-3">
            {EXIT_REASONS.map((reason) => (
              <button
                key={reason.id}
                onClick={() => {
                    setSelectedReason(reason);
                    setStep('REFLECTION');
                }}
                className="w-full text-left px-5 py-4 bg-black/40 border border-white/5 hover:border-white/40 hover:bg-white/5 text-white/70 hover:text-white transition-all flex justify-between items-center group"
              >
                <span className="font-bold text-xs uppercase tracking-wide">{reason.label}</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#FFD600]" />
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
             <button onClick={onCancelExit} className="text-[10px] uppercase font-bold text-white/30 hover:text-white transition-colors">
                Nevermind, I'll finish.
             </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: The Response (Hardass Wisdom)
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#111] p-6 text-white">
      <div className="max-w-md w-full border border-white/10 bg-[#1a1a1a] p-8 text-center shadow-2xl animate-fade-in">
        
        {selectedReason && (
            <>
                <div className="mb-6">
                    <AlertTriangle className="w-8 h-8 text-[#FFD600] mx-auto mb-4" />
                    <h2 className="text-2xl font-black uppercase tracking-wider mb-2 italic text-[#FFD600]">
                        {selectedReason.responseTitle}
                    </h2>
                </div>

                <div className="bg-white/5 p-6 border-l-2 border-[#FFD600] text-left mb-8 space-y-2">
                    {selectedReason.responseText.map((line, idx) => (
                         <p key={idx} className="text-white font-bold uppercase leading-relaxed text-xs">
                            {line}
                        </p>
                    ))}
                </div>

                {selectedReason.resumeAvailable && (
                     <p className="text-[10px] text-white/40 mb-8 uppercase tracking-widest font-bold">
                        Your streak is safe if you resume now.
                    </p>
                )}

                <div className="space-y-3">
                    {selectedReason.resumeAvailable ? (
                        <>
                            <button
                                onClick={onCancelExit}
                                className="w-full py-4 bg-white text-black hover:bg-gray-200 font-black uppercase tracking-wider text-sm transition-all"
                            >
                                {selectedReason.actionText}
                            </button>
                            <button
                                onClick={() => onConfirmExit(selectedReason.label)}
                                className="w-full py-3 text-white/30 hover:text-[#D90429] font-bold uppercase text-[10px] tracking-widest"
                            >
                                End Session (Break Streak)
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => onConfirmExit(selectedReason.label)}
                            className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-black font-black uppercase tracking-wider transition-all border border-white/20"
                        >
                            {selectedReason.actionText} (End Session)
                        </button>
                    )}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default EmergencyExit;
