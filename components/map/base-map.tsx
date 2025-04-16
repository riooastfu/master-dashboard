import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FeatureGroup, GeoJSON, Marker, Tooltip, LayerGroup, useMap } from 'react-leaflet';
import { Loader2 } from 'lucide-react';
import CustomMapContainer from '../leaflet/map';
import LayerControl from './layer-control';
import ModalButton from '../modals/modal-button';
import { PathOptions } from 'leaflet';
import { coordinateMap } from './config-map';
import PrintMapButton from '../leaflet/print-map';
import MapLegend from '../leaflet/map-legend';
import { renderPopupContent } from './popup-renderer';
import { MapType } from '@/types/map-types';

// Import the specific stores
import { useCommonMapStore } from '@/hooks/map-hooks/common-map-store';
import { useDateRangeStore } from '@/hooks/map-hooks/date-range-store';
import { useLayerLabelsStore } from '@/hooks/map-hooks/layer-labels-store';
import { useAktivitasMapStore } from '@/hooks/map-hooks/aktivitas-map-store';

interface BaseMapProps {
    mapType: MapType;
    geoJsonData: any;
    fetchPopupData: (costCenter: string, dateRange: any) => Promise<any>;
    renderPopupContent?: (data: any) => string;
    getLayerColor: (properties: any) => Promise<string>;
}

const FlyToOnCheckbox = ({ coords }: { coords: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.flyTo(coords, 13);
        }
    }, [coords, map]);
    return null;
};

export const BaseMap: React.FC<BaseMapProps> = ({
    mapType,
    geoJsonData,
    fetchPopupData,
    renderPopupContent: customRenderPopupContent,
    getLayerColor,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingPopup, setIsFetchingPopup] = useState(false);
    const [layerColors, setLayerColors] = useState<{ [key: string]: PathOptions }>({});
    const [labelGroups, setLabelGroups] = useState<any[]>([]);
    const geoJsonRef = useRef<any>(null);

    // Use the separated stores
    const { selected, activeMapType, setActiveMapType } = useCommonMapStore();
    const { dateRange } = useDateRangeStore();
    const { layerLabels, toggleLayerLabel } = useLayerLabelsStore();
    const { activityCode } = useAktivitasMapStore();

    // Set active map type when component mounts
    useEffect(() => {
        setActiveMapType(mapType);
        return () => {
            if (!document.querySelector('[data-map-container]')) {
                setActiveMapType(null);
            }
        };
    }, [mapType, setActiveMapType]);

    // Effect to handle layer color updates
    useEffect(() => {
        const updateLayerColors = async () => {
            if (!dateRange?.startDate || !dateRange?.endDate) return;
            setIsLoading(true);

            try {
                const layers = geoJsonRef.current?.getLayers() || [];
                const newColors: { [key: string]: PathOptions } = {};

                // Process all layers in parallel
                await Promise.all(
                    layers.map(async (layer: any) => {
                        const costCenter = layer.feature.properties.COSTCENTER;
                        const fillColor = await getLayerColor(layer.feature.properties);

                        newColors[costCenter] = {
                            color: "black",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.5,
                            fillColor
                        };

                        // Apply color immediately to each layer
                        layer.setStyle(newColors[costCenter]);
                    })
                );

                setLayerColors(newColors);
            } catch (error) {
                console.error("Error updating colors:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(updateLayerColors, 300);
        return () => clearTimeout(timeoutId);
    }, [dateRange, getLayerColor]);

    // Label management
    useEffect(() => {
        const newLabelGroups: any[] = [];

        geoJsonData.features.forEach((feature: any) => {
            const { PT: pt, ESTATE: estate, DIVISI: divisi, BLOK } = feature.properties;
            const ptKey = `checkbox-${pt}`;
            const estateKey = `checkbox-${pt}-${estate}`;
            const divisiKey = `checkbox-${pt}-${estate}-${divisi}`;

            if (!selected[ptKey] && !selected[estateKey] && !selected[divisiKey]) return;

            const bounds = geoJsonRef.current?.getLayers().find((l: any) =>
                l.feature.properties.COSTCENTER === feature.properties.COSTCENTER
            )?.getBounds();

            if (!bounds) return;
            const center = bounds.getCenter();

            if (layerLabels[mapType].block && BLOK) {
                newLabelGroups.push({
                    type: 'block',
                    position: [center.lat + 0.001, center.lng],
                    content: `${BLOK}`
                });
            }
        });

        setLabelGroups(newLabelGroups);
    }, [geoJsonData, selected, layerLabels, mapType]);

    // In base-map.tsx
    useEffect(() => {
        setLayerColors({});

        // Force GeoJSON to rerender by clearing and setting its reference
        if (geoJsonRef.current) {
            const tempRef = geoJsonRef.current;
            geoJsonRef.current = null;
            setTimeout(() => {
                geoJsonRef.current = tempRef;
            }, 0);
        }
    }, [mapType]);

    // Style handler for GeoJSON
    const setColor = useCallback((feature: any): PathOptions => {
        return layerColors[feature.properties.COSTCENTER] || {
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5,
            fillColor: "#FFF"
        };
    }, [layerColors]);

    // Feature visibility filter
    const filterFeatures = useCallback((feature: any) => {
        const { PT: pt, ESTATE: estate, DIVISI: divisi } = feature.properties;
        const ptKey = `checkbox-${pt}`;
        const estateKey = `checkbox-${pt}-${estate}`;
        const divisiKey = `checkbox-${pt}-${estate}-${divisi}`;

        // If nothing is selected at all, show nothing
        if (Object.keys(selected).length === 0) {
            return false;
        }

        // Only show features that have an explicitly checked selection
        return selected[ptKey] === true ||
            selected[estateKey] === true ||
            selected[divisiKey] === true;
    }, [selected]);

    // Popup handler
    const onEachFeature = useCallback((feature: any, layer: any) => {
        layer.on({
            click: async () => {
                setIsFetchingPopup(true);
                try {
                    const data = await fetchPopupData(feature.properties.COSTCENTER, dateRange);
                    console.log("data>> ", data);
                    if (data) {
                        // Use the imported renderPopupContent function, with fallback to custom renderer
                        const content = renderPopupContent(
                            data,
                            mapType,
                            dateRange,
                            activityCode,
                            customRenderPopupContent
                        );
                        layer.bindPopup(content).openPopup();
                    }
                } finally {
                    setIsFetchingPopup(false);
                }
            },
        });
    }, [dateRange, fetchPopupData, mapType, activityCode, customRenderPopupContent]);

    // Selected coordinates for map navigation
    const selectedCoordinates = useMemo(() =>
        Object.entries(coordinateMap)
            .filter(([key]) => selected[key])
            .map(([key, coords]) => (
                <FlyToOnCheckbox key={key} coords={coords} />
            )),
        [selected]
    );

    return (
        <CustomMapContainer>
            {(isLoading || isFetchingPopup) && (
                <div className="absolute inset-0 bg-black/50 z-[2000] flex items-center justify-center">
                    <div className="bg-white rounded-lg p-4 flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <span className="text-sm font-medium">
                            {isLoading ? 'Updating map...' : 'Loading details...'}
                        </span>
                    </div>
                </div>
            )}

            <ModalButton
                type={mapType}
                className="m-3 top-0 right-0 z-[1000] absolute"
            />

            <PrintMapButton className="m-3 top-10 right-0 z-[1000] absolute" />

            <LayerControl
                title="Label Peta"
                layers={[
                    { id: 'block', label: 'Nomor Blok', isVisible: layerLabels[mapType].block }
                ]}
                onToggle={(id, value) => toggleLayerLabel(mapType, id as keyof typeof layerLabels[typeof mapType], value)}
            />

            <MapLegend className="bottom-5 right-5" />

            {selectedCoordinates}

            <FeatureGroup>
                <GeoJSON
                    key={`${activeMapType}-${JSON.stringify(selected)}-${dateRange?.startDate}-${dateRange?.endDate}-${mapType}`}
                    data={geoJsonData}
                    style={setColor}
                    filter={filterFeatures}
                    ref={geoJsonRef}
                    onEachFeature={onEachFeature}
                />
            </FeatureGroup>

            <LayerGroup>
                {labelGroups.map((label, index) => (
                    <Marker
                        key={`${label.type}-${index}`}
                        position={label.position}
                        opacity={0}
                    >
                        <Tooltip
                            permanent
                            direction="center"
                            className={`map-label ${label.type}-label`}
                        >
                            {label.content}
                        </Tooltip>
                    </Marker>
                ))}
            </LayerGroup>
        </CustomMapContainer>
    );
};

export default BaseMap;