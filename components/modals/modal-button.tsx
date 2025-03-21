"use client"

import React from 'react'
import { Button } from '../ui/button'
import { PanelsTopLeft } from 'lucide-react'
import { MapType } from '@/types/map-types'
import { useCommonMapStore } from '@/hooks/map-hooks/common-map-store'
import { useDateRangeStore } from '@/hooks/map-hooks/date-range-store'
// import { MapType, useMapStore } from '@/hooks/use-map-store'

interface ModalButtonProps {
    type: MapType;
    className?: string;
}

const ModalButton: React.FC<ModalButtonProps> = ({ className, type }) => {
    const { onOpen } = useCommonMapStore();
    const { clearDateRange } = useDateRangeStore();

    const handleOpen = () => {
        // Get current active map type
        const currentMapType = useCommonMapStore.getState().activeMapType;

        // If changing map types, clear date range
        if (currentMapType !== type) {
            clearDateRange();
        }

        // Open the modal
        onOpen(type);
    };

    return (
        <Button
            onClick={handleOpen}
            variant="primary"
            size="icon"
            className={`h-8 w-8 ${className}`}
        >
            <PanelsTopLeft className="h-4 w-4" />
        </Button>
    );
};

export default ModalButton