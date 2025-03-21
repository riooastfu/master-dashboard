// hooks/rotasi-map-store.ts
import { create } from "zustand";

// This store is currently empty as rotasi map doesn't have specific state
// beyond what's in the common stores, but you can add specific state here as needed
interface RotasiMapState {
    // Add rotasi-specific state here
}

interface RotasiMapActions {
    // Add rotasi-specific actions here
}

type RotasiMapStore = RotasiMapState & RotasiMapActions;

export const useRotasiMapStore = create<RotasiMapStore>((set) => ({
    // Add rotasi-specific implementation here
}));