/**
 * BaseMap Component
 * An optimized React component for rendering interactive maps with efficient layer updates.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FeatureGroup, GeoJSON, Marker, Tooltip, LayerGroup, useMap } from 'react-leaflet';
import { Loader2 } from 'lucide-react';
import CustomMapContainer from '../leaflet/map';
import LayerControl from './layer-control';
import ModalButton from '../modals/modal-button';
import { MapType, useMapStore } from '@/hooks/use-map-store';
import { PathOptions } from 'leaflet';
import { coordinateMap } from './config-map';

interface BaseMapProps {
    mapType: MapType;
    geoJsonData: any;
    fetchPopupData: (costCenter: string, dateRange: any) => Promise<any>;
    renderPopupContent: (data: any) => string;
    getLayerColor: (properties: any) => Promise<string>;
}

const FlyToOnCheckbox = ({ coords }: { coords: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.flyTo(coords, 12);
        }
    }, [coords, map]);
    return null;
};

export const BaseMap: React.FC<BaseMapProps> = ({
    mapType,
    geoJsonData,
    fetchPopupData,
    renderPopupContent,
    getLayerColor,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingPopup, setIsFetchingPopup] = useState(false);
    const [layerColors, setLayerColors] = useState<{ [key: string]: PathOptions }>({});
    const [labelGroups, setLabelGroups] = useState<any[]>([]);
    const geoJsonRef = useRef<any>(null);

    const {
        selected,
        dateRange,
        layerLabels,
        toggleLayerLabel
    } = useMapStore();

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

        return selected[ptKey] || selected[estateKey] || selected[divisiKey] || false;
    }, [selected]);

    // Popup handler
    const onEachFeature = useCallback((feature: any, layer: any) => {
        layer.on({
            click: async () => {
                setIsFetchingPopup(true);
                try {
                    const data = await fetchPopupData(feature.properties.COSTCENTER, dateRange);
                    if (data) {
                        layer.bindPopup(renderPopupContent(data)).openPopup();
                    }
                } finally {
                    setIsFetchingPopup(false);
                }
            },
        });
    }, [dateRange, fetchPopupData, renderPopupContent]);

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

            <LayerControl
                title="Map Labels"
                layers={[
                    { id: 'block', label: 'Block Numbers', isVisible: layerLabels[mapType].block }
                ]}
                onToggle={(id, value) => toggleLayerLabel(mapType, id as keyof typeof layerLabels[typeof mapType], value)}
            />

            {selectedCoordinates}

            <FeatureGroup>
                <GeoJSON
                    key={`${JSON.stringify(selected)}-${dateRange?.startDate}-${dateRange?.endDate}`}
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