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
    SlidersHorizontal
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

    const displaySettings = [
        { label: '24-Hour', icon: ClockIcon, key: 'format24h' },
        { label: 'Seconds', icon: Timer, key: 'showSeconds' },
        { label: 'Date', icon: Calendar, key: 'showDate' },
        { label: 'Greeting', icon: Sparkles, key: 'showGreeting' },
        { label: 'Celsius', icon: Thermometer, key: 'useCelsius' },
        { label: 'Forecast', icon: CalendarDays, key: 'showForecast' },
        { label: 'Quote', icon: Quote, key: 'showQuote' },
        { label: 'Pomodoro', icon: Timer, key: 'showPomodoro' },
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
        };
        Object.entries(defaultSettings).forEach(([key, value]) => {
            updateSettings(key, value);
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 sm:bg-black/80 backdrop-blur-sm sm:backdrop-blur-md transition-all duration-300 p-0 sm:p-4"
            onClick={onClose}
        >
            <div
                className="glass-panel w-full h-full sm:h-[85vh] sm:max-w-2xl sm:rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col sm:flex-row overflow-hidden transform transition-all scale-100 border-0 sm:border border-white/10"
                onClick={(e) => e.stopPropagation()}
                style={{
                    backdropFilter: `blur(${settings.glassmorphismIntensity}px)`,
                    WebkitBackdropFilter: `blur(${settings.glassmorphismIntensity}px)`,
                }}
            >
                {/* Mobile Header with Tabs */}
                <div className="sm:hidden flex items-center justify-between p-3 border-b border-white/10 bg-black/20">
                    <h2 className="text-base font-light tracking-wide text-white">Settings</h2>
                    <button
                        onClick={onClose}
                        className="text-white/40 hover:text-white transition-colors p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Mobile Tab Navigation */}
                <div className="sm:hidden flex border-b border-white/10 bg-black/20">
                    <button
                        onClick={() => setActiveTab('display')}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm transition-all ${
                            activeTab === 'display'
                                ? 'bg-white/10 text-white border-b-2 border-white'
                                : 'text-white/50'
                        }`}
                    >
                        <Monitor className="w-4 h-4" />
                        <span className="font-light">Display</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('appearance')}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm transition-all ${
                            activeTab === 'appearance'
                                ? 'bg-white/10 text-white border-b-2 border-white'
                                : 'text-white/50'
                        }`}
                    >
                        <Paintbrush className="w-4 h-4" />
                        <span className="font-light">Appearance</span>
                    </button>
                </div>

                {/* Desktop Sidebar Navigation */}
                <div className="hidden sm:flex w-48 sm:w-56 bg-black/20 border-r border-white/10 flex-col flex-shrink-0">
                    <div className="p-4 sm:p-6 border-b border-white/10">
                        <h2 className="text-lg sm:text-xl font-light tracking-wide text-white">Settings</h2>
                    </div>
                    <nav className="flex-1 p-3 sm:p-4 space-y-1">
                        <button
                            onClick={() => setActiveTab('display')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                                activeTab === 'display'
                                    ? 'bg-white/10 text-white'
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="font-light">Display</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('appearance')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                                activeTab === 'appearance'
                                    ? 'bg-white/10 text-white'
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Paintbrush className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="font-light">Appearance</span>
                        </button>
                    </nav>
                    <div className="p-3 sm:p-4 border-t border-white/10">
                        <button
                            onClick={handleReset}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="font-light">Reset All</span>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Desktop Header */}
                    <div className="hidden sm:flex justify-between items-center p-4 sm:p-6 border-b border-white/10">
                        <h3 className="text-lg sm:text-xl font-light text-white">
                            {activeTab === 'display' ? 'Display Settings' : 'Appearance Settings'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-white/40 hover:text-white transition-colors p-1"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
                        {activeTab === 'display' ? (
                            <>
                                {/* Toggle Settings - Mobile Grid */}
                                <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 sm:gap-3">
                                    {displaySettings.map((item) => (
                                        <div
                                            key={item.key}
                                            className="flex items-center justify-between sm:justify-between group bg-white/5 sm:bg-transparent rounded-lg p-2 sm:p-0"
                                        >
                                            <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
                                                <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                <span className="text-xs sm:text-sm font-light truncate">{item.label}</span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    updateSettings(item.key, !settings[item.key])
                                                }
                                                className={`w-9 h-5 sm:w-11 sm:h-6 rounded-full p-0.5 sm:p-1 transition-all duration-300 flex-shrink-0 ml-1 ${
                                                    settings[item.key]
                                                        ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                                                        : 'bg-white/10'
                                                }`}
                                            >
                                                <div
                                                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
                                                        settings[item.key]
                                                            ? 'translate-x-4 sm:translate-x-5'
                                                            : 'translate-x-0'
                                                    }`}
                                                ></div>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* AM/PM Style */}
                                {!settings.format24h && (
                                    <div className="space-y-2 sm:space-y-3 pt-2">
                                        <div className="flex items-center gap-2 text-white/70">
                                            <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            <span className="text-xs sm:text-sm font-light">AM/PM Style</span>
                                        </div>
                                        <div className="flex gap-2">
                                            {['subtle', 'bold'].map((style) => (
                                                <button
                                                    key={style}
                                                    onClick={() => updateSettings('ampmStyle', style)}
                                                    className={`flex-1 px-3 py-2 rounded-lg text-xs border transition-all capitalize ${
                                                        settings.ampmStyle === style
                                                            ? 'bg-white text-black border-white'
                                                            : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
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
                                    <div className="space-y-2 sm:space-y-3 pt-2">
                                        <div className="flex items-center gap-2 text-white/70">
                                            <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            <span className="text-xs sm:text-sm font-light">Date Format</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {dateFormats.map((format) => (
                                                <button
                                                    key={format.id}
                                                    onClick={() => updateSettings('dateFormat', format.id)}
                                                    className={`px-2 py-2 rounded-lg text-[10px] sm:text-xs border transition-all ${
                                                        settings.dateFormat === format.id
                                                            ? 'bg-white text-black border-white'
                                                            : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                                                    }`}
                                                >
                                                    {format.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Clock Font */}
                                <div className="space-y-2 sm:space-y-3 pt-2">
                                    <div className="flex items-center gap-2 text-white/70">
                                        <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm font-light">Clock Font</span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
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
                                                className={`px-2 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs border transition-all ${
                                                    settings.clockFont === font
                                                        ? 'bg-white text-black border-white'
                                                        : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                                                }`}
                                                style={{ fontFamily: font }}
                                            >
                                                {font.split(' ')[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Brightness */}
                                <div className="space-y-2 sm:space-y-3 pt-2">
                                    <div className="flex items-center justify-between text-white/70">
                                        <div className="flex items-center gap-2">
                                            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            <span className="text-xs sm:text-sm font-light">Brightness</span>
                                        </div>
                                        <span className="text-[10px] sm:text-xs font-mono bg-white/10 px-2 py-0.5 sm:py-1 rounded">
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
                                        className="w-full h-1 sm:h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Theme Selector */}
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex items-center gap-2 text-white/70">
                                        <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm font-light">Theme</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                                        {themes.map((theme) => (
                                            <button
                                                key={theme.id}
                                                onClick={() => updateSettings('theme', theme.id)}
                                                className={`px-1 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs border transition-all flex flex-col items-center gap-1 ${
                                                    settings.theme === theme.id
                                                        ? 'bg-white/10 border-white text-white'
                                                        : 'bg-transparent border-transparent text-white/40 hover:bg-white/5'
                                                }`}
                                            >
                                                <div
                                                    className="w-full h-4 sm:h-6 rounded"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`,
                                                    }}
                                                ></div>
                                                <span className="text-[10px]">{theme.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Background Style */}
                                <div className="space-y-2 sm:space-y-3 pt-2">
                                    <div className="flex items-center gap-2 text-white/70">
                                        <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm font-light">Background</span>
                                    </div>
                                    <div className="flex gap-1.5 sm:gap-2">
                                        {backgroundStyles.map((style) => (
                                            <button
                                                key={style.id}
                                                onClick={() => updateSettings('backgroundStyle', style.id)}
                                                className={`flex-1 px-1 sm:px-2 py-2 sm:py-2 rounded-lg text-[10px] sm:text-xs border transition-all ${
                                                    settings.backgroundStyle === style.id
                                                        ? 'bg-white/10 border-white text-white'
                                                        : 'bg-transparent border-white/10 text-white/40 hover:bg-white/5'
                                                }`}
                                            >
                                                {style.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Weather Appearance */}
                                <div className="space-y-2 sm:space-y-3 pt-2">
                                    <div className="flex items-center gap-2 text-white/70">
                                        <CloudLightning className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm font-light">Weather Style</span>
                                    </div>
                                    <div className="flex gap-1.5 sm:gap-2">
                                        {weatherAppearances.map((style) => (
                                            <button
                                                key={style.id}
                                                onClick={() => updateSettings('weatherAppearance', style.id)}
                                                className={`flex-1 px-1 sm:px-2 py-2 sm:py-2 rounded-lg text-[10px] sm:text-xs border transition-all ${
                                                    settings.weatherAppearance === style.id
                                                        ? 'bg-white/10 border-white text-white'
                                                        : 'bg-transparent border-white/10 text-white/40 hover:bg-white/5'
                                                }`}
                                            >
                                                {style.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Animation Speed */}
                                <div className="space-y-2 sm:space-y-3 pt-2">
                                    <div className="flex items-center gap-2 text-white/70">
                                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm font-light">Animation Speed</span>
                                    </div>
                                    <div className="flex gap-1.5 sm:gap-2">
                                        {animationSpeeds.map((speed) => (
                                            <button
                                                key={speed.id}
                                                onClick={() => updateSettings('animationSpeed', speed.id)}
                                                className={`flex-1 px-1 sm:px-2 py-2 sm:py-2 rounded-lg text-[10px] sm:text-xs border transition-all ${
                                                    settings.animationSpeed === speed.id
                                                        ? 'bg-white/10 border-white text-white'
                                                        : 'bg-transparent border-white/10 text-white/40 hover:bg-white/5'
                                                }`}
                                            >
                                                {speed.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Glassmorphism Intensity */}
                                <div className="space-y-2 sm:space-y-3 pt-2">
                                    <div className="flex items-center justify-between text-white/70">
                                        <div className="flex items-center gap-2">
                                            <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            <span className="text-xs sm:text-sm font-light">Panel Frosting</span>
                                        </div>
                                        <span className="text-[10px] sm:text-xs font-mono bg-white/10 px-2 py-0.5 sm:py-1 rounded">
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
                                        className="w-full h-1 sm:h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>

                                {/* Widget Shadows */}
                                <div className="flex items-center justify-between pt-2 bg-white/5 sm:bg-transparent rounded-lg p-2 sm:p-0">
                                    <div className="flex items-center gap-2 text-white/70">
                                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm font-light">Widget Shadows</span>
                                    </div>
                                    <button
                                        onClick={() =>
                                            updateSettings('widgetShadows', !settings.widgetShadows)
                                        }
                                        className={`w-9 h-5 sm:w-11 sm:h-6 rounded-full p-0.5 sm:p-1 transition-all duration-300 ${
                                            settings.widgetShadows
                                                ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                                                : 'bg-white/10'
                                        }`}
                                    >
                                        <div
                                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
                                                settings.widgetShadows ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'
                                            }`}
                                        ></div>
                                    </button>
                                </div>

                                {/* Performance Mode */}
                                <div className="space-y-2 sm:space-y-3 pt-2">
                                    <div className="flex items-center gap-2 text-white/70">
                                        <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm font-light">Performance Mode</span>
                                    </div>
                                    <div className="flex gap-1.5 sm:gap-2">
                                        {performanceModes.map((mode) => (
                                            <button
                                                key={mode.id}
                                                onClick={() => updateSettings('performanceMode', mode.id)}
                                                className={`flex-1 px-1 sm:px-2 py-2 sm:py-2 rounded-lg text-[10px] sm:text-xs border transition-all ${
                                                    settings.performanceMode === mode.id
                                                        ? 'bg-white/10 border-white text-white'
                                                        : 'bg-transparent border-white/10 text-white/40 hover:bg-white/5'
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
                        <div className="sm:hidden pt-4 pb-2">
                            <button
                                onClick={handleReset}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all border border-white/10"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span className="font-light">Reset All Settings</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
