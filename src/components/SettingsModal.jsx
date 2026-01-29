import { X, Clock as ClockIcon, Thermometer, CloudLightning, CalendarDays, EyeOff, Timer, Quote, Type, Palette, Sun } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, settings, updateSettings }) => {
    if (!isOpen) return null;

    const themes = [
        { id: 'aurora', name: 'Aurora', colors: ['#0f0c29', '#302b63', '#24243e'] },
        { id: 'cyberpunk', name: 'Cyberpunk', colors: ['#f40076', '#df98fa', '#9055ff'] },
        { id: 'sunset', name: 'Sunset', colors: ['#1e3c72', '#2a5298', '#ff7e5f'] },
        { id: 'ocean', name: 'Ocean', colors: ['#000046', '#1cb5e0', '#000046'] },
        { id: 'midnight', name: 'Midnight', colors: ['#232526', '#414345', '#232526'] },
    ];

    const settingsItems = [
        { label: '24-Hour Clock', icon: ClockIcon, key: 'format24h' },
        { label: 'Use Celsius', icon: Thermometer, key: 'useCelsius' },
        { label: 'Detailed Weather', icon: CloudLightning, key: 'detailedWeather' },
        { label: 'Show Forecast', icon: CalendarDays, key: 'showForecast' },
        { label: 'Focus Mode', icon: EyeOff, key: 'focusMode' },
        { label: 'Pomodoro Timer', icon: Timer, key: 'showPomodoro' },
        { label: 'Show Quote', icon: Quote, key: 'showQuote' }
    ];

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300" onClick={onClose}>
            <div
                className="glass-panel w-full max-w-md p-8 rounded-3xl shadow-2xl m-4 space-y-8 transform transition-all scale-100 border border-white/10 max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b border-white/10 pb-6">
                    <h2 className="text-2xl font-light tracking-wide text-white">Display Settings</h2>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-8">
                    {settingsItems.map(item => {
                        const IconComponent = item.icon;
                        return (
                            <div key={item.key} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4 text-white/70 group-hover:text-white transition-colors">
                                    <IconComponent className="w-5 h-5" />
                                    <span className="text-lg font-light">{item.label}</span>
                                </div>
                                <button
                                    onClick={() => updateSettings(item.key, !settings[item.key])}
                                    className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${settings[item.key] ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/10'}`}
                                >
                                    <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${settings[item.key] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        );
                    })}

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between text-white/70">
                            <div className="flex items-center gap-4">
                                <Type className="w-5 h-5" />
                                <span className="text-lg font-light">Clock Font</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {['JetBrains Mono', 'Roboto Mono', 'Space Mono'].map(font => (
                                <button
                                    key={font}
                                    onClick={() => updateSettings('clockFont', font)}
                                    className={`px-3 py-2 rounded-lg text-xs border transition-all ${settings.clockFont === font ? 'bg-white text-black border-white' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
                                    style={{ fontFamily: font }}
                                >
                                    {font.split(' ')[0]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between text-white/70">
                            <div className="flex items-center gap-4">
                                <Palette className="w-5 h-5" />
                                <span className="text-lg font-light">Theme</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {themes.map(theme => (
                                <button
                                    key={theme.id}
                                    onClick={() => updateSettings('theme', theme.id)}
                                    className={`px-2 py-2 rounded-lg text-xs border transition-all flex flex-col items-center gap-1 ${settings.theme === theme.id ? 'bg-white/10 border-white text-white' : 'bg-transparent border-transparent text-white/40 hover:bg-white/5'}`}
                                >
                                    <div className="w-full h-8 rounded bg-gradient-to-r from-transparent to-transparent"
                                        style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }}></div>
                                    <span>{theme.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between text-white/70">
                            <div className="flex items-center gap-4">
                                <Sun className="w-5 h-5" />
                                <span className="text-lg font-light">Brightness</span>
                            </div>
                            <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded">{settings.brightness}%</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={settings.brightness}
                            onChange={(e) => updateSettings('brightness', parseInt(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
