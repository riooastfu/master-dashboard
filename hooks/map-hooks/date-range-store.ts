// In date-range-store.ts
import { create } from "zustand";
import moment from "moment-timezone";
import { MapType } from "@/types/map-types";

export interface DateRange {
    startDate: Date;
    endDate: Date;
}

interface DateRangeState {
    dateRange: DateRange | null;
    updateStyles: Record<MapType, ((startDate: string, endDate: string) => Promise<void>) | null>;
}

interface DateRangeActions {
    setDateRange: (range: DateRange) => void;
    updateStylesByDateRange: (mapType: MapType, startDate: string, endDate: string) => Promise<void>;
    setUpdateStyles: (mapType: MapType, fn: (startDate: string, endDate: string) => Promise<void>) => void;
    clearDateRange: () => void;
}

type DateRangeStore = DateRangeState & DateRangeActions;

export const useDateRangeStore = create<DateRangeStore>((set, get) => ({
    dateRange: null,
    updateStyles: {
        produksi: null,
        rotasi: null,
        aktivitas: null,
    },

    setDateRange: (range) => set({ dateRange: range }),

    updateStylesByDateRange: async (mapType, startDate, endDate) => {
        const { updateStyles } = get();
        if (updateStyles[mapType]) {
            await updateStyles[mapType]!(startDate, endDate);
        }
        set({
            dateRange: {
                startDate: moment(startDate, 'YYYYMM').toDate(),
                endDate: moment(endDate, 'YYYYMM').toDate()
            }
        });
    },

    setUpdateStyles: (mapType, fn) =>
        set((state) => ({
            updateStyles: {
                ...state.updateStyles,
                [mapType]: fn
            }
        })),

    clearDateRange: () => set({ dateRange: null }),
}));