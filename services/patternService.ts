import { FocusSession, BurnoutStatus } from '../types';

export const detectQuitPointPattern = (history: FocusSession[]) => {
  const exitedSessions = history.filter(s => !s.completed && s.actualDuration && s.exitReason);
  
  if (exitedSessions.length < 3) return null;

  // Group by 5 minute buckets
  const buckets: Record<number, number> = {};
  exitedSessions.forEach(session => {
    const minute = Math.floor(session.actualDuration || 0);
    const bucket = Math.floor(minute / 5) * 5;
    buckets[bucket] = (buckets[bucket] || 0) + 1;
  });

  // Find dominant bucket
  let maxCount = 0;
  let quitMinute = null;

  Object.entries(buckets).forEach(([bucket, count]) => {
    if (count > maxCount) {
      maxCount = count;
      quitMinute = parseInt(bucket);
    }
  });

  // Only return if significant pattern (e.g., > 30% of exits or >= 3 times)
  if (maxCount >= 2) {
      return { 
          quitMinute,
          frequency: maxCount
      };
  }

  return null;
};

export const analyzeTimeOfDayPerformance = (history: FocusSession[]) => {
    if (history.length < 5) return { bestTime: null };

    // Group by 3-hour blocks: 0-3, 3-6, 6-9, 9-12, 12-15, 15-18, 18-21, 21-24
    const blocks: Record<string, { total: number, completed: number }> = {};

    history.forEach(session => {
        if (!session.timeOfDay) return;
        const hour = parseInt(session.timeOfDay.split(':')[0]);
        const blockStart = Math.floor(hour / 3) * 3;
        const blockLabel = `${blockStart}:00-${blockStart + 3}:00`;

        if (!blocks[blockLabel]) blocks[blockLabel] = { total: 0, completed: 0 };
        blocks[blockLabel].total++;
        if (session.completed) blocks[blockLabel].completed++;
    });

    let bestTime = null;
    let bestRate = 0;

    Object.entries(blocks).forEach(([label, stats]) => {
        const rate = stats.completed / stats.total;
        if (stats.total >= 3 && rate >= bestRate) {
            bestRate = rate;
            bestTime = { timeRange: label, rate };
        }
    });

    return { bestTime };
};

export const analyzeDayOfWeekPerformance = (history: FocusSession[]) => {
    if (history.length < 5) return { bestDay: null };

    const days: Record<string, { total: number, completed: number }> = {};

    history.forEach(session => {
        const day = session.dayOfWeek;
        if (!day) return;
        
        if (!days[day]) days[day] = { total: 0, completed: 0 };
        days[day].total++;
        if (session.completed) days[day].completed++;
    });

    let bestDay = null;
    let bestRate = 0;

    Object.entries(days).forEach(([day, stats]) => {
        const rate = stats.completed / stats.total;
        if (stats.total >= 3 && rate >= bestRate) {
            bestRate = rate;
            bestDay = { day, rate };
        }
    });

    return { bestDay };
};

export const detectBurnout = (history: FocusSession[]): BurnoutStatus => {
    const now = new Date();
    const todayStr = now.toDateString();
    
    // 1. Daily Overload
    const sessionsToday = history.filter(s => new Date(s.timestamp).toDateString() === todayStr);
    if (sessionsToday.length >= 5) {
        return {
            detected: true,
            message: `You've already done ${sessionsToday.length} sessions today. Rest is part of the process.`,
            recommendation: "BLOCK_NEW_SESSION"
        };
    }

    // 2. Late Night
    const currentHour = now.getHours();
    if (currentHour >= 23 || currentHour < 5) {
        return {
            detected: true,
            message: "It's late. Sleep is more important than one more session.",
            recommendation: "SUGGEST_REST"
        };
    }

    return { detected: false };
};