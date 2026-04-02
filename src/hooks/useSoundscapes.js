import { useState, useRef, useEffect, useCallback } from 'react';
import { soundData, getTrack, getTrackById } from '../data/soundRegistry';

const PRESETS_STORAGE_KEY = 'soundscapes-presets';
const PLAYER_START_OFFSET_SECONDS = 0.03;
const START_FADE_SECONDS = 0.18;
const VOLUME_RAMP_SECONDS = 0.12;
const STOP_FADE_SECONDS = 0.16;
const SCHEDULER_LOOKAHEAD_MS = 180;
const SCHEDULE_AHEAD_SECONDS = 1.2;
const MIN_CROSSFADE_SECONDS = 0.08;
const MAX_FALLBACK_CROSSFADE_SECONDS = 0.45;
const MAX_AUTHORED_CROSSFADE_SECONDS = 1.2;
const MIN_LOOP_WINDOW_SECONDS = 0.05;
const FADE_CURVE_STEPS = 128;
const MASTER_HEADROOM_GAIN = 0.92;

const clampVolume = (value) => Math.max(0, Math.min(1, value));
const dbToGain = (db) => Math.pow(10, db / 20);

const createEqualPowerCurve = (invert = false) => {
    const curve = new Float32Array(FADE_CURVE_STEPS);

    for (let index = 0; index < FADE_CURVE_STEPS; index += 1) {
        const progress = index / (FADE_CURVE_STEPS - 1);
        const value = invert
            ? Math.cos((progress * Math.PI) / 2)
            : Math.sin((progress * Math.PI) / 2);

        curve[index] = value;
    }

    return curve;
};

const FADE_IN_CURVE = createEqualPowerCurve(false);
const FADE_OUT_CURVE = createEqualPowerCurve(true);

const getFallbackCrossfadeDuration = (loopDuration) => {
    if (!Number.isFinite(loopDuration) || loopDuration <= 0) {
        return MIN_CROSSFADE_SECONDS;
    }

    return Math.min(
        MAX_FALLBACK_CROSSFADE_SECONDS,
        Math.max(MIN_CROSSFADE_SECONDS, loopDuration * 0.02)
    );
};

const resolvePlaybackConfig = (track, buffer) => {
    const duration = buffer.duration;
    const maxStart = Math.max(duration - MIN_LOOP_WINDOW_SECONDS, 0);
    const loopStart = Math.min(Math.max(track.loop.start ?? 0, 0), maxStart);
    const requestedEnd = Number.isFinite(track.loop.end) ? track.loop.end : duration;
    const loopEnd = Math.min(
        duration,
        Math.max(loopStart + MIN_LOOP_WINDOW_SECONDS, requestedEnd)
    );
    const loopDuration = Math.max(loopEnd - loopStart, MIN_LOOP_WINDOW_SECONDS);

    const requestedCrossfade = Number.isFinite(track.loop.crossfadeMs)
        ? track.loop.crossfadeMs / 1000
        : getFallbackCrossfadeDuration(loopDuration);
    const requestedMaxCrossfade = Number.isFinite(track.loop.crossfadeMs)
        ? MAX_AUTHORED_CROSSFADE_SECONDS
        : MAX_FALLBACK_CROSSFADE_SECONDS;
    const maxCrossfade = Math.max(
        Math.min(loopDuration / 2 - 0.01, requestedMaxCrossfade),
        0
    );
    const crossfadeDuration = Math.min(
        Math.max(requestedCrossfade, 0),
        maxCrossfade
    );

    return {
        mode: track.loop.mode === 'native' ? 'native' : 'crossfade',
        loopStart,
        loopEnd,
        loopDuration,
        crossfadeDuration
    };
};

const buildTrackGain = (track, volume) => {
    const cappedVolume = clampVolume(Math.min(volume, track.maxVolume ?? 1));
    return cappedVolume * dbToGain(track.gainDb ?? 0);
};

export const useSoundscapes = () => {
    const [activeSounds, setActiveSounds] = useState({});
    const activeSoundsRef = useRef(activeSounds);
    const masterVolumeRef = useRef(1);

    const audioContextRef = useRef(null);
    const masterInputGainRef = useRef(null);
    const masterCompressorRef = useRef(null);
    const masterGainRef = useRef(null);
    const playersRef = useRef({});
    const bufferCacheRef = useRef({});
    const loadingBuffersRef = useRef({});
    const pendingStartTokensRef = useRef({});

    const [masterVolume, setMasterVolume] = useState(1);
    const [presets, setPresets] = useState(() => {
        try {
            const stored = localStorage.getItem(PRESETS_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });
    const [loadedPresetId, setLoadedPresetId] = useState(null);

    useEffect(() => {
        activeSoundsRef.current = activeSounds;
    }, [activeSounds]);

    useEffect(() => {
        masterVolumeRef.current = masterVolume;
    }, [masterVolume]);

    const ensureAudioContext = useCallback(async () => {
        if (typeof window === 'undefined') {
            return null;
        }

        if (!audioContextRef.current) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;

            if (!AudioContextClass) {
                throw new Error('Web Audio is not supported in this browser.');
            }

            const context = new AudioContextClass({ latencyHint: 'interactive' });
            const masterInputGain = context.createGain();
            const masterCompressor = context.createDynamicsCompressor();
            const masterGain = context.createGain();

            masterInputGain.gain.value = MASTER_HEADROOM_GAIN;
            masterCompressor.threshold.value = -22;
            masterCompressor.knee.value = 18;
            masterCompressor.ratio.value = 2.2;
            masterCompressor.attack.value = 0.01;
            masterCompressor.release.value = 0.22;
            masterGain.gain.value = masterVolumeRef.current;

            masterInputGain.connect(masterCompressor);
            masterCompressor.connect(masterGain);
            masterGain.connect(context.destination);

            audioContextRef.current = context;
            masterInputGainRef.current = masterInputGain;
            masterCompressorRef.current = masterCompressor;
            masterGainRef.current = masterGain;
        }

        if (audioContextRef.current.state !== 'running') {
            await audioContextRef.current.resume();
        }

        return audioContextRef.current;
    }, []);

    const rampGain = useCallback((audioParam, target, durationSeconds, startTime) => {
        const value = Math.max(0, target);

        audioParam.cancelScheduledValues(startTime);
        audioParam.setValueAtTime(audioParam.value, startTime);
        audioParam.linearRampToValueAtTime(value, startTime + durationSeconds);
    }, []);

    const disconnectPlayerOutput = useCallback((player) => {
        window.setTimeout(() => {
            try {
                player.outputGain.disconnect();
            } catch {
                // Ignore disconnect failures during teardown.
            }
        }, Math.ceil(STOP_FADE_SECONDS * 1000) + 40);
    }, []);

    const stopPlayer = useCallback((id) => {
        const player = playersRef.current[id];
        if (!player) {
            delete pendingStartTokensRef.current[id];
            return;
        }

        player.stopped = true;
        window.clearTimeout(player.schedulerId);

        const context = audioContextRef.current;
        const now = context?.currentTime ?? 0;

        try {
            rampGain(player.outputGain.gain, 0, STOP_FADE_SECONDS, now);
        } catch {
            // Ignore gain scheduling failures during teardown.
        }

        player.sources.forEach(({ source }) => {
            try {
                source.stop(now + STOP_FADE_SECONDS + 0.02);
            } catch {
                // Ignore stop failures for nodes that already ended.
            }
        });

        disconnectPlayerOutput(player);
        delete playersRef.current[id];
        delete pendingStartTokensRef.current[id];
    }, [disconnectPlayerOutput, rampGain]);

    const loadBuffer = useCallback(async (track) => {
        if (bufferCacheRef.current[track.id]) {
            return bufferCacheRef.current[track.id];
        }

        if (loadingBuffersRef.current[track.id]) {
            return loadingBuffersRef.current[track.id];
        }

        const loadingPromise = (async () => {
            const context = await ensureAudioContext();
            const response = await fetch(`/sounds/${track.category}/${track.file}`);

            if (!response.ok) {
                throw new Error(`Failed to load sound: ${track.id}`);
            }

            const data = await response.arrayBuffer();
            const buffer = await context.decodeAudioData(data);

            bufferCacheRef.current[track.id] = buffer;
            delete loadingBuffersRef.current[track.id];

            return buffer;
        })().catch((error) => {
            delete loadingBuffersRef.current[track.id];
            throw error;
        });

        loadingBuffersRef.current[track.id] = loadingPromise;
        return loadingPromise;
    }, [ensureAudioContext]);

    const applyOutputVolume = useCallback((outputGain, track, volume, rampSeconds = VOLUME_RAMP_SECONDS) => {
        const context = audioContextRef.current;
        if (!context || !outputGain) {
            return;
        }

        rampGain(outputGain.gain, buildTrackGain(track, volume), rampSeconds, context.currentTime);
    }, [rampGain]);

    const createSourceEntry = useCallback((player) => {
        const context = audioContextRef.current;
        const source = context.createBufferSource();
        const gainNode = context.createGain();

        source.buffer = player.buffer;
        source.connect(gainNode);
        gainNode.connect(player.outputGain);

        const entry = { source, gainNode };
        player.sources.add(entry);

        source.onended = () => {
            player.sources.delete(entry);

            try {
                source.disconnect();
                gainNode.disconnect();
            } catch {
                // Ignore disconnect failures once the node is gone.
            }
        };

        return entry;
    }, []);

    const scheduleCrossfadeSegment = useCallback((player, startTime, fadeInDuration) => {
        const context = audioContextRef.current;
        if (!context || player.stopped) {
            return;
        }

        const { source, gainNode } = createSourceEntry(player);
        const fadeOutStart = startTime + Math.max(player.loopDuration - player.crossfadeDuration, 0);
        const actualFadeInDuration = Math.min(fadeInDuration, player.loopDuration / 2);
        const actualFadeOutDuration = Math.min(player.crossfadeDuration, player.loopDuration / 2);

        if (actualFadeInDuration > 0) {
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.setValueCurveAtTime(FADE_IN_CURVE, startTime, actualFadeInDuration);
            gainNode.gain.setValueAtTime(1, startTime + actualFadeInDuration);
        } else {
            gainNode.gain.setValueAtTime(1, startTime);
        }

        if (actualFadeOutDuration > 0) {
            gainNode.gain.setValueAtTime(1, fadeOutStart);
            gainNode.gain.setValueCurveAtTime(FADE_OUT_CURVE, fadeOutStart, actualFadeOutDuration);
            gainNode.gain.setValueAtTime(0, fadeOutStart + actualFadeOutDuration);
        }

        source.start(startTime, player.loopStart, player.loopDuration);
    }, [createSourceEntry]);

    const startNativeLoop = useCallback((player, startTime) => {
        const { source, gainNode } = createSourceEntry(player);
        const attackDuration = Math.min(START_FADE_SECONDS, player.loopDuration / 4);

        source.loop = true;
        source.loopStart = player.loopStart;
        source.loopEnd = player.loopEnd;

        if (attackDuration > 0) {
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(1, startTime + attackDuration);
        } else {
            gainNode.gain.setValueAtTime(1, startTime);
        }

        source.start(startTime, player.loopStart);
    }, [createSourceEntry]);

    const schedulePlayer = useCallback(function schedulePlayer(id) {
        const player = playersRef.current[id];
        const context = audioContextRef.current;

        if (!player || !context || player.stopped) {
            return;
        }

        if (player.mode === 'native') {
            if (!player.hasStarted) {
                startNativeLoop(player, player.nextStartTime);
                player.hasStarted = true;
            }

            return;
        }

        const horizon = context.currentTime + SCHEDULE_AHEAD_SECONDS;
        const loopInterval = Math.max(player.loopDuration - player.crossfadeDuration, 0.01);

        while (player.nextStartTime <= horizon) {
            const fadeInDuration = player.hasScheduledFirstSegment ? player.crossfadeDuration : 0;

            scheduleCrossfadeSegment(player, player.nextStartTime, fadeInDuration);

            player.hasScheduledFirstSegment = true;
            player.nextStartTime += loopInterval;
        }

        player.schedulerId = window.setTimeout(() => {
            schedulePlayer(id);
        }, SCHEDULER_LOOKAHEAD_MS);
    }, [scheduleCrossfadeSegment, startNativeLoop]);

    const startSound = useCallback(async (trackOrCategory, maybeFilename, maybeVolume = 0.5) => {
        const track = typeof trackOrCategory === 'string'
            ? getTrack(trackOrCategory, maybeFilename)
            : trackOrCategory;
        const desiredVolume = clampVolume(
            typeof trackOrCategory === 'string' ? maybeVolume : maybeFilename
        );
        const token = Symbol(track.id);

        pendingStartTokensRef.current[track.id] = token;

        try {
            const context = await ensureAudioContext();
            const buffer = await loadBuffer(track);

            if (pendingStartTokensRef.current[track.id] !== token) {
                return false;
            }

            stopPlayer(track.id);

            const outputGain = context.createGain();
            outputGain.gain.value = 0;
            outputGain.connect(masterInputGainRef.current);

            const player = {
                ...resolvePlaybackConfig(track, buffer),
                track,
                buffer,
                outputGain,
                sources: new Set(),
                schedulerId: null,
                nextStartTime: context.currentTime + PLAYER_START_OFFSET_SECONDS,
                hasScheduledFirstSegment: false,
                hasStarted: false,
                stopped: false
            };

            playersRef.current[track.id] = player;
            applyOutputVolume(outputGain, track, desiredVolume, START_FADE_SECONDS);
            schedulePlayer(track.id);
            delete pendingStartTokensRef.current[track.id];

            return true;
        } catch (error) {
            if (pendingStartTokensRef.current[track.id] === token) {
                delete pendingStartTokensRef.current[track.id];
            }

            console.error('Audio play failed', error);
            return false;
        }
    }, [applyOutputVolume, ensureAudioContext, loadBuffer, schedulePlayer, stopPlayer]);

    const toggleSound = useCallback((category, filename) => {
        const track = getTrack(category, filename);
        const { id } = track;

        if (activeSoundsRef.current[id]) {
            stopPlayer(id);

            setActiveSounds((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });

            return;
        }

        const nextVolume = track.defaultVolume ?? 0.5;

        setActiveSounds((prev) => ({
            ...prev,
            [id]: { volume: nextVolume }
        }));

        startSound(track, nextVolume).then((started) => {
            if (started) {
                return;
            }

            setActiveSounds((prev) => {
                if (!prev[id]) {
                    return prev;
                }

                const next = { ...prev };
                delete next[id];
                return next;
            });
        });
    }, [startSound, stopPlayer]);

    const setSoundVolume = useCallback((category, filename, volume) => {
        const track = getTrack(category, filename);
        const clamped = clampVolume(volume);
        const player = playersRef.current[track.id];

        if (player) {
            applyOutputVolume(player.outputGain, player.track, clamped);
        }

        setActiveSounds((prev) => {
            if (!prev[track.id]) {
                return prev;
            }

            return {
                ...prev,
                [track.id]: { ...prev[track.id], volume: clamped }
            };
        });
    }, [applyOutputVolume]);

    const changeMasterVolume = useCallback((newMasterVolume) => {
        const clamped = clampVolume(newMasterVolume);

        masterVolumeRef.current = clamped;
        setMasterVolume(clamped);
    }, []);

    useEffect(() => {
        if (masterGainRef.current && audioContextRef.current) {
            rampGain(masterGainRef.current.gain, masterVolume, VOLUME_RAMP_SECONDS, audioContextRef.current.currentTime);
        }
    }, [masterVolume, rampGain]);

    const stopAll = useCallback(() => {
        pendingStartTokensRef.current = {};

        Object.keys(playersRef.current).forEach((id) => {
            stopPlayer(id);
        });

        setActiveSounds({});
        setLoadedPresetId(null);
    }, [stopPlayer]);

    const savePreset = useCallback((name) => {
        if (!name.trim()) return false;

        const newPreset = {
            id: Date.now().toString(),
            name: name.trim(),
            activeSounds: { ...activeSounds },
            masterVolume,
            createdAt: new Date().toISOString()
        };

        setPresets((prev) => {
            const updated = [...prev, newPreset];
            localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        setLoadedPresetId(newPreset.id);

        return true;
    }, [activeSounds, masterVolume]);

    const updatePreset = useCallback((id, name) => {
        if (!id) return false;

        setPresets((prev) => {
            const updated = prev.map((preset) => {
                if (preset.id === id) {
                    return {
                        ...preset,
                        name: name ? name.trim() : preset.name,
                        activeSounds: { ...activeSounds },
                        masterVolume,
                        updatedAt: new Date().toISOString()
                    };
                }

                return preset;
            });

            localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        setLoadedPresetId(id);

        return true;
    }, [activeSounds, masterVolume]);

    const loadPreset = useCallback((presetId) => {
        const preset = presets.find((item) => item.id === presetId);
        if (!preset) {
            return;
        }

        Object.keys(playersRef.current).forEach((id) => {
            stopPlayer(id);
        });

        pendingStartTokensRef.current = {};

        const presetMasterVolume = clampVolume(preset.masterVolume);
        masterVolumeRef.current = presetMasterVolume;
        setMasterVolume(presetMasterVolume);

        const newActiveSounds = {};

        Object.entries(preset.activeSounds).forEach(([id, data]) => {
            const track = getTrackById(id) ?? getTrack(...id.split('/'));
            const volume = clampVolume(data.volume ?? track.defaultVolume ?? 0.5);

            newActiveSounds[id] = { volume };

            startSound(track, volume).then((started) => {
                if (started) {
                    return;
                }

                setActiveSounds((prev) => {
                    if (!prev[id]) {
                        return prev;
                    }

                    const next = { ...prev };
                    delete next[id];
                    return next;
                });
            });
        });

        setActiveSounds(newActiveSounds);
        setLoadedPresetId(presetId);
    }, [presets, startSound, stopPlayer]);

    const deletePreset = useCallback((presetId) => {
        setPresets((prev) => {
            const updated = prev.filter((preset) => preset.id !== presetId);
            localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        if (loadedPresetId === presetId) {
            setLoadedPresetId(null);
        }
    }, [loadedPresetId]);

    useEffect(() => {
        const players = playersRef;
        const masterInput = masterInputGainRef;
        const masterCompressor = masterCompressorRef;
        const masterGain = masterGainRef;
        const audioContext = audioContextRef;

        return () => {
            Object.keys(players.current).forEach((id) => {
                stopPlayer(id);
            });

            [masterInput.current, masterCompressor.current, masterGain.current].forEach((node) => {
                if (!node) {
                    return;
                }

                try {
                    node.disconnect();
                } catch {
                    // Ignore disconnect failures during teardown.
                }
            });

            if (audioContext.current) {
                audioContext.current.close().catch(() => {
                    // Ignore close failures during teardown.
                });
            }
        };
    }, [stopPlayer]);

    const updatePresetSoundVolume = useCallback((presetId, soundKey, volume) => {
        const clamped = clampVolume(volume);

        setPresets((prev) => {
            const updated = prev.map((preset) => {
                if (preset.id === presetId) {
                    const newActiveSounds = { ...preset.activeSounds };

                    if (newActiveSounds[soundKey]) {
                        newActiveSounds[soundKey] = {
                            ...newActiveSounds[soundKey],
                            volume: clamped
                        };
                    }

                    return { ...preset, activeSounds: newActiveSounds };
                }

                return preset;
            });

            localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        if (loadedPresetId === presetId) {
            const [category, filename] = soundKey.split('/');
            setSoundVolume(category, filename, clamped);
        }
    }, [loadedPresetId, setSoundVolume]);

    const renamePreset = useCallback((id, newName) => {
        if (!id || !newName.trim()) return;

        setPresets((prev) => {
            const updated = prev.map((preset) => {
                if (preset.id === id) {
                    return {
                        ...preset,
                        name: newName.trim(),
                        updatedAt: new Date().toISOString()
                    };
                }

                return preset;
            });

            localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
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
        activePresetId: loadedPresetId,
        savePreset,
        updatePreset,
        loadPreset,
        deletePreset,
        updatePresetSoundVolume,
        renamePreset
    };
};
