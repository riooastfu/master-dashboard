"use client"

import React from 'react'
import { Button } from '../ui/button'
import { PanelsTopLeft } from 'lucide-react'
import { MapType, useMapStore } from '@/hooks/use-map-store'

interface ModalButtonProps {
    type: MapType;
    className?: string;
}

const ModalButton: React.FC<ModalButtonProps> = ({ className, type }) => {
    const { onOpen } = useMapStore();

    return (
        <Button
            onClick={() => onOpen(type)}
            variant="primary"
            size="icon"
            className={`h-8 w-8 ${className}`}
        >
            <PanelsTopLeft className="h-4 w-4" />
        </Button>
    )
}

export default ModalButton