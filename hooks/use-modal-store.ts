import { create } from "zustand";
import moment from "moment-timezone";

export type ModalType = "produksi" | "rotasi" | null;

interface DateRange {
    startDate: Date;
    endDate: Date;
}

interface ModalState {
    // Modal control
    type: ModalType;
    isOpen: boolean;

    // Date range
    dateRange: DateRange | null;

    // Form selections
    selected: Record<string, boolean>;

    // Update styles callback
    updateStyles: (tanggal_mulai: string, tanggal_akhir: string) => Promise<void>;
}

interface ModalActions {
    // Modal actions
    setType: (type: ModalType) => void;
    onOpen: (type: ModalType) => void;
    onClose: () => void;

    // Date range actions
    setDateRange: (range: DateRange) => void;

    // Form actions
    setCheckbox: (key: string, value: boolean, childrenKeys?: string[]) => void;
    toggleCheckbox: (key: string, childrenKeys?: string[]) => void;

    // Update styles action
    setUpdateStyles: (fn: (tanggal_mulai: string, tanggal_akhir: string) => Promise<void>) => void;
}

type ModalStore = ModalState & ModalActions;

export const useModalStore = create<ModalStore>((set) => ({
    // Initial state
    type: null,
    isOpen: false,
    dateRange: null,
    selected: {},
    updateStyles: async () => { },

    // Modal actions
    setType: (type) => set({ type }),
    onOpen: (type) => set({ isOpen: true, type }),
    onClose: () => set({ isOpen: false, type: null }),

    // Date range actions
    setDateRange: (range) => set({ dateRange: range }),

    // Form actions
    toggleCheckbox: (key, childrenKeys = []) =>
        set((state) => {
            const newState = { ...state.selected };
            const isChecked = !state.selected[key];

            // Toggle the parent checkbox
            newState[key] = isChecked;

            // Cascade the toggle to children
            childrenKeys.forEach((childKey) => {
                newState[childKey] = isChecked;
            });

            return { selected: newState };
        }),

    setCheckbox: (key, value, childrenKeys = []) =>
        set((state) => {
            const newState = { ...state.selected };

            // Set the parent checkbox
            newState[key] = value;

            // Cascade the set value to children
            childrenKeys.forEach((childKey) => {
                newState[childKey] = value;
            });

            return { selected: newState };
        }),

    // Update styles action
    setUpdateStyles: (fn) => set(() => ({ updateStyles: fn })),
}));