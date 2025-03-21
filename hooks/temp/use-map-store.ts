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
    activityCode: string; // Added activityCode
}

interface MapActions {
    setActiveMapType: (type: MapType | null) => void;
    onOpen: (type: MapType) => void;
    onClose: () => void;
    setDateRange: (range: DateRange) => void;
    setActivityCode: (code: string) => void; // Added setActivityCode action
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
    activityCode: "", // Initialize activityCode
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
    onOpen: (type) => set({ isOpen: true, activeMapType: type }),
    onClose: () => set({ isOpen: false }),
    setDateRange: (range) => set({ dateRange: range }),
    setActivityCode: (code) => set({ activityCode: code }), // Add setActivityCode implementation

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