// types/map-types.ts

export type MapType = "produksi" | "rotasi" | "aktivitas";

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
    LOW: { min: 0.1, max: 79.99, color: "#f55142" },
    MEDIUM: { min: 80, max: 89.99, color: "#f752b0" },
    HIGH: { min: 90, max: 99.99, color: "#f5d742" },
    VERY_HIGH: { min: 100, max: 109.99, color: "#42adf5" },
    EXCEPTIONAL: { min: 110, max: Infinity, color: "#9cf542" }
};

// Rotation map color ranges (you can adjust these values as needed)
export const ROTATION_COLOR_RANGES: ColorRanges = {
    // ZERO: { min: -Infinity, max: 0, color: "#FFF" },
    LOW: { min: 0, max: 1, color: "#9cf542" },
    MEDIUM: { min: 2, max: 3, color: "#42adf5" },
    HIGH: { min: 4, max: 5, color: "#f5d742" },
    VERY_HIGH: { min: 6, max: 7, color: "#f752b0" },
    EXCEPTIONAL: { min: 8, max: Infinity, color: "#f55142" }
}

export const ACTIVITY_COLOR_RANGES: ColorRanges = {
    ZERO: { min: -Infinity, max: 0, color: "#FFF" },
    LOW: { min: 0.1, max: 79.99, color: "#9cf542" },
    MEDIUM: { min: 80, max: 89.99, color: "#42adf5" },
    HIGH: { min: 90, max: 99.99, color: "#f5d742" },
    VERY_HIGH: { min: 100, max: 109.99, color: "#f752b0" },
    EXCEPTIONAL: { min: 110, max: Infinity, color: "#f55142" }
}

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
        title: "Produksi",
        suffix: "%"
    },
    rotasi: {
        colorRanges: ROTATION_COLOR_RANGES,
        title: "Rotasi",
        suffix: " hari"
    },
    aktivitas: {
        colorRanges: ACTIVITY_COLOR_RANGES,
        title: "Aktivitas",
        suffix: "%"
    }
};