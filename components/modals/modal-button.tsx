"use client"

import React from 'react'
import { Button } from '../ui/button'
import { Layers, PanelsTopLeft } from 'lucide-react'
import { ModalType, useModalStore } from '@/hooks/use-modal-store'

interface ModalButtonProps {
    className?: string;
    type: ModalType
}

const ModalButton: React.FC<ModalButtonProps> = ({ className, type }) => {
    const { onOpen } = useModalStore();

    return (
        <Button onClick={() => onOpen(type)} variant="primary" size="icon" className={`h-8 w-8 ${className}`}>
            <PanelsTopLeft />
        </Button>
    )
}

export default ModalButton