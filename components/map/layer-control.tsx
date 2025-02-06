import React from 'react';
import { Layers } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export interface Layer {
    id: string;
    label: string;
    isVisible: boolean;
}

interface LayerControlProps {
    title?: string;
    layers: Layer[];
    onToggle: (id: string, value: boolean) => void;
    className?: string;
    icon?: React.ReactNode;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Position classes map for easy positioning
const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
};

const LayerControl: React.FC<LayerControlProps> = ({
    title = 'Layer Control',
    layers,
    onToggle,
    className = '',
    icon = <Layers className="h-4 w-4" />,
    position = 'bottom-left'
}) => {
    return (
        <Card
            className={`
        absolute ${positionClasses[position]} 
        z-[1000] p-4 
        bg-white/90 backdrop-blur-sm
        shadow-lg rounded-lg
        ${className}
      `}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                {icon}
                <span className="text-sm font-medium">{title}</span>
            </div>

            {/* Layer Toggles */}
            <div className="space-y-2">
                {layers.map((layer) => (
                    <div
                        key={layer.id}
                        className="flex items-center justify-between py-1"
                    >
                        <label
                            htmlFor={`layer-${layer.id}`}
                            className="text-sm text-gray-700 cursor-pointer"
                        >
                            {layer.label}
                        </label>
                        <Switch
                            id={`layer-${layer.id}`}
                            checked={layer.isVisible}
                            onCheckedChange={(checked) => onToggle(layer.id, checked)}
                            className="ml-4"
                        />
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default LayerControl;