"use client"

import React, { useCallback, useEffect, useRef } from 'react'
import BaseMap from '../base-map'
import maplayer from '@/public/geojson/map.json';
import moment from 'moment-timezone';
import useAxiosAuth from '@/hooks/use-axios-auth';
import { ACTIVITY_COLOR_RANGES } from '@/types/map-types';
import { getPersentase } from '@/actions/aktivitas/aktivitas';

// Import the specific stores needed
import { useDateRangeStore } from '@/hooks/map-hooks/date-range-store';
import { useAktivitasMapStore } from '@/hooks/map-hooks/aktivitas-map-store';

const getColorByPercentage = (percentage: number): string => {
    const range = Object.values(ACTIVITY_COLOR_RANGES).find(
        range => percentage >= range.min && percentage < range.max
    );
    return range?.color || ACTIVITY_COLOR_RANGES.ZERO.color;
};

const AktivitasMap = () => {
    const axiosAuth = useAxiosAuth();

    // Use specific stores instead of the monolithic store
    const { dateRange } = useDateRangeStore();
    const { activityCode } = useAktivitasMapStore();

    const colorCache = useRef<Map<string, string>>(new Map());

    const fetchPopupData = async (costCenter: string, dateRange: any) => {
        if (!dateRange?.startDate || !dateRange?.endDate) return null;

        const tglAwal = moment(dateRange.startDate).format("YYYYMM");
        const tglAkhir = moment(dateRange.endDate).format("YYYYMM");

        try {
            const response = await axiosAuth.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/aktivitas/popup`,
                { fullBlockCode: costCenter, tglAwal, tglAkhir, activityCode }
            );
            return response.data.data;
        } catch (error) {
            console.error("Error fetching popup data:", error);
            return null;
        }
    };

    const getLayerColor = useCallback(async (properties: any): Promise<string> => {
        if (!dateRange?.startDate || !dateRange?.endDate) {
            return ACTIVITY_COLOR_RANGES.ZERO.color;
        }

        const cacheKey = `${properties.COSTCENTER}-${moment(dateRange.startDate).format("YYYYMM")}-${moment(dateRange.endDate).format("YYYYMM")}-${activityCode}`;

        // Check cache first
        if (colorCache.current.has(cacheKey)) {
            return colorCache.current.get(cacheKey)!;
        }

        try {
            const result = await getPersentase(
                properties.COSTCENTER,
                moment(dateRange.startDate).format("YYYYMM"),
                moment(dateRange.endDate).format("YYYYMM"),
                activityCode
            );

            // Check if result is an error object
            if (result && typeof result === 'object' && 'error' in result) {
                console.error("Error getting percentage:");
                return ACTIVITY_COLOR_RANGES.ZERO.color;
            }

            // Now we know result is a number
            const percentage = result as number;
            const color = getColorByPercentage(percentage);
            colorCache.current.set(cacheKey, color);
            return color;
        } catch (error) {
            console.error("Error getting percentage:", error);
            return ACTIVITY_COLOR_RANGES.ZERO.color;
        }
    }, [dateRange, activityCode]);

    // Clear cache when dateRange or activityCode changes
    useEffect(() => {
        colorCache.current.clear();
    }, [dateRange, activityCode]);

    return (
        <BaseMap
            mapType="aktivitas"
            geoJsonData={maplayer}
            fetchPopupData={fetchPopupData}
            getLayerColor={getLayerColor}
        />
    )
}

export default AktivitasMap