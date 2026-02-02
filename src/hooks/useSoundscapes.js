import { useState, useRef, useEffect, useCallback } from 'react';
import soundData from '../data/sounds.json';

const PRESETS_STORAGE_KEY = 'soundscapes-presets';

export const useSoundscapes = () => {
    // UI state: just track which are active and their volume for rendering
    const [activeSounds, setActiveSounds] = useState({}); // { "category/file.mp3": { volume: 0.5 } }

    // Audio objects ref: { "category/file.mp3": Audio }
    const audioRefs = useRef({});

    const [masterVolume, setMasterVolume] = useState(1);
    const [presets, setPresets] = useState(() => {
        try {
            const stored = localStorage.getItem(PRESETS_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const toggleSound = useCallback((category, filename) => {
        const id = `${category}/${filename}`;

        if (activeSounds[id]) {
            // Stop
            const audio = audioRefs.current[id];
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
                delete audioRefs.current[id];
            }

            setActiveSounds(prev => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        } else {
            // Play
            const audio = new Audio(`/sounds/${category}/${filename}`);
            audio.loop = true;
            audio.volume = 0.5 * masterVolume; // Initial volume respects master
            audio.play().catch(e => console.error("Audio play failed", e));

            audioRefs.current[id] = audio;

            setActiveSounds(prev => ({
                ...prev,
                [id]: { volume: 0.5 }
            }));
        }
    }, [activeSounds, masterVolume]);

    const setSoundVolume = useCallback((category, filename, volume) => {
        const id = `${category}/${filename}`;
        const audio = audioRefs.current[id];
        if (audio) {
            audio.volume = Math.max(0, Math.min(1, volume * masterVolume));
        }

        setActiveSounds(prev => {
            if (!prev[id]) return prev;
            return {
                ...prev,
                [id]: { ...prev[id], volume }
            };
        });
    }, [masterVolume]);

    const changeMasterVolume = useCallback((newMasterVolume) => {
        const clamped = Math.max(0, Math.min(1, newMasterVolume));
        setMasterVolume(clamped);

        // Update all active audio instances
        Object.keys(audioRefs.current).forEach(id => {
            const audio = audioRefs.current[id];
            // Get the individual volume from state, default to 0.5 if not found (shouldn't happen)
            // leveraging the closure activeSounds might be stale, so better to pass the setter logic or use refs, 
            // but for now we need the CURRENT individual volumes.
            // Actually, we can't easily access the *latest* activeSounds here if we don't include it in dependency.
            // So we'll iterate activeSounds from the state passed to this hook? No, that causes re-renders/audio glitches if we are not careful.
            // Let's use a function updater or similar?
            // Better: activeSounds is in dependency? No good for frequent updates.
            // Optimization: Store individual volumes in audioRefs or a separate ref if needed, 
            // BUT simpler: activeSounds IS available in the component scope.
        });

    }, []);

    // Effect to sync master volume changes to audio elements
    useEffect(() => {
        Object.keys(audioRefs.current).forEach(id => {
            const audio = audioRefs.current[id];
            const individualVolume = activeSounds[id]?.volume ?? 0.5;
            audio.volume = Math.max(0, Math.min(1, individualVolume * masterVolume));
        });
    }, [masterVolume, activeSounds]);

    const stopAll = useCallback(() => {
        Object.values(audioRefs.current).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        audioRefs.current = {};
        setActiveSounds({});
    }, []);

    // Save current state as a preset
    const savePreset = useCallback((name) => {
        if (!name.trim()) return false;

        const newPreset = {
            id: Date.now().toString(),
            name: name.trim(),
            activeSounds: { ...activeSounds },
            masterVolume,
            createdAt: new Date().toISOString()
        };

        setPresets(prev => {
            const updated = [...prev, newPreset];
            localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        return true;
    }, [activeSounds, masterVolume]);

    // Load a preset and apply it
    const loadPreset = useCallback((presetId) => {
        const preset = presets.find(p => p.id === presetId);
        if (!preset) return;

        // Stop all current sounds first
        Object.values(audioRefs.current).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        audioRefs.current = {};

        // Set master volume
        setMasterVolume(preset.masterVolume);

        // Start playing all sounds from the preset
        const newActiveSounds = {};
        Object.entries(preset.activeSounds).forEach(([id, data]) => {
            const [category, filename] = id.split('/');
            const audio = new Audio(`/sounds/${category}/${filename}`);
            audio.loop = true;
            audio.volume = (data.volume ?? 0.5) * preset.masterVolume;
            audio.play().catch(e => console.error("Audio play failed", e));
            audioRefs.current[id] = audio;
            newActiveSounds[id] = { volume: data.volume ?? 0.5 };
        });

        setActiveSounds(newActiveSounds);
    }, [presets]);

    // Delete a preset
    const deletePreset = useCallback((presetId) => {
        setPresets(prev => {
            const updated = prev.filter(p => p.id !== presetId);
            localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            Object.values(audioRefs.current).forEach(audio => {
                audio.pause();
            });
        };
    }, []);

    return {
        activeSounds,
        toggleSound,
        setVolume: setSoundVolume,
        masterVolume,
        setMasterVolume: changeMasterVolume,
        stopAll,
        soundData,
        presets,
        savePreset,
        loadPreset,
        deletePreset
    };
};
