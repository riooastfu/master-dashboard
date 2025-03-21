// hooks/layer-labels-store.ts
import { create } from "zustand";
import { MapType } from "@/types/map-types";

interface LayerLabels {
    block: boolean;
}

interface LayerLabelsState {
    layerLabels: Record<MapType, LayerLabels>;
}

interface LayerLabelsActions {
    toggleLayerLabel: (mapType: MapType, labelType: keyof LayerLabels, value: boolean) => void;
}

type LayerLabelsStore = LayerLabelsState & LayerLabelsActions;

export const useLayerLabelsStore = create<LayerLabelsStore>((set) => ({
    layerLabels: {
        produksi: { block: false },
        rotasi: { block: false },
        aktivitas: { block: false },
    },

    toggleLayerLabel: (mapType, labelType, value) =>
        set((state) => ({
            layerLabels: {
                ...state.layerLabels,
                [mapType]: {
                    ...state.layerLabels[mapType],
                    [labelType]: value,
                },
            },
        })),
}));