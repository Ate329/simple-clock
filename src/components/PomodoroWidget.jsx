import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Play, Pause, RotateCcw, Settings, X, SkipForward, CheckCircle2, Sparkles } from 'lucide-react';

const PomodoroWidget = ({ isOpen }) => {
    const [settings, setSettings] = useState({
        focusTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15,
        sessionsBeforeLongBreak: 4,
        autoStartBreaks: true,
        autoStartFocus: true,
    });

    const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus');
    const [completedSessions, setCompletedSessions] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [audioContext, setAudioContext] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [containerSize, setContainerSize] = useState(320);
    const containerRef = useRef(null);

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                const maxSize = Math.min(width, window.innerHeight * 0.45, 450);
                setContainerSize(Math.max(maxSize, 280));
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const getCurrentDuration = useCallback((currentMode) => {
        switch (currentMode) {
            case 'focus': return settings.focusTime * 60;
            case 'shortBreak': return settings.shortBreakTime * 60;
            case 'longBreak': return settings.longBreakTime * 60;
            default: return settings.focusTime * 60;
        }
    }, [settings]);

    const totalTime = getCurrentDuration(mode);
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    const size = containerSize;
    const strokeWidth = Math.max(4, size * 0.013);
    const radius = (size - strokeWidth) / 2 - 20;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const innerRadius = radius - Math.max(12, size * 0.04);
    const innerCircumference = innerRadius * 2 * Math.PI;

    const calculateOverallProgress = () => {
        const focusDuration = settings.focusTime * 60;
        const shortBreakDuration = settings.shortBreakTime * 60;
        const longBreakDuration = settings.longBreakTime * 60;

        const totalCycleTime =
            (settings.sessionsBeforeLongBreak * focusDuration) +
            ((settings.sessionsBeforeLongBreak - 1) * shortBreakDuration) +
            longBreakDuration;

        const completedFullCycles = Math.floor(completedSessions / settings.sessionsBeforeLongBreak);
        const sessionsInCurrentCycle = completedSessions % settings.sessionsBeforeLongBreak;

        let completedTimeInCurrentCycle = 0;

        for (let i = 0; i < sessionsInCurrentCycle; i++) {
            completedTimeInCurrentCycle += focusDuration;
            if (i < sessionsInCurrentCycle - 1) {
                completedTimeInCurrentCycle += shortBreakDuration;
            }
        }

        if (mode === 'shortBreak') {
            completedTimeInCurrentCycle += focusDuration;
            completedTimeInCurrentCycle += (shortBreakDuration - timeLeft);
        } else if (mode === 'longBreak') {
            completedTimeInCurrentCycle += focusDuration;
            for (let i = 0; i < settings.sessionsBeforeLongBreak - 1; i++) {
                completedTimeInCurrentCycle += focusDuration;
                completedTimeInCurrentCycle += shortBreakDuration;
            }
            completedTimeInCurrentCycle += (longBreakDuration - timeLeft);
        } else if (mode === 'focus' && sessionsInCurrentCycle < settings.sessionsBeforeLongBreak) {
            completedTimeInCurrentCycle += (focusDuration - timeLeft);
        }

        const currentCycleProgress = completedTimeInCurrentCycle / totalCycleTime;
        return Math.min(Math.max(currentCycleProgress, 0), 1);
    };

    const overallProgress = calculateOverallProgress();
    const innerStrokeDashoffset = innerCircumference - (overallProgress * innerCircumference);

    useEffect(() => {
        if (!audioContext) {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            setAudioContext(ctx);
        }
    }, [audioContext]);

    const playSound = useCallback((type) => {
        if (!audioContext) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (type === 'start') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } else if (type === 'complete') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2);
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.4);
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.5);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 1.5);
        } else if (type === 'celebration') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.15);
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.3);
            oscillator.frequency.setValueAtTime(1046.5, audioContext.currentTime + 0.45);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 2);
        }
    }, [audioContext]);

    const handleSessionComplete = useCallback(() => {
        playSound('complete');

        if (mode === 'focus') {
            const newCompletedSessions = completedSessions + 1;
            setCompletedSessions(newCompletedSessions);

            if (newCompletedSessions % settings.sessionsBeforeLongBreak === 0) {
                setMode('longBreak');
                setTimeLeft(settings.longBreakTime * 60);
                setIsActive(settings.autoStartBreaks);
            } else {
                setMode('shortBreak');
                setTimeLeft(settings.shortBreakTime * 60);
                setIsActive(settings.autoStartBreaks);
            }
        } else if (mode === 'longBreak') {
            const totalSessions = Math.ceil(completedSessions / settings.sessionsBeforeLongBreak) * settings.sessionsBeforeLongBreak;
            if (completedSessions >= totalSessions && completedSessions > 0) {
                playSound('celebration');
                setIsCompleted(true);
                setIsActive(false);
            } else {
                setMode('focus');
                setTimeLeft(settings.focusTime * 60);
                setIsActive(settings.autoStartFocus);
            }
        } else {
            setMode('focus');
            setTimeLeft(settings.focusTime * 60);
            setIsActive(settings.autoStartFocus);
        }
    }, [mode, completedSessions, settings, playSound]);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            setIsActive(false);
            handleSessionComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, handleSessionComplete]);

    const toggleTimer = () => {
        if (!isActive) {
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            playSound('start');
        }
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(getCurrentDuration(mode));
    };

    const resetAll = () => {
        setIsActive(false);
        setMode('focus');
        setTimeLeft(settings.focusTime * 60);
        setCompletedSessions(0);
        setIsCompleted(false);
    };

    const skipToNext = () => {
        setIsActive(false);
        handleSessionComplete();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        if (!isActive) {
            setTimeLeft(getCurrentDuration(mode));
        }
    }, [settings.focusTime, settings.shortBreakTime, settings.longBreakTime]);

    if (!isOpen) return null;

    const getActiveColor = () => {
        switch (mode) {
            case 'focus': return '#6366f1';
            case 'shortBreak': return '#2dd4bf';
            case 'longBreak': return '#f59e0b';
            default: return '#6366f1';
        }
    };

    const getModeLabel = () => {
        switch (mode) {
            case 'focus': return 'Focus';
            case 'shortBreak': return 'Short Break';
            case 'longBreak': return 'Long Break';
            default: return 'Focus';
        }
    };

    const activeColor = isCompleted ? '#10b981' : getActiveColor();
    const activeColorFaded = `${activeColor}25`;

    if (isCompleted) {
        return (
            <div ref={containerRef} className="flex flex-col items-center justify-center animate-fade-in w-full px-4 relative max-w-[90vw]">
            <div className="flex items-center gap-2 mb-2 sm:mb-6">
                    {Array.from({ length: settings.sessionsBeforeLongBreak }).map((_, i) => (
                        <div
                            key={i}
                            className="w-3 h-3 rounded-full bg-emerald-400 scale-100 transition-all duration-300"
                        />
                    ))}
                    <span className="text-emerald-400/60 text-sm ml-2">
                        All {completedSessions} sessions completed
                    </span>
                </div>

                <div
                className="px-4 py-1.5 rounded-full text-sm font-medium mb-3 sm:mb-8 transition-colors duration-500"
                    style={{ backgroundColor: activeColorFaded, color: activeColor }}
                >
                    <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Completed
                    </span>
                </div>

            <div className="relative mb-4 sm:mb-10">
                    <div
                        className="absolute inset-0 rounded-full blur-[80px] transition-all duration-1000 animate-pulse"
                        style={{
                            backgroundColor: activeColor,
                            opacity: 0.4,
                            transform: 'scale(1.3)'
                        }}
                    />

                    <div
                        className="relative flex items-center justify-center"
                        style={{ width: size, height: size }}
                    >
                        <div
                            className="absolute inset-8 rounded-full transition-colors duration-500"
                            style={{ backgroundColor: activeColorFaded }}
                        />

                        <svg
                            width={size}
                            height={size}
                            className="absolute top-0 left-0 -rotate-90"
                        >
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.08)"
                                strokeWidth={strokeWidth}
                            />
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={innerRadius}
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.15)"
                                strokeWidth={3}
                            />
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={innerRadius}
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.6)"
                                strokeWidth={3}
                                strokeLinecap="round"
                                strokeDasharray={innerCircumference}
                                strokeDashoffset={0}
                                className="transition-all duration-1000 ease-linear"
                            />
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke={activeColor}
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={0}
                                className="transition-all duration-1000 ease-linear"
                                style={{ filter: `drop-shadow(0 0 8px ${activeColor})` }}
                            />
                        </svg>

                        <div className="relative z-10 flex flex-col items-center text-center max-w-[280px]">
                            <Sparkles className="w-12 h-12 text-emerald-400 mb-4 animate-pulse" />
                            <h3 className="text-3xl font-light text-white mb-2">
                                Great Work!
                            </h3>
                            <p className="text-white/50 text-sm">
                                You have completed all {settings.sessionsBeforeLongBreak} focus sessions
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={resetAll}
                    className="w-16 h-16 rounded-full flex items-center justify-center bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl"
                    style={{ boxShadow: `0 0 30px ${activeColor}40` }}
                >
                    <RotateCcw className="w-6 h-6" />
                </button>

                <p className="mt-4 text-white/30 text-xs uppercase tracking-wider">
                    Start New Session
                </p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="flex flex-col items-center justify-center animate-fade-in w-full px-4 relative max-w-[90vw]">
            <div className="flex items-center gap-2 mb-6">
                {Array.from({ length: settings.sessionsBeforeLongBreak }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${i < completedSessions % settings.sessionsBeforeLongBreak ||
                            (completedSessions > 0 && completedSessions % settings.sessionsBeforeLongBreak === 0 && mode !== 'focus')
                            ? 'bg-white scale-100'
                            : 'bg-white/20 scale-90'
                            }`}
                    />
                ))}
                <span className="text-white/40 text-sm ml-2">
                    {completedSessions} {completedSessions === 1 ? 'session' : 'sessions'}
                </span>
            </div>

            <div
                className="px-4 py-1.5 rounded-full text-sm font-medium mb-8 transition-colors duration-500"
                style={{ backgroundColor: activeColorFaded, color: activeColor }}
            >
                {getModeLabel()}
            </div>

            <div className="relative mb-10">
                <div
                    className="absolute inset-0 rounded-full blur-[80px] transition-all duration-1000"
                    style={{
                        backgroundColor: activeColor,
                        opacity: isActive ? 0.3 : 0.15,
                        transform: isActive ? 'scale(1.3)' : 'scale(1)'
                    }}
                />

                <div
                    className="relative flex items-center justify-center"
                    style={{ width: size, height: size }}
                >
                    <div
                        className="absolute inset-8 rounded-full transition-colors duration-500"
                        style={{ backgroundColor: activeColorFaded }}
                    />

                    <svg
                        width={size}
                        height={size}
                        className="absolute top-0 left-0 -rotate-90"
                    >
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.08)"
                            strokeWidth={strokeWidth}
                        />
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={innerRadius}
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.15)"
                            strokeWidth={3}
                        />
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={innerRadius}
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.6)"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeDasharray={innerCircumference}
                            strokeDashoffset={innerStrokeDashoffset}
                            className="transition-all duration-1000 ease-linear"
                        />
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={activeColor}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-1000 ease-linear"
                            style={{ filter: `drop-shadow(0 0 8px ${activeColor})` }}
                        />
                    </svg>

                    <div className="relative z-10 flex flex-col items-center">
                        <span
                            className={`
                                text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-light tracking-tight tabular-nums  
                                text-white drop-shadow-lg font-mono
                                transition-transform duration-300
                                ${isActive ? 'scale-105' : 'scale-100'}
                            `}
                        >
                            {formatTime(timeLeft)}
                        </span>
                        <span className="text-white/40 text-xs uppercase tracking-[0.3em] mt-3 font-medium">
                            {isActive ? 'Running' : 'Paused'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 items-center">
                <button
                    onClick={skipToNext}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-md border border-white/5"
                    title="Skip to next"
                >
                    <SkipForward className="w-5 h-5" />
                </button>

                <button
                    onClick={toggleTimer}
                    className={`
                        w-16 h-16 rounded-full flex items-center justify-center 
                        transition-all duration-300 hover:scale-110 active:scale-95
                        backdrop-blur-md border shadow-xl
                        ${isActive
                            ? 'bg-white/15 border-white/20 text-white'
                            : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                        }
                    `}
                    style={{ boxShadow: isActive ? `0 0 30px ${activeColor}40` : undefined }}
                >
                    {isActive ? (
                        <Pause className="w-6 h-6" />
                    ) : (
                        <Play className="w-6 h-6 translate-x-0.5" />
                    )}
                </button>

                <button
                    onClick={resetTimer}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-md border border-white/5"
                    title="Reset current timer"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            <button
                onClick={() => setShowSettings(true)}
                className="mt-8 flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm"
            >
                <Settings className="w-4 h-4" />
                <span>Customize</span>
            </button>

            {completedSessions > 0 && (
                <button
                    onClick={resetAll}
                    className="absolute bottom-[-60px] flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/5 hover:bg-red-500/20 text-red-500/60 hover:text-red-200 transition-all duration-300 text-xs border border-red-500/5 hover:border-red-500/20 group"
                >
                    <RotateCcw className="w-3 h-3 group-hover:-rotate-180 transition-transform duration-500" />
                    Reset Session Progress
                </button>
            )}

            {showSettings && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md"
                    onClick={() => setShowSettings(false)}
                >
                    <div
                        className="bg-black/90 backdrop-blur-xl w-full max-w-sm p-6 rounded-3xl shadow-2xl m-4 border border-white/10"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-white">Timer Settings</h3>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="text-white/60 text-sm block mb-2">Focus Duration</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min="1"
                                        max="60"
                                        value={settings.focusTime}
                                        onChange={(e) => updateSetting('focusTime', parseInt(e.target.value))}
                                        className="flex-1"
                                    />
                                    <span className="text-white font-mono text-sm w-16 text-right">{settings.focusTime} min</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-white/60 text-sm block mb-2">Short Break</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min="1"
                                        max="30"
                                        value={settings.shortBreakTime}
                                        onChange={(e) => updateSetting('shortBreakTime', parseInt(e.target.value))}
                                        className="flex-1"
                                    />
                                    <span className="text-white font-mono text-sm w-16 text-right">{settings.shortBreakTime} min</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-white/60 text-sm block mb-2">Long Break</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min="5"
                                        max="60"
                                        value={settings.longBreakTime}
                                        onChange={(e) => updateSetting('longBreakTime', parseInt(e.target.value))}
                                        className="flex-1"
                                    />
                                    <span className="text-white font-mono text-sm w-16 text-right">{settings.longBreakTime} min</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-white/60 text-sm block mb-2">Sessions before long break</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min="2"
                                        max="10"
                                        value={settings.sessionsBeforeLongBreak}
                                        onChange={(e) => updateSetting('sessionsBeforeLongBreak', parseInt(e.target.value))}
                                        className="flex-1"
                                    />
                                    <span className="text-white font-mono text-sm w-16 text-right">{settings.sessionsBeforeLongBreak}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/70 text-sm">Auto-start breaks</span>
                                    <button
                                        onClick={() => updateSetting('autoStartBreaks', !settings.autoStartBreaks)}
                                        className={`w-12 h-7 rounded-full p-1 transition-all duration-300 ${settings.autoStartBreaks ? 'bg-indigo-500' : 'bg-white/10'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${settings.autoStartBreaks ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-white/70 text-sm">Auto-start focus</span>
                                    <button
                                        onClick={() => updateSetting('autoStartFocus', !settings.autoStartFocus)}
                                        className={`w-12 h-7 rounded-full p-1 transition-all duration-300 ${settings.autoStartFocus ? 'bg-indigo-500' : 'bg-white/10'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${settings.autoStartFocus ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default PomodoroWidget;