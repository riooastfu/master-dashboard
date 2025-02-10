// types/map-types.ts

export type ColorRange = {
    min: number;
    max: number;
    color: string;
};

export type ColorRanges = {
    [key: string]: ColorRange;
};

// Production map color ranges
export const PRODUCTION_COLOR_RANGES: ColorRanges = {
    ZERO: { min: -Infinity, max: 0, color: "#FFF" },
    LOW: { min: 0, max: 79.99, color: "#f55142" },
    MEDIUM: { min: 80, max: 89.99, color: "#f752b0" },
    HIGH: { min: 90, max: 99.99, color: "#f5d742" },
    VERY_HIGH: { min: 100, max: 109.99, color: "#42adf5" },
    EXCEPTIONAL: { min: 110, max: Infinity, color: "#9cf542" }
};

// Rotation map color ranges (you can adjust these values as needed)
export const ROTATION_COLOR_RANGES: ColorRanges = {
    NOT_STARTED: { min: -Infinity, max: 0, color: "#FFF" },
    IN_PROGRESS: { min: 0, max: 50, color: "#ffeb3b" },
    NEARING_COMPLETION: { min: 50, max: 75, color: "#ff9800" },
    COMPLETED: { min: 75, max: Infinity, color: "#4caf50" }
};

// Map configuration type
export type MapConfig = {
    colorRanges: ColorRanges;
    title: string;
    suffix: string;
}

// Map configurations
export const MAP_CONFIGS: Record<string, MapConfig> = {
    produksi: {
        colorRanges: PRODUCTION_COLOR_RANGES,
        title: "Production Achievement",
        suffix: "%"
    },
    rotasi: {
        colorRanges: ROTATION_COLOR_RANGES,
        title: "Rotation Progress",
        suffix: "%"
    }
};