// hooks/use-map-store-compat.ts
import { useCommonMapStore } from "./common-map-store";
import { useDateRangeStore } from "./date-range-store";
import { useLayerLabelsStore } from "./layer-labels-store";
import { useAktivitasMapStore } from "./aktivitas-map-store";
import { MapType } from "@/types/map-types";

/**
 * Compatibility layer to provide the same interface as the original useMapStore
 * This helps with gradual migration to the new separated stores
 */
export const useMapStore = () => {
    const common = useCommonMapStore();
    const dateRange = useDateRangeStore();
    const layerLabels = useLayerLabelsStore();
    const aktivitasMap = useAktivitasMapStore();

    return {
        // Common state
        activeMapType: common.activeMapType,
        isOpen: common.isOpen,
        selected: common.selected,

        // Date range state
        dateRange: dateRange.dateRange,

        // Layer labels state
        layerLabels: layerLabels.layerLabels,

        // Aktivitas map state
        activityCode: aktivitasMap.activityCode,

        // Common actions
        setActiveMapType: common.setActiveMapType,
        onOpen: common.onOpen,
        onClose: common.onClose,
        toggleCheckbox: common.toggleCheckbox,

        // Date range actions
        setDateRange: dateRange.setDateRange,

        // Layer labels actions
        toggleLayerLabel: layerLabels.toggleLayerLabel,

        // Aktivitas map actions
        setActivityCode: aktivitasMap.setActivityCode,

        // Compatibility for updateStyles
        updateStyles: {
            produksi: async (startDate: string, endDate: string) =>
                dateRange.updateStylesByDateRange('produksi', startDate, endDate),
            rotasi: null,
            aktivitas: async (startDate: string, endDate: string) =>
                dateRange.updateStylesByDateRange('aktivitas', startDate, endDate),
        },

        // setUpdateStyles compatibility
        setUpdateStyles: (mapType: MapType, fn: any) => {
            console.warn('setUpdateStyles is deprecated, use updateStylesByDateRange directly');
            // No implementation needed as this pattern is being replaced
        },
    };
};