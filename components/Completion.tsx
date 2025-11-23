
import React from 'react';
import { Check, Zap, Play } from 'lucide-react';
import { TrainerLevel } from '../types';

interface CompletionProps {
    onHome: () => void;
    duration: number;
    streak: number;
    level: TrainerLevel;
}

const Completion: React.FC<CompletionProps> = ({ onHome, duration, streak, level }) => {
    const minutes = Math.floor(duration / 60);

    return (
        <div className="fixed inset-0 bg-[#FFD600] flex items-center justify-center p-6 text-black animate-fade-in">
            <div className="max-w-lg w-full text-center relative">
                
                {/* Big Checkmark */}
                <div className="w-24 h-24 bg-black text-[#FFD600] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <Check className="w-12 h-12 stroke-[4]" />
                </div>

                <h1 className="text-6xl font-black uppercase tracking-tighter mb-2 italic">DONE.</h1>
                <p className="text-xl font-bold uppercase tracking-widest mb-12 opacity-60">
                    {minutes} Minutes of Deep Work
                </p>

                <div className="bg-black/5 p-8 border-2 border-black/10 mb-12">
                    <p className="text-2xl font-black italic uppercase leading-none mb-2">
                        "That is what discipline looks like."
                    </p>
                    <div className="w-12 h-1 bg-black/20 mx-auto my-4"></div>
                    <div className="flex justify-center items-center gap-6 text-sm font-bold uppercase tracking-wider opacity-60">
                        <div className="flex items-center gap-1">
                            <Zap className="w-4 h-4 fill-black" />
                            Level {streak}
                        </div>
                        <div>
                            Rank: {level}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <button 
                        onClick={onHome}
                        className="w-full py-5 bg-black text-white hover:scale-[1.02] transition-transform font-black uppercase tracking-widest text-lg shadow-xl"
                    >
                        Reset & Go Again
                    </button>
                    <button 
                        onClick={onHome} // In a real app, maybe a share button or break timer
                        className="block w-full py-3 text-xs font-bold uppercase tracking-[0.2em] opacity-50 hover:opacity-100"
                    >
                        Take a 5 min break
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Completion;
