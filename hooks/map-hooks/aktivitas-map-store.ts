// hooks/aktivitas-map-store.ts
import { create } from "zustand";

interface AktivitasMapState {
    activityCode: string;
}

interface AktivitasMapActions {
    setActivityCode: (code: string) => void;
}

type AktivitasMapStore = AktivitasMapState & AktivitasMapActions;

export const useAktivitasMapStore = create<AktivitasMapStore>((set) => ({
    activityCode: "",

    setActivityCode: (code) => set({ activityCode: code }),
}));