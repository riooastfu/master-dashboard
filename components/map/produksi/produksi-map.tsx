"use client"

import React, { useCallback, useEffect, useRef } from 'react';
import moment from 'moment-timezone';
import BaseMap from '../base-map';
import { getPersentase } from '@/actions/produksi';
import maplayer from '@/public/geojson/map.json';
import { useMapStore } from '@/hooks/map-hooks/use-map-store-compat';
import useAxiosAuth from '@/hooks/use-axios-auth';
import { PRODUCTION_COLOR_RANGES } from '@/types/map-types';

const ProduksiMap = () => {
    const axiosAuth = useAxiosAuth();
    const { dateRange } = useMapStore();
    const colorCache = useRef<Map<string, string>>(new Map());

    // Fetch popup data using axios
    const fetchPopupData = async (costCenter: string, dateRange: any) => {
        if (!dateRange?.startDate || !dateRange?.endDate) return null;

        const tglAwal = moment(dateRange.startDate).format("YYYYMM");
        const tglAkhir = moment(dateRange.endDate).format("YYYYMM");

        try {
            const response = await axiosAuth.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/produksi/produksi/popup`,
                { fullBlockCode: costCenter, tglAwal, tglAkhir }
            );
            return response.data.data;
        } catch (error) {
            console.error("Error fetching popup data:", error);
            return null;
        }
    };

    // Get color for map layer
    const getLayerColor = useCallback(async (properties: any): Promise<string> => {
        if (!dateRange?.startDate || !dateRange?.endDate) {
            return PRODUCTION_COLOR_RANGES.ZERO.color;
        }

        const cacheKey = `${properties.COSTCENTER}-${moment(dateRange.startDate).format("YYYYMM")}-${moment(dateRange.endDate).format("YYYYMM")}`;

        // Check cache first
        if (colorCache.current.has(cacheKey)) {
            return colorCache.current.get(cacheKey)!;
        }

        try {
            const percentage = await getPersentase(
                properties.COSTCENTER,
                moment(dateRange.startDate).format("YYYYMM"),
                moment(dateRange.endDate).format("YYYYMM")
            );

            const color = getColorByPercentage(percentage);
            colorCache.current.set(cacheKey, color);
            return color;
        } catch (error) {
            console.error("Error getting percentage:", error);
            return PRODUCTION_COLOR_RANGES.ZERO.color;
        }
    }, [dateRange]);

    // Helper to get color based on percentage
    const getColorByPercentage = (percentage: number): string => {
        const range = Object.values(PRODUCTION_COLOR_RANGES).find(
            range => percentage >= range.min && percentage < range.max
        );
        return range?.color || PRODUCTION_COLOR_RANGES.ZERO.color;
    };

    // Clear cache when dateRange changes
    useEffect(() => {
        colorCache.current.clear();
    }, [dateRange]);

    return (
        <BaseMap
            mapType="produksi"
            geoJsonData={maplayer}
            fetchPopupData={fetchPopupData}
            getLayerColor={getLayerColor}
        />
    );
};

export default ProduksiMap;