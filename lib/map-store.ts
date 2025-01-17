import { create } from 'zustand';
import axios from 'axios';
import L from 'leaflet';

type MapStore = {
    visibility: Record<string, boolean>;
    updateStyles: (() => void) | null;
    toggleLayer: (layer: string) => void;
    setUpdateStyles: (fn: () => void) => void;
};

export const useMapStore = create<MapStore>((set, get) => ({
    visibility: { MB1: true, MB2: true, MB3: true },
    updateStyles: null,
    toggleLayer: (layer) =>
        set((state) => ({
            visibility: {
                ...state.visibility,
                [layer]: !state.visibility[layer],
            },
        })),
    setUpdateStyles: (fn) => set({ updateStyles: fn }),
}));
