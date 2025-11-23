
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import FocusLock from './components/FocusLock';
import EmergencyExit from './components/EmergencyExit';
import Completion from './components/Completion';
import { AppMode, FocusSession, TrainerLevel } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.DASHBOARD);
  const [task, setTask] = useState('');
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [streak, setStreak] = useState(1);
  const [history, setHistory] = useState<FocusSession[]>([]);
  
  const timerRef = useRef<number | null>(null);

  // Derived State
  const totalSessions = history.filter(s => s.completed).length;
  
  const getTrainerLevel = (sessions: number): TrainerLevel => {
      if (sessions > 50) return TrainerLevel.COMMANDER;
      if (sessions > 20) return TrainerLevel.WARRIOR;
      if (sessions > 5) return TrainerLevel.SOLDIER;
      return TrainerLevel.RECRUIT;
  };
  
  const currentLevel = getTrainerLevel(totalSessions);

  const startSession = (durationSeconds: number, modeLabel: 'QUICK' | 'STANDARD' | 'BEAST') => {
    setTask(''); // Reset task on start, ask in lock screen
    setTotalTime(durationSeconds);
    setTimeLeft(durationSeconds);
    setMode(AppMode.FOCUS);
  };

  const completeSession = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setStreak(s => s + 1);
    setHistory(prev => [...prev, {
      id: Date.now().toString(),
      duration: totalTime,
      completed: true,
      taskName: task || "Focus Session",
      timestamp: Date.now(),
      mode: totalTime >= 45 * 60 ? 'BEAST' : totalTime <= 15 * 60 ? 'QUICK' : 'STANDARD'
    }]);
    setMode(AppMode.COMPLETED);
  }, [task, totalTime]);

  // Timer
  useEffect(() => {
    if (mode === AppMode.FOCUS) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, completeSession]);

  const handleEmergencyExit = () => {
    setMode(AppMode.EMERGENCY_EXIT);
  };

  const handleCancelExit = () => {
      setMode(AppMode.FOCUS);
  };

  const handleConfirmExit = (reason: string) => {
    setStreak(1);
    setHistory(prev => [...prev, {
      id: Date.now().toString(),
      duration: totalTime - timeLeft,
      completed: false,
      taskName: task || "Focus Session",
      timestamp: Date.now(),
      mode: 'STANDARD'
    }]);
    setMode(AppMode.DASHBOARD);
  };

  const handleHome = () => {
      setMode(AppMode.DASHBOARD);
  };

  return (
    <>
        {mode === AppMode.DASHBOARD && (
            <Dashboard 
                onStartSession={startSession} 
                streak={streak} 
                level={currentLevel}
                totalSessions={totalSessions}
            />
        )}
        
        {mode === AppMode.FOCUS && (
            <FocusLock 
                task={task}
                timeLeft={timeLeft}
                totalTime={totalTime}
                onEmergencyExit={handleEmergencyExit}
                onUpdateTask={setTask}
                level={currentLevel}
                streak={streak}
            />
        )}

        {mode === AppMode.EMERGENCY_EXIT && (
            <EmergencyExit
                onCancelExit={handleCancelExit}
                onConfirmExit={handleConfirmExit}
                timeLeft={timeLeft}
                streak={streak}
                task={task}
                level={currentLevel}
            />
        )}

        {mode === AppMode.COMPLETED && (
            <Completion 
                onHome={handleHome}
                duration={totalTime}
                streak={streak}
                level={currentLevel}
            />
        )}
    </>
  );
};

export default App;
