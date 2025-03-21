// In common-map-store.ts
import { create } from "zustand";
import { MapType } from "@/types/map-types";
import { useDateRangeStore } from "./date-range-store";

interface CommonMapState {
    activeMapType: MapType | null;
    isOpen: boolean;
    selected: Record<string, boolean>;
}

interface CommonMapActions {
    setActiveMapType: (type: MapType | null) => void;
    onOpen: (type: MapType) => void;
    onClose: () => void;
    toggleCheckbox: (key: string, childrenKeys?: string[]) => void;
    clearSelections: () => void;
}

type CommonMapStore = CommonMapState & CommonMapActions;

export const useCommonMapStore = create<CommonMapStore>((set) => ({
    activeMapType: null,
    isOpen: false,
    selected: {},

    setActiveMapType: (type) => {
        if (type !== null) {
            // If we're changing map types, clear everything
            const currentActiveMapType = useCommonMapStore.getState().activeMapType;
            if (currentActiveMapType !== type) {
                // Clear date range when changing map types
                useDateRangeStore.getState().clearDateRange();
                // Clear selections
                set({ activeMapType: type, selected: {} });
            } else {
                set({ activeMapType: type });
            }
        } else {
            set({ activeMapType: type });
        }
    },

    onOpen: (type) => {
        // If we're changing map types, clear selections
        const currentActiveMapType = useCommonMapStore.getState().activeMapType;
        if (currentActiveMapType !== type) {
            // Clear selections
            set({ isOpen: true, activeMapType: type, selected: {} });
        } else {
            set({ isOpen: true, activeMapType: type });
        }
    },

    onClose: () => set({ isOpen: false }),

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

    clearSelections: () => set({ selected: {} }),
}));