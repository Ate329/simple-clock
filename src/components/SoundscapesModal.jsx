import { useState } from 'react';
import { X, Volume2, Volume1, Power, Music } from 'lucide-react';

const SoundscapesModal = ({ isOpen, onClose, soundscapes, settings }) => {
    const { activeSounds, toggleSound, setVolume, stopAll, soundData, masterVolume, setMasterVolume } = soundscapes;
    const [activeCategory, setActiveCategory] = useState(Object.keys(soundData)[0]);

    if (!isOpen) return null;

    const categories = Object.keys(soundData);

    const formatName = (name) => {
        return name.replace(/\.(mp3|wav)$/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    const isCategoryActive = (cat) => {
        return Object.keys(activeSounds).some(key => key.startsWith(`${cat}/`));
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 sm:bg-black/80 backdrop-blur-md transition-all duration-300 p-0 sm:p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full h-[100dvh] sm:h-[85vh] sm:max-w-4xl sm:rounded-3xl shadow-2xl flex flex-col sm:flex-row overflow-hidden bg-[#0a0a0a] sm:bg-black/40 border-0 sm:border border-white/10"
                onClick={(e) => e.stopPropagation()}
                style={{
                    backdropFilter: settings?.glassmorphismIntensity > 0 ? `blur(${settings.glassmorphismIntensity}px)` : 'none',
                    WebkitBackdropFilter: settings?.glassmorphismIntensity > 0 ? `blur(${settings.glassmorphismIntensity}px)` : 'none',
                }}
            >
                {/* Mobile Header */}
                <div className="sm:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40 flex-shrink-0">
                    <h2 className="text-lg font-medium text-white flex items-center gap-2">
                        <Music className="w-5 h-5 text-indigo-400 translate-y-[1px]" />
                        Soundscapes
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 opacity-50 text-white hover:opacity-100 transition-all rounded-full active:bg-white/10"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Mobile Category Navigation */}
                <div className="sm:hidden flex border-b border-white/10 bg-black/40 flex-shrink-0 overflow-x-auto no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`relative flex-none px-4 py-3 text-sm font-medium transition-all whitespace-nowrap ${activeCategory === cat
                                ? 'text-white border-b-2 border-indigo-500 bg-white/5'
                                : 'opacity-40 text-white'
                                }`}
                        >
                            {isCategoryActive(cat) && (
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
                            )}
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Desktop Sidebar Navigation */}
                <div className="hidden sm:flex w-64 bg-black/20 border-r border-white/10 flex-col flex-shrink-0">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <h2 className="text-xl font-light tracking-wide text-white flex items-center gap-2">
                            <Music className="w-5 h-5 text-indigo-400 translate-y-[1px]" />
                            Soundscapes
                        </h2>
                    </div>
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${activeCategory === cat
                                    ? 'bg-white/10 text-white'
                                    : 'opacity-50 text-white hover:opacity-100 hover:bg-white/5'
                                    }`}
                            >
                                <span className="font-light capitalize truncate flex-1 text-left">{cat}</span>
                                <div className="flex items-center gap-2">
                                    {isCategoryActive(cat) && (
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                                    )}
                                    {soundData[cat].length > 0 && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === cat ? 'bg-white/20 text-white' : 'bg-white/5 text-white/30'}`}>
                                            {soundData[cat].length}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-white/10 space-y-4">
                        {/* Desktop Master Volume */}
                        <div className="space-y-2 px-1">
                            <div className="flex items-center justify-between text-xs text-white/50 uppercase tracking-wider font-medium">
                                <span>Master Volume</span>
                                <span>{Math.round(masterVolume * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={masterVolume}
                                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110"
                                style={{
                                    background: `linear-gradient(to right, #6366f1 ${masterVolume * 100}%, rgba(255, 255, 255, 0.1) ${masterVolume * 100}%)`
                                }}
                            />
                        </div>

                        <button
                            onClick={stopAll}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm opacity-40 text-white hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all font-light"
                        >
                            <Power className="w-5 h-5" />
                            <span>Stop All Sounds</span>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-black/20">
                    {/* Desktop Header */}
                    <div className="hidden sm:flex justify-between items-center p-6 border-b border-white/10 flex-shrink-0">
                        <h3 className="text-xl font-light text-white capitalize">
                            {activeCategory}
                        </h3>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-white/30 text-right">
                                Sounds from <a href="https://github.com/remvze/moodist" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">Moodist</a>
                                <span className="hidden lg:inline"> (<a href="https://pixabay.com/service/license/" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">Pixabay</a> & <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">CC0</a>)</span>
                            </span>
                            <button
                                onClick={onClose}
                                className="p-2 opacity-40 text-white hover:opacity-100 transition-all rounded-full hover:bg-white/10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Sound Grid */}
                    <div
                        className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6"
                        style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {soundData[activeCategory]?.map(filename => {
                                const id = `${activeCategory}/${filename}`;
                                const isActive = !!activeSounds[id];
                                const volume = activeSounds[id]?.volume ?? 0.5;

                                return (
                                    <div
                                        key={filename}
                                        className={`group relative p-4 rounded-xl transition-all duration-300 border ${isActive
                                            ? 'bg-white/10 border-indigo-500/50'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-medium text-sm text-white/90 truncate pr-2">
                                                {formatName(filename)}
                                            </span>
                                            <button
                                                onClick={() => toggleSound(activeCategory, filename)}
                                                className={`p-2 rounded-full transition-all ${isActive
                                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                                    : 'bg-white/10 opacity-50 text-white hover:opacity-100'
                                                    }`}
                                            >
                                                {isActive ? <Volume2 className="w-4 h-4" /> : <Volume1 className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        {/* Volume Slider */}
                                        <div className={`transition-all duration-300 overflow-hidden ${isActive ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="py-3 flex items-center gap-3 px-1">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.01"
                                                    value={volume}
                                                    onChange={(e) => setVolume(activeCategory, filename, parseFloat(e.target.value))}
                                                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110"
                                                    style={{
                                                        background: `linear-gradient(to right, #6366f1 ${volume * 100}%, rgba(255, 255, 255, 0.1) ${volume * 100}%)`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Mobile Attribution & Stop All */}
                        <div className="sm:hidden mt-8 pb-20 space-y-4">
                            {/* Mobile Master Volume */}
                            <div className="bg-white/5 rounded-xl p-4 space-y-2">
                                <div className="flex items-center justify-between text-xs text-white/50 uppercase tracking-wider font-medium">
                                    <span>Master Volume</span>
                                    <span>{Math.round(masterVolume * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={masterVolume}
                                    onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110"
                                    style={{
                                        background: `linear-gradient(to right, #6366f1 ${masterVolume * 100}%, rgba(255, 255, 255, 0.1) ${masterVolume * 100}%)`
                                    }}
                                />
                            </div>

                            <button
                                onClick={stopAll}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium opacity-50 text-white hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all bg-white/5"
                            >
                                <Power className="w-4 h-4" />
                                <span>Stop All Sounds</span>
                            </button>
                            <div className="text-xs text-white/30 text-center space-y-1">
                                <p>Sounds provided by Moodist</p>
                                <p>
                                    Assets under <a href="https://pixabay.com/service/license/" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">Pixabay License</a> & <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">CC0</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoundscapesModal;
