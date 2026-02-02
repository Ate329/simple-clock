
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'pomodoro_stats';

export const usePomodoroStats = () => {
    const [stats, setStats] = useState({
        totalFocusTime: 0, // in minutes
        totalBreakTime: 0, // in minutes
        completedSessions: 0
    });

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setStats({
                    totalFocusTime: parsed.totalFocusTime || 0,
                    totalBreakTime: parsed.totalBreakTime || 0,
                    completedSessions: parsed.completedSessions || 0
                });
            } catch (e) {
                console.error('Failed to parse pomodoro stats', e);
            }
        }
    }, []);

    const saveStats = useCallback((newStats) => {
        setStats(newStats);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    }, []);

    const addDuration = useCallback((seconds, mode) => {
        setStats(prev => {
            const minutes = seconds / 60;
            const newStats = { ...prev };

            if (mode === 'focus') {
                newStats.totalFocusTime = (newStats.totalFocusTime || 0) + minutes;
            } else {
                newStats.totalBreakTime = (newStats.totalBreakTime || 0) + minutes;
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
            return newStats;
        });
    }, []);

    const incrementSessions = useCallback(() => {
        setStats(prev => {
            const newStats = {
                ...prev,
                completedSessions: (prev.completedSessions || 0) + 1
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
            return newStats;
        });
    }, []);

    return { stats, addDuration, incrementSessions };
};

export default usePomodoroStats;
