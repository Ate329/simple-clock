import rawSoundData from './sounds.json';

const clampVolume = (value, fallback = 0.5) => {
    if (!Number.isFinite(value)) {
        return fallback;
    }

    return Math.max(0, Math.min(1, value));
};

const formatTrackLabel = (filename) => {
    return filename
        .replace(/\.(mp3|wav)$/i, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const normalizeLoop = (loop = {}) => {
    const mode = typeof loop.mode === 'string' ? loop.mode : 'crossfade';
    const start = Number.isFinite(loop.start) ? Math.max(0, loop.start) : 0;
    const end = Number.isFinite(loop.end) ? Math.max(0, loop.end) : null;
    const crossfadeMs = Number.isFinite(loop.crossfadeMs)
        ? Math.max(0, loop.crossfadeMs)
        : null;

    return {
        mode,
        start,
        end,
        crossfadeMs
    };
};

const normalizeTrackEntry = (category, entry) => {
    const source = typeof entry === 'string' ? { file: entry } : entry;
    const file = source.file;

    if (!file) {
        throw new Error(`Invalid sound entry in category '${category}'`);
    }

    return {
        id: `${category}/${file}`,
        category,
        file,
        label: source.label ?? formatTrackLabel(file),
        defaultVolume: clampVolume(source.defaultVolume, 0.5),
        gainDb: Number.isFinite(source.gainDb) ? source.gainDb : 0,
        loop: normalizeLoop(source.loop),
        maxVolume: clampVolume(source.maxVolume, 1)
    };
};

export const soundData = Object.fromEntries(
    Object.entries(rawSoundData).map(([category, entries]) => [
        category,
        entries.map((entry) => normalizeTrackEntry(category, entry))
    ])
);

const trackMap = new Map(
    Object.values(soundData)
        .flat()
        .map((track) => [track.id, track])
);

export const getTrack = (category, file) => {
    return trackMap.get(`${category}/${file}`) ?? normalizeTrackEntry(category, file);
};

export const getTrackById = (id) => {
    return trackMap.get(id) ?? null;
};

export { formatTrackLabel };
