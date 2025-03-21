import React from 'react';
import { Card } from '@/components/ui/card';
import { Toggle } from '../ui/toggle';
import { MapType } from '@/types/map-types';
import { useMapStore } from '@/hooks/map-hooks/use-map-store-compat';
import { ColorRange, MAP_CONFIGS } from '@/types/map-types';
import { Eye, EyeClosed, EyeOff } from 'lucide-react';

interface MapLegendProps {
    className?: string;
}

const getLegendLabel = (range: ColorRange, suffix: string): string => {
    if (range.min === -Infinity) return `0${suffix}`;
    if (range.max === Infinity) return `≥ ${range.min}${suffix}`;
    return `${range.min}${suffix} - ${range.max}${suffix}`;
};

const MapLegend: React.FC<MapLegendProps> = ({ className = "" }) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const { activeMapType, isOpen } = useMapStore();

    // Modified condition: Use the map type even when modal is closed
    const mapConfig = activeMapType ? MAP_CONFIGS[activeMapType] : null;
    if (!mapConfig) return null;

    const { colorRanges, title, suffix } = mapConfig;

    return (
        <Card className={`absolute z-[1000] bg-white shadow-lg ${className}`}>
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <Toggle
                        pressed={isVisible}
                        onPressedChange={setIsVisible}
                        size="sm"
                        className="ml-2"
                    >
                        {isVisible ? <EyeOff /> : <Eye />}
                    </Toggle>
                </div>
                {isVisible && (
                    <div className="space-y-2">
                        {Object.entries(colorRanges).map(([key, range]) => (
                            <div key={key} className="flex items-center gap-2">
                                <div
                                    className="w-6 h-6 border border-gray-300"
                                    style={{
                                        backgroundColor: range.color,
                                        border: range.color === "#FFF" ? '1px solid #e5e7eb' : 'none'
                                    }}
                                />
                                <span className="text-xs">
                                    {getLegendLabel(range, suffix)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default MapLegend;