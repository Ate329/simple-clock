import { useState } from 'react';
import {
    X,
    Clock as ClockIcon,
    Thermometer,
    CloudLightning,
    CalendarDays,
    EyeOff,
    Timer,
    Quote,
    Type,
    Palette,
    Sun,
    Zap,
    Monitor,
    Paintbrush,
    RotateCcw,
    Eye,
    Calendar,
    Sparkles,
    Wind,
    SlidersHorizontal,
} from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, settings, updateSettings }) => {
    const [activeTab, setActiveTab] = useState('display');

    if (!isOpen) return null;

    const themes = [
        { id: 'aurora', name: 'Aurora', colors: ['#0f0c29', '#302b63', '#24243e'] },
        { id: 'cyberpunk', name: 'Cyberpunk', colors: ['#f40076', '#df98fa', '#9055ff'] },
        { id: 'sunset', name: 'Sunset', colors: ['#1e3c72', '#2a5298', '#ff7e5f'] },
        { id: 'ocean', name: 'Ocean', colors: ['#000046', '#1cb5e0', '#000046'] },
        { id: 'midnight', name: 'Midnight', colors: ['#232526', '#414345', '#232526'] },
        { id: 'forest', name: 'Forest', colors: ['#134e5e', '#71b280', '#134e5e'] },
    ];

    const dateFormats = [
        { id: 'short', label: 'Jan 29' },
        { id: 'weekday', label: 'Mon, Jan 29' },
        { id: 'long', label: 'January 29' },
        { id: 'numeric', label: '01/29/2026' },
    ];

    const weatherAppearances = [
        { id: 'minimal', label: 'Minimal' },
        { id: 'compact', label: 'Compact' },
        { id: 'detailed', label: 'Detailed' },
    ];

    const animationSpeeds = [
        { id: 'slow', label: 'Slow' },
        { id: 'normal', label: 'Normal' },
        { id: 'fast', label: 'Fast' },
    ];

    const backgroundStyles = [
        { id: 'transparent', label: 'Transparent' },
        { id: 'gradient', label: 'Gradient' },
        { id: 'solid', label: 'Solid' },
    ];

    const performanceModes = [
        { id: 'minimal', label: 'Minimal' },
        { id: 'reduced', label: 'Reduced' },
        { id: 'full', label: 'Full' },
    ];

    const animationStyles = [
        { id: 'classic', label: 'Classic Aurora', desc: 'Smooth flowing' },
        { id: 'wave', label: 'Wave Flow', desc: 'Gentle waves' },
        { id: 'pulse', label: 'Pulse & Breathe', desc: 'Rhythmic breathing' },
        { id: 'drift', label: 'Cosmic Drift', desc: 'Slow drifting' },
        { id: 'lights', label: 'Northern Lights', desc: 'Vertical flowing' },
        { id: 'static', label: 'Static', desc: 'No animation' },
    ];

    const displaySettings = [
        { label: '24-Hour Clock', icon: ClockIcon, key: 'format24h' },
        { label: 'Show Seconds', icon: Timer, key: 'showSeconds' },
        { label: 'Show Date', icon: Calendar, key: 'showDate' },
        { label: 'Show Greeting', icon: Sparkles, key: 'showGreeting' },
        { label: 'Use Celsius', icon: Thermometer, key: 'useCelsius' },
        { label: 'Show Forecast', icon: CalendarDays, key: 'showForecast' },
        { label: 'Show Quote', icon: Quote, key: 'showQuote' },
        { label: 'Pomodoro Timer', icon: Timer, key: 'showPomodoro' },
        { label: 'Focus Mode', icon: EyeOff, key: 'focusMode' },
    ];

    const handleReset = () => {
        const defaultSettings = {
            format24h: false,
            showSeconds: false,
            dateFormat: 'weekday',
            showDate: true,
            showGreeting: true,
            ampmStyle: 'subtle',
            useCelsius: true,
            detailedWeather: false,
            showForecast: false,
            brightness: 100,
            focusMode: false,
            showQuote: true,
            clockFont: 'JetBrains Mono',
            showPomodoro: true,
            theme: 'aurora',
            performanceMode: 'full',
            weatherAppearance: 'compact',
            animationSpeed: 'normal',
            glassmorphismIntensity: 16,
            widgetShadows: true,
            backgroundStyle: 'gradient',
            animationStyle: 'classic',
        };
        Object.entries(defaultSettings).forEach(([key, value]) => {
            updateSettings(key, value);
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 sm:bg-black/80 backdrop-blur-md transition-all duration-300 p-0 sm:p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full h-[100dvh] sm:h-[85vh] sm:max-w-2xl sm:rounded-3xl shadow-2xl flex flex-col sm:flex-row overflow-hidden bg-[#0a0a0a] sm:bg-black/40 border-0 sm:border border-white/10"
                onClick={(e) => e.stopPropagation()}
                style={{
                    backdropFilter: settings.glassmorphismIntensity > 0 ? `blur(${settings.glassmorphismIntensity}px)` : 'none',
                    WebkitBackdropFilter: settings.glassmorphismIntensity > 0 ? `blur(${settings.glassmorphismIntensity}px)` : 'none',
                }}
            >
                {/* Mobile Header */}
                <div className="sm:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40 flex-shrink-0">
                    <h2 className="text-lg font-medium text-white">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 opacity-50 text-white hover:opacity-100 transition-colors rounded-full active:bg-white/10"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Mobile Tab Navigation */}
                <div className="sm:hidden flex border-b border-white/10 bg-black/40 flex-shrink-0">
                    <button
                        onClick={() => setActiveTab('display')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-all ${activeTab === 'display'
                            ? 'text-white border-b-2 border-indigo-500 bg-white/5'
                            : 'opacity-40 text-white'
                            }`}
                    >
                        <Monitor className="w-5 h-5" />
                        <span>Display</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('appearance')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-all ${activeTab === 'appearance'
                            ? 'text-white border-b-2 border-indigo-500 bg-white/5'
                            : 'opacity-40 text-white'
                            }`}
                    >
                        <Paintbrush className="w-5 h-5" />
                        <span>Appearance</span>
                    </button>
                </div>

                {/* Desktop Sidebar Navigation */}
                <div className="hidden sm:flex w-56 bg-black/20 border-r border-white/10 flex-col flex-shrink-0">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-xl font-light tracking-wide text-white">Settings</h2>
                    </div>
                    <nav className="flex-1 p-4 space-y-2">
                        <button
                            onClick={() => setActiveTab('display')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'display'
                                ? 'bg-white/10 text-white'
                                : 'opacity-50 text-white hover:opacity-100 hover:bg-white/5'
                                }`}
                        >
                            <Monitor className="w-5 h-5" />
                            <span className="font-light">Display</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('appearance')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'appearance'
                                ? 'bg-white/10 text-white'
                                : 'opacity-50 text-white hover:opacity-100 hover:bg-white/5'
                                }`}
                        >
                            <Paintbrush className="w-5 h-5" />
                            <span className="font-light">Appearance</span>
                        </button>
                    </nav>
                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={handleReset}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm opacity-40 text-white hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <RotateCcw className="w-5 h-5" />
                            <span className="font-light">Reset All</span>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-black/20">
                    {/* Desktop Header */}
                    <div className="hidden sm:flex justify-between items-center p-6 border-b border-white/10 flex-shrink-0">
                        <h3 className="text-xl font-light text-white">
                            {activeTab === 'display' ? 'Display Settings' : 'Appearance Settings'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 opacity-40 text-white hover:opacity-100 transition-colors rounded-full hover:bg-white/10"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div
                        className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-6 pb-20 sm:pb-6"
                        style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                        {activeTab === 'display' ? (
                            <>
                                {/* Toggle Settings */}
                                <div className="space-y-1">
                                    {displaySettings.map((item) => (
                                        <div
                                            key={item.key}
                                            className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-0"
                                        >
                                            <div className="flex items-center gap-3 opacity-80 text-white">
                                                <item.icon className="w-5 h-5 opacity-50 text-white" />
                                                <span className="text-base font-normal">{item.label}</span>
                                            </div>
                                            <button
                                                onClick={() => updateSettings(item.key, !settings[item.key])}
                                                className={`w-12 h-7 rounded-full p-1 transition-all duration-300 ${settings[item.key]
                                                    ? 'bg-indigo-500'
                                                    : 'bg-white/20'
                                                    }`}
                                            >
                                                <div
                                                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings[item.key] ? 'translate-x-5' : 'translate-x-0'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* AM/PM Style */}
                                {!settings.format24h && (
                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center gap-2 opacity-60 text-white text-sm">
                                            <ClockIcon className="w-4 h-4" />
                                            <span>AM/PM Style</span>
                                        </div>
                                        <div className="flex gap-3">
                                            {['subtle', 'bold'].map((style) => (
                                                <button
                                                    key={style}
                                                    onClick={() => updateSettings('ampmStyle', style)}
                                                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all capitalize ${settings.ampmStyle === style
                                                        ? 'bg-white text-black'
                                                        : 'bg-white/10 text-white/70'
                                                        }`}
                                                >
                                                    {style}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Date Format */}
                                {settings.showDate && (
                                    <div className="space-y-3 pt-4">
                                        <div className="flex items-center gap-2 opacity-60 text-white text-sm">
                                            <CalendarDays className="w-4 h-4" />
                                            <span>Date Format</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {dateFormats.map((format) => (
                                                <button
                                                    key={format.id}
                                                    onClick={() => updateSettings('dateFormat', format.id)}
                                                    className={`px-3 py-3 rounded-xl text-sm font-medium transition-all ${settings.dateFormat === format.id
                                                        ? 'bg-white text-black'
                                                        : 'bg-white/10 text-white/70'
                                                        }`}
                                                >
                                                    {format.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Clock Font */}
                                <div className="space-y-3 pt-4">
                                    <div className="flex items-center gap-2 opacity-60 text-white text-sm">
                                        <Type className="w-4 h-4" />
                                        <span>Clock Font</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            'JetBrains Mono',
                                            'Roboto Mono',
                                            'Space Mono',
                                            'Fira Code',
                                            'Source Code Pro',
                                            'IBM Plex Mono',
                                        ].map((font) => (
                                            <button
                                                key={font}
                                                onClick={() => updateSettings('clockFont', font)}
                                                className={`px-3 py-3 rounded-xl text-sm font-medium transition-all ${settings.clockFont === font
                                                    ? 'bg-white text-black'
                                                    : 'bg-white/10 text-white/70'
                                                    }`}
                                                style={{ fontFamily: font }}
                                            >
                                                {font.split(' ')[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Brightness */}
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center justify-between opacity-60 text-white text-sm">
                                        <div className="flex items-center gap-2">
                                            <Sun className="w-4 h-4" />
                                            <span>Brightness</span>
                                        </div>
                                        <span className="text-sm font-mono bg-white/10 px-3 py-1 rounded-lg">
                                            {settings.brightness}%
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={settings.brightness}
                                        onChange={(e) =>
                                            updateSettings('brightness', parseInt(e.target.value))
                                        }
                                        className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Theme Selector */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 opacity-60 text-white text-sm">
                                        <Palette className="w-4 h-4" />
                                        <span>Theme</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {themes.map((theme) => (
                                            <button
                                                key={theme.id}
                                                onClick={() => updateSettings('theme', theme.id)}
                                                className={`p-3 rounded-xl transition-all flex flex-col items-center gap-2 ${settings.theme === theme.id
                                                    ? 'bg-white/20 ring-2 ring-white/50'
                                                    : 'bg-white/5'
                                                    }`}
                                            >
                                                <div
                                                    className="w-full h-10 rounded-lg"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`,
                                                    }}
                                                />
                                                <span className="text-xs font-medium text-white/80">{theme.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Background Style */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-2 opacity-60 text-white text-sm">
                                        <Wind className="w-4 h-4" />
                                        <span>Background</span>
                                    </div>
                                    <div className="flex gap-3">
                                        {backgroundStyles.map((style) => (
                                            <button
                                                key={style.id}
                                                onClick={() => updateSettings('backgroundStyle', style.id)}
                                                className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${settings.backgroundStyle === style.id
                                                    ? 'bg-white text-black'
                                                    : 'bg-white/10 text-white/70'
                                                    }`}
                                            >
                                                {style.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Animation Style */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-2 opacity-60 text-white text-sm">
                                        <Sparkles className="w-4 h-4" />
                                        <span>Animation Style</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {animationStyles.map((style) => (
                                            <button
                                                key={style.id}
                                                onClick={() => updateSettings('animationStyle', style.id)}
                                                className={`px-3 py-3 rounded-xl text-sm font-medium transition-all text-left ${settings.animationStyle === style.id
                                                    ? 'bg-white text-black'
                                                    : 'bg-white/10 text-white/70'
                                                    }`}
                                            >
                                                <div className="font-medium">{style.label}</div>
                                                <div className={`text-xs mt-0.5 ${settings.animationStyle === style.id ? 'text-black/60' : 'text-white/50'}`}>
                                                    {style.desc}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Weather Appearance */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-2 opacity-60 text-white text-sm">
                                        <CloudLightning className="w-4 h-4" />
                                        <span>Weather Style</span>
                                    </div>
                                    <div className="flex gap-3">
                                        {weatherAppearances.map((style) => (
                                            <button
                                                key={style.id}
                                                onClick={() => updateSettings('weatherAppearance', style.id)}
                                                className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${settings.weatherAppearance === style.id
                                                    ? 'bg-white text-black'
                                                    : 'bg-white/10 text-white/70'
                                                    }`}
                                            >
                                                {style.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Animation Speed */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-2 opacity-60 text-white text-sm">
                                        <Zap className="w-4 h-4" />
                                        <span>Animation Speed</span>
                                    </div>
                                    <div className="flex gap-3">
                                        {animationSpeeds.map((speed) => (
                                            <button
                                                key={speed.id}
                                                onClick={() => updateSettings('animationSpeed', speed.id)}
                                                className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${settings.animationSpeed === speed.id
                                                    ? 'bg-white text-black'
                                                    : 'bg-white/10 text-white/70'
                                                    }`}
                                            >
                                                {speed.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Glassmorphism Intensity */}
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center justify-between opacity-60 text-white text-sm">
                                        <div className="flex items-center gap-2">
                                            <SlidersHorizontal className="w-4 h-4" />
                                            <span>Panel Frosting</span>
                                        </div>
                                        <span className="text-sm font-mono bg-white/10 px-3 py-1 rounded-lg">
                                            {settings.glassmorphismIntensity}px
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="32"
                                        step="2"
                                        value={settings.glassmorphismIntensity}
                                        onChange={(e) =>
                                            updateSettings(
                                                'glassmorphismIntensity',
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                                    />
                                </div>

                                {/* Widget Shadows */}
                                <div className="flex items-center justify-between py-4 border-b border-white/5">
                                    <div className="flex items-center gap-3 opacity-80 text-white">
                                        <Eye className="w-5 h-5 opacity-50 text-white" />
                                        <span className="text-base">Widget Shadows</span>
                                    </div>
                                    <button
                                        onClick={() => updateSettings('widgetShadows', !settings.widgetShadows)}
                                        className={`w-12 h-7 rounded-full p-1 transition-all duration-300 ${settings.widgetShadows
                                            ? 'bg-indigo-500'
                                            : 'bg-white/20'
                                            }`}
                                    >
                                        <div
                                            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.widgetShadows ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Performance Mode */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-2 opacity-60 text-white text-sm">
                                        <Zap className="w-4 h-4" />
                                        <span>Performance Mode</span>
                                    </div>
                                    <div className="flex gap-3">
                                        {performanceModes.map((mode) => (
                                            <button
                                                key={mode.id}
                                                onClick={() => updateSettings('performanceMode', mode.id)}
                                                className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${settings.performanceMode === mode.id
                                                    ? 'bg-white text-black'
                                                    : 'bg-white/10 text-white/70'
                                                    }`}
                                            >
                                                {mode.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Mobile Reset Button */}
                        <div className="sm:hidden pt-6 pb-8">
                            <button
                                onClick={handleReset}
                                className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl text-base font-medium opacity-50 text-white hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all bg-white/5"
                            >
                                <RotateCcw className="w-5 h-5" />
                                <span>Reset All Settings</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
