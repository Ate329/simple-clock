import { useState } from 'react';
import { X, Volume2, Volume1, Power, Music, Save, FolderOpen, Trash2, Plus, Check, Play, Edit3 } from 'lucide-react';

const SoundscapesModal = ({ isOpen, onClose, soundscapes, settings }) => {
    const {
        activeSounds, toggleSound, setVolume, stopAll, soundData,
        masterVolume, setMasterVolume,
        presets, savePreset, loadPreset, deletePreset
    } = soundscapes;

    // Virtual category 'presets' added to the list
    const [activeCategory, setActiveCategory] = useState('presets');
    const [showSaveInput, setShowSaveInput] = useState(false);
    const [presetName, setPresetName] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    if (!isOpen) return null;

    const categories = ['presets', ...Object.keys(soundData)];

    const formatName = (name) => {
        return name.replace(/\.(mp3|wav)$/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    const isCategoryActive = (cat) => {
        if (cat === 'presets') return false;
        return Object.keys(activeSounds).some(key => key.startsWith(`${cat}/`));
    };

    const handleSavePreset = () => {
        if (presetName.trim() && Object.keys(activeSounds).length > 0) {
            savePreset(presetName);
            setPresetName('');
            setShowSaveInput(false);
            setActiveCategory('presets'); // Switch to presets view to see new preset
        }
    };

    const getActiveSoundsCount = () => Object.keys(activeSounds).length;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 sm:bg-black/80 backdrop-blur-md transition-all duration-300 p-0 sm:p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full h-[100dvh] sm:h-[85vh] sm:max-w-5xl sm:rounded-3xl shadow-2xl flex flex-col sm:flex-row overflow-hidden bg-[#0a0a0a] sm:bg-black/40 border-0 sm:border border-white/10"
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
                            {cat === 'presets' ? (
                                <span className="flex items-center gap-2">
                                    <FolderOpen className="w-4 h-4" />
                                    My Presets
                                </span>
                            ) : (
                                <>
                                    {isCategoryActive(cat) && (
                                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
                                    )}
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </>
                            )}
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

                    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                        <div className="text-xs font-semibold text-white/30 px-3 py-2 uppercase tracking-wider">Collections</div>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${activeCategory === cat
                                    ? 'bg-white/10 text-white shadow-sm'
                                    : 'opacity-60 text-white hover:opacity-100 hover:bg-white/5'
                                    }`}
                            >
                                <span className="font-light capitalize truncate flex-1 text-left flex items-center gap-3">
                                    {cat === 'presets' ? <FolderOpen className="w-4 h-4" /> : null}
                                    {cat === 'presets' ? 'My Presets' : cat}
                                </span>
                                <div className="flex items-center gap-2">
                                    {isCategoryActive(cat) && (
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                                    )}
                                    {cat === 'presets' ? (
                                        presets.length > 0 && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === cat ? 'bg-white/20 text-white' : 'bg-white/5 text-white/30'}`}>
                                                {presets.length}
                                            </span>
                                        )
                                    ) : (
                                        soundData[cat]?.length > 0 && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === cat ? 'bg-white/20 text-white' : 'bg-white/5 text-white/30'}`}>
                                                {soundData[cat].length}
                                            </span>
                                        )
                                    )}
                                </div>
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-white/10 space-y-3 bg-black/20">
                        {/* Save Preset UI */}
                        {showSaveInput ? (
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
                                <div className="flex items-center gap-2 text-xs font-medium text-white/70">
                                    <Edit3 className="w-3 h-3" />
                                    <span>Name your mix</span>
                                </div>
                                <input
                                    type="text"
                                    value={presetName}
                                    onChange={(e) => setPresetName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                                    placeholder="Study Vibes..."
                                    className="w-full px-3 py-2 text-sm bg-black/50 rounded-lg border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSavePreset}
                                        disabled={!presetName.trim()}
                                        className="flex-1 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => { setShowSaveInput(false); setPresetName(''); }}
                                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowSaveInput(true)}
                                disabled={getActiveSoundsCount() === 0}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/30 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-indigo-500/20"
                            >
                                <Plus className="w-4 h-4" />
                                Save Current Mix
                            </button>
                        )}

                        {/* Master Volume */}
                        <div className="space-y-1.5 pt-2">
                            <div className="flex items-center justify-between text-[11px] text-white/40 uppercase tracking-wider font-bold">
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
                                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-115"
                                style={{
                                    background: `linear-gradient(to right, #6366f1 ${masterVolume * 100}%, rgba(255, 255, 255, 0.1) ${masterVolume * 100}%)`
                                }}
                            />
                        </div>

                        <button
                            onClick={stopAll}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm opacity-40 text-white hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all font-light"
                        >
                            <Power className="w-4 h-4" />
                            <span>Stop All Sounds</span>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-black/20">
                    {/* Desktop Header */}
                    <div className="hidden sm:flex justify-between items-center p-6 border-b border-white/10 flex-shrink-0">
                        <div className="flex flex-col">
                            <h3 className="text-xl font-light text-white capitalize flex items-center gap-2">
                                {activeCategory === 'presets' ? (
                                    <>
                                        <FolderOpen className="w-5 h-5 text-indigo-400" />
                                        My Presets
                                    </>
                                ) : activeCategory}
                            </h3>
                            {activeCategory !== 'presets' && (
                                <span className="hidden lg:inline text-xs text-white/30 mt-1">
                                    Sounds from <a href="https://github.com/remvze/moodist" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">Moodist</a>
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={onClose}
                                className="p-2 opacity-40 text-white hover:opacity-100 transition-all rounded-full hover:bg-white/10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div
                        className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6"
                        style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                        {activeCategory === 'presets' ? (
                            // PRESETS VIEW
                            presets.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                                        <FolderOpen className="w-8 h-8 text-white/40" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-white">No presets yet</p>
                                        <p className="text-sm text-white/50 max-w-xs mx-auto mt-2">
                                            Mix some sounds from the other categories and click "Save Current Mix" to create your first preset.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {presets.map(preset => (
                                        <div
                                            key={preset.id}
                                            className="group relative p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 transition-all duration-300 flex flex-col"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1 min-w-0 pr-3">
                                                    <h4 className="font-medium text-white text-lg truncate" title={preset.name}>
                                                        {preset.name}
                                                    </h4>
                                                    <div className="text-xs text-white/40 mt-1 flex items-center gap-2">
                                                        <span>{Object.keys(preset.activeSounds).length} sounds</span>
                                                        <span className="w-0.5 h-0.5 bg-white/30 rounded-full" />
                                                        <span>{Math.round(preset.masterVolume * 100)}% volume</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => loadPreset(preset.id)}
                                                    className="p-3 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20 transform group-hover:scale-105 transition-all"
                                                    title="Load Preset"
                                                >
                                                    <Play className="w-5 h-5 fill-current" />
                                                </button>
                                            </div>

                                            <div className="flex-1 flex flex-wrap content-start gap-1.5 mb-4 max-h-24 overflow-hidden">
                                                {Object.keys(preset.activeSounds).map(soundId => {
                                                    const name = soundId.split('/')[1];
                                                    return (
                                                        <span key={soundId} className="px-2 py-1 round-md bg-white/5 rounded text-[10px] text-white/60 border border-white/5 truncate max-w-[100px]">
                                                            {formatName(name)}
                                                        </span>
                                                    );
                                                })}
                                            </div>

                                            <div className="border-t border-white/5 pt-3 mt-auto flex items-center justify-between">
                                                <span className="text-[10px] text-white/20">
                                                    {new Date(preset.createdAt).toLocaleDateString()}
                                                </span>
                                                {deleteConfirm === preset.id ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deletePreset(preset.id);
                                                            setDeleteConfirm(null);
                                                        }}
                                                        className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-all"
                                                    >
                                                        <span>Confirm?</span>
                                                        <Check className="w-3 h-3" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteConfirm(preset.id);
                                                        }}
                                                        className="p-1.5 rounded opacity-40 hover:opacity-100 hover:text-red-400 hover:bg-white/5 transition-all text-white"
                                                        title="Delete Preset"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            // SOUND GRID VIEW
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
                                                <span className={`font-medium text-sm transition-colors duration-300 truncate pr-2 ${isActive ? 'text-indigo-300' : 'text-white/90'}`}>
                                                    {formatName(filename)}
                                                </span>
                                                <button
                                                    onClick={() => toggleSound(activeCategory, filename)}
                                                    className={`p-2.5 rounded-full transition-all duration-300 ${isActive
                                                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-105'
                                                        : 'bg-white/10 opacity-50 text-white hover:opacity-100 hover:bg-white/20'
                                                        }`}
                                                >
                                                    {isActive ? <Volume2 className="w-4 h-4" /> : <Volume1 className="w-4 h-4" />}
                                                </button>
                                            </div>

                                            {/* Volume Slider - Animated Reveal */}
                                            <div
                                                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                                    }`}
                                            >
                                                <div className="overflow-hidden">
                                                    <div className="pb-1 pt-2 px-1">
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="1"
                                                            step="0.01"
                                                            value={volume}
                                                            onChange={(e) => setVolume(activeCategory, filename, parseFloat(e.target.value))}
                                                            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                                                            style={{
                                                                background: `linear-gradient(to right, #6366f1 ${volume * 100}%, rgba(255, 255, 255, 0.1) ${volume * 100}%)`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Mobile Footer Area (Save/Stop/Volume) */}
                        <div className="sm:hidden mt-8 pb-24 space-y-4">
                            {/* Mobile Save UI */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                {showSaveInput ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-medium text-white/70">
                                            <Edit3 className="w-3 h-3" />
                                            <span>Name your mix</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={presetName}
                                            onChange={(e) => setPresetName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                                            placeholder="My Relaxing Mix..."
                                            className="w-full px-4 py-3 text-sm bg-black/50 rounded-xl border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                                            autoFocus
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSavePreset}
                                                disabled={!presetName.trim()}
                                                className="flex-1 py-3 rounded-xl bg-indigo-500 text-white text-sm font-medium"
                                            >
                                                Save Preset
                                            </button>
                                            <button
                                                onClick={() => { setShowSaveInput(false); setPresetName(''); }}
                                                className="px-4 py-3 rounded-xl bg-white/10 text-white text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowSaveInput(true)}
                                        disabled={getActiveSoundsCount() === 0}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all border border-white/5 disabled:opacity-30"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Save Current Mix as Preset
                                    </button>
                                )}
                            </div>

                            {/* Mobile Master Volume */}
                            <div className="bg-white/5 rounded-xl p-4 space-y-3 border border-white/5">
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
                                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                                    style={{
                                        background: `linear-gradient(to right, #6366f1 ${masterVolume * 100}%, rgba(255, 255, 255, 0.1) ${masterVolume * 100}%)`
                                    }}
                                />
                            </div>

                            <button
                                onClick={stopAll}
                                className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl text-sm font-medium opacity-60 text-white hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all bg-white/5 border border-white/5"
                            >
                                <Power className="w-5 h-5" />
                                <span>Stop All Sounds</span>
                            </button>

                            <div className="text-xs text-center space-y-1 text-white/20 pt-4">
                                <p>Sounds provided by Moodist</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoundscapesModal;
