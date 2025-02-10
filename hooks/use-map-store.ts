import { create } from "zustand";
import moment from "moment-timezone";

export type MapType = "produksi" | "rotasi" | "aktivitas";

interface DateRange {
    startDate: Date;
    endDate: Date;
}

interface LayerLabels {
    block: boolean;
}

interface MapState {
    activeMapType: MapType | null;
    isOpen: boolean;
    dateRange: DateRange | null;
    selected: Record<string, boolean>;
    layerLabels: Record<MapType, LayerLabels>;
    updateStyles: Record<MapType, ((startDate: string, endDate: string) => Promise<void>) | null>;
}

interface MapActions {
    setActiveMapType: (type: MapType | null) => void;
    onOpen: (type: MapType) => void;
    onClose: () => void;
    setDateRange: (range: DateRange) => void;
    toggleCheckbox: (key: string, childrenKeys?: string[]) => void;
    toggleLayerLabel: (mapType: MapType, labelType: keyof LayerLabels, value: boolean) => void;
    setUpdateStyles: (mapType: MapType, fn: (startDate: string, endDate: string) => Promise<void>) => void;
}

type MapStore = MapState & MapActions;

export const useMapStore = create<MapStore>((set) => ({
    activeMapType: null,
    isOpen: false,
    dateRange: null,
    selected: {},
    layerLabels: {
        produksi: {
            block: false,
        },
        rotasi: {
            block: false,
        },
        aktivitas: {
            block: false,
        },
    },
    updateStyles: {
        produksi: async (startDate: string, endDate: string) => {
            set((state) => ({
                ...state,
                dateRange: {
                    startDate: moment(startDate, 'YYYYMM').toDate(),
                    endDate: moment(endDate, 'YYYYMM').toDate()
                }
            }));
        },
        rotasi: null,
        aktivitas: async (startDate: string, endDate: string) => {
            set((state) => ({
                ...state,
                dateRange: {
                    startDate: moment(startDate, 'YYYYMM').toDate(),
                    endDate: moment(endDate, 'YYYYMM').toDate()
                }
            }));
        },
    },

    setActiveMapType: (type) => set({ activeMapType: type }),

    // Modified onOpen to handle both isOpen and activeMapType
    onOpen: (type) => set({ isOpen: true, activeMapType: type }),

    // Modified onClose to only close the modal without affecting activeMapType
    onClose: () => set({ isOpen: false }), // Removed setting activeMapType to null

    setDateRange: (range) => set({ dateRange: range }),

    toggleCheckbox: (key, childrenKeys = []) =>
        set((state) => {
            const newSelected = { ...state.selected };
            const isChecked = !newSelected[key];
            newSelected[key] = isChecked;
            childrenKeys.forEach((childKey) => {
                newSelected[childKey] = isChecked;
            });
            return { selected: newSelected };
        }),

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

    setUpdateStyles: (mapType, fn) =>
        set((state) => ({
            updateStyles: {
                ...state.updateStyles,
                [mapType]: fn
            }
        })),
}));