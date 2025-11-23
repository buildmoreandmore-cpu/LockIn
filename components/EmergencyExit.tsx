
import React, { useState, useEffect } from 'react';
import { ChevronRight, PlayCircle, AlertTriangle } from 'lucide-react';
import { EXIT_REASONS, TrainerLevel } from '../types';
import { getExitReflection, getExitIntervention } from '../services/geminiService';

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
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [reflection, setReflection] = useState<string>('');
  const [intervention, setIntervention] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Fetch intervention text immediately on mount
  useEffect(() => {
    if (step === 'FRICTION') {
        getExitIntervention(Math.ceil(timeLeft / 60), level).then(setIntervention);
    }
  }, []);

  const handleReasonSelect = async (reasonId: string, label: string) => {
    setSelectedReason(label);
    setLoading(true);
    setStep('REFLECTION');
    const aiResponse = await getExitReflection(task || "Focus Session", label, level);
    setReflection(aiResponse);
    setLoading(false);
  };

  // STEP 1: The "Really?" Screen (Friction)
  if (step === 'FRICTION') {
      const minutesLeft = Math.ceil(timeLeft / 60);
      return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#111] p-6 animate-fade-in text-white">
            <div className="max-w-md w-full border border-white/10 bg-[#1a1a1a] p-8 shadow-2xl relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#D90429]"></div>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black uppercase italic mb-2">REALLY?</h2>
                    <p className="text-lg font-bold text-white/60 mb-6">
                        You have <span className="text-[#D90429]">{minutesLeft} minutes</span> left.
                    </p>
                    
                    <div className="bg-white/5 p-4 border-l-2 border-[#D90429] text-left mb-6">
                        <p className="text-sm italic font-medium opacity-80">
                            "{intervention || "This is the moment where discipline is built. Don't waste it."}"
                        </p>
                    </div>

                    <p className="text-xs uppercase tracking-widest text-white/30">
                        I can't force you to stay.<br/>
                        But you told me you wanted this.
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={onCancelExit}
                        className="w-full py-4 bg-white text-black hover:bg-gray-200 font-black uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        <PlayCircle className="w-5 h-5 fill-current" />
                        PUSH THROUGH
                    </button>
                    
                    <button
                        onClick={() => setStep('SURVEY')}
                        className="w-full py-3 text-white/30 hover:text-[#D90429] font-bold uppercase text-[10px] tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
                    >
                        I have a real emergency &rarr;
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
        <div className="max-w-md w-full border border-white/10 bg-[#1a1a1a] p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h2 className="text-xl font-black uppercase tracking-wider">What Happened?</h2>
          </div>
          
          <div className="space-y-3">
            {EXIT_REASONS.map((reason) => (
              <button
                key={reason.id}
                onClick={() => handleReasonSelect(reason.id, reason.label)}
                className="w-full text-left px-5 py-4 bg-black/40 border border-white/5 hover:border-white/40 hover:bg-white/5 text-white/70 hover:text-white transition-all flex justify-between items-center group"
              >
                <span className="font-bold text-xs uppercase tracking-wide">{reason.label}</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#FFD600]" />
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
             <button onClick={onCancelExit} className="text-[10px] uppercase font-bold text-white/30 hover:text-white">
                Nevermind, I'll finish.
             </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: The Reflection (Truth)
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#111] p-6 text-white">
      <div className="max-w-md w-full border border-white/10 bg-[#1a1a1a] p-8 text-center shadow-2xl">
        
        {loading ? (
            <div className="animate-pulse py-12 flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-[#FFD600] rounded-full animate-spin mb-4"></div>
                <span className="text-xs font-mono uppercase text-white/40">Analyzing...</span>
            </div>
        ) : (
            <>
                <div className="mb-6">
                    <AlertTriangle className="w-8 h-8 text-[#FFD600] mx-auto mb-4" />
                    <h2 className="text-2xl font-black uppercase tracking-wider mb-2">Debrief</h2>
                </div>

                <div className="bg-white/5 p-6 border-l-2 border-[#FFD600] text-left mb-8">
                    <p className="text-white italic font-medium leading-relaxed text-sm">
                        "{reflection}"
                    </p>
                </div>

                <p className="text-xs text-white/40 mb-8 uppercase tracking-widest">
                    Streak Reset. Discipline is built tomorrow.
                </p>

                <button
                onClick={() => onConfirmExit(selectedReason)}
                className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-black font-black uppercase tracking-wider transition-all border border-white/20"
                >
                Acknowledge & Reset
                </button>
            </>
        )}
      </div>
    </div>
  );
};

export default EmergencyExit;
