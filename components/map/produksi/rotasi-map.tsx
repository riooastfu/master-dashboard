"use client"

import React, { useCallback, useEffect, useRef } from 'react';
import moment from 'moment-timezone';
import BaseMap from '../base-map';
import maplayer from '@/public/geojson/map.json';
import { useMapStore } from '@/hooks/map-hooks/use-map-store-compat';
import { ROTATION_COLOR_RANGES } from '@/types/map-types';
import { getDataRotasi, getPopUpData } from '@/actions/gis/rotasi/rotasi';

const RotasiMap = () => {
    const { dateRange } = useMapStore();
    const colorCache = useRef<Map<string, string>>(new Map());

    // Fetch popup data using axios
    const fetchPopupData = async (costCenter: string, dateRange: any) => {
        if (!dateRange?.startDate || !dateRange?.endDate) return null;

        const tglAwal = moment(dateRange.startDate).format("YYYYMM");

        try {
            const response = await getPopUpData(costCenter, tglAwal)

            return response.data;
        } catch (error) {
            console.error("Error fetching popup data:", error);
            return null;
        }
    };

    // Get color for map layer based on Total_Hari_Belum_Panen
    const getLayerColor = useCallback(async (properties: any): Promise<string> => {
        if (!dateRange?.startDate || !dateRange?.endDate) {
            return ROTATION_COLOR_RANGES.ZERO.color;
        }

        const cacheKey = `${properties.COSTCENTER}-${moment(dateRange.startDate).format("YYYYMM")}-${moment(dateRange.endDate).format("YYYYMM")}`;

        // Check cache first
        if (colorCache.current.has(cacheKey)) {
            return colorCache.current.get(cacheKey)!;
        }

        try {
            const rotasi = await getDataRotasi(
                properties.COSTCENTER,
                moment(dateRange.startDate).format("YYYYMM")
            );

            // Extract Total_Hari_Belum_Panen from response
            const hariBelumPanen = rotasi.data?.Total_Hari_Belum_Panen;
            const color = getColorByHariBelumPanen(hariBelumPanen);
            colorCache.current.set(cacheKey, color);
            return color;
        } catch (error) {
            console.error("Error getting hari belum panen:", error);
            return ROTATION_COLOR_RANGES.ZERO.color;
        }
    }, [dateRange]);

    // Helper to get color based on Total_Hari_Belum_Panen
    const getColorByHariBelumPanen = (hariBelumPanen: number): string => {
        const range = Object.values(ROTATION_COLOR_RANGES).find(
            range => hariBelumPanen >= range.min && hariBelumPanen < range.max
        );
        return range?.color || ROTATION_COLOR_RANGES.ZERO.color;
    };

    // Clear cache when dateRange changes
    useEffect(() => {
        colorCache.current.clear();
    }, [dateRange]);

    return (
        <BaseMap
            mapType="rotasi"
            geoJsonData={maplayer}
            fetchPopupData={fetchPopupData}
            getLayerColor={getLayerColor}
        />
    );
};

export default RotasiMap;