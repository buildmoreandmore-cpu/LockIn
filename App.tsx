
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import FocusLock from './components/FocusLock';
import EmergencyExit from './components/EmergencyExit';
import Completion from './components/Completion';
import { AppMode, FocusSession, TrainerLevel } from './types';
import { detectBurnout, analyzeTimeOfDayPerformance, analyzeDayOfWeekPerformance, detectQuitPointPattern } from './services/patternService';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.DASHBOARD);
  const [task, setTask] = useState('');
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [streak, setStreak] = useState(1);
  const [history, setHistory] = useState<FocusSession[]>([]);
  
  // Pattern State
  const [burnoutStatus, setBurnoutStatus] = useState({ detected: false });
  const [patterns, setPatterns] = useState<{ bestTime: string; bestDay: string; quitMinute: number | null }>({ bestTime: '--', bestDay: '--', quitMinute: null });

  const timerRef = useRef<number | null>(null);

  // Derived State
  const totalSessions = history.filter(s => s.completed).length;
  const currentUserId = "user-1"; // Mock user ID
  
  const getTrainerLevel = (sessions: number): TrainerLevel => {
      if (sessions > 50) return TrainerLevel.COMMANDER;
      if (sessions > 20) return TrainerLevel.WARRIOR;
      if (sessions > 5) return TrainerLevel.SOLDIER;
      return TrainerLevel.RECRUIT;
  };
  
  const currentLevel = getTrainerLevel(totalSessions);

  // Update patterns when history changes
  useEffect(() => {
    if (history.length > 0) {
      const timePerf = analyzeTimeOfDayPerformance(history);
      const dayPerf = analyzeDayOfWeekPerformance(history);
      const quitPattern = detectQuitPointPattern(history);
      
      setPatterns({
        bestTime: timePerf.bestTime?.timeRange || '--',
        bestDay: dayPerf.bestDay?.day || '--',
        quitMinute: quitPattern?.quitMinute || null
      });

      // Check for burnout
      const burnout = detectBurnout(history);
      setBurnoutStatus(burnout);
    }
  }, [history]);

  const startSession = (durationSeconds: number, modeLabel: 'QUICK' | 'STANDARD' | 'BEAST', taskName?: string) => {
    // Re-check burnout before starting (double safety)
    const burnout = detectBurnout(history);
    if (burnout.detected && burnout.recommendation === "BLOCK_NEW_SESSION") {
        setBurnoutStatus(burnout);
        return;
    }

    setTask(taskName || ''); 
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
      mode: totalTime >= 45 * 60 ? 'BEAST' : totalTime <= 15 * 60 ? 'QUICK' : 'STANDARD',
      actualDuration: totalTime / 60,
      dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(),
      timeOfDay: new Date().toLocaleTimeString('en-US', { hour12: false })
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
    const isResume = reason === "RESUME"; // Special flag if we add resume logic later, currently handled by Cancel
    
    setStreak(1); // Break streak on exit
    setHistory(prev => [...prev, {
      id: Date.now().toString(),
      duration: totalTime,
      completed: false,
      taskName: task || "Focus Session",
      timestamp: Date.now(),
      mode: 'STANDARD',
      actualDuration: (totalTime - timeLeft) / 60,
      dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(),
      timeOfDay: new Date().toLocaleTimeString('en-US', { hour12: false }),
      exitReason: reason
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
                burnoutStatus={burnoutStatus}
                patterns={patterns}
            />
        )}
        
        {mode === AppMode.FOCUS && (
            <FocusLock 
                initialTask={task}
                timeLeft={timeLeft}
                totalTime={totalTime}
                onEmergencyExit={handleEmergencyExit}
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
