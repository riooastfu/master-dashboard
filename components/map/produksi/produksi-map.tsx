"use client"

// ProduksiMap.tsx
import React, { useCallback, useEffect, useRef } from 'react';
import moment from 'moment-timezone';
import BaseMap from '../base-map';
import { getPersentase } from '@/actions/produksi';
import maplayer from '@/public/geojson/map.json';
import { useMapStore } from '@/hooks/use-map-store';
import useAxiosAuth from '@/hooks/use-axios-auth';
import { PRODUCTION_COLOR_RANGES } from '@/types/map-types';

const getColorByPercentage = (percentage: number): string => {
    const range = Object.values(PRODUCTION_COLOR_RANGES).find(
        range => percentage >= range.min && percentage < range.max
    );
    return range?.color || PRODUCTION_COLOR_RANGES.ZERO.color;
};

const ProduksiMap = () => {
    const axiosAuth = useAxiosAuth();
    const { dateRange } = useMapStore(); // Get dateRange from the store
    const colorCache = useRef<Map<string, string>>(new Map());

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

    const renderPopupContent = (data: any) => {
        return `
            <div class="max-w-sm">
            <table class="w-full border-collapse" style="border: 1px solid #3b3b3b;">
                <tr style="background-color: #f9fafb;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Estate</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.estate}</td>
                </tr>
                <tr>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Divisi</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.divisi}</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Blok</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.blok}</td>
                </tr>
                <tr>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Th Tanam</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.thn_tanam}</td>
                    </tr>
                <tr style="background-color: #f9fafb;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Periode</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${moment(dateRange?.startDate).format("MMM YYYY")} - ${moment(dateRange?.endDate).format("MMM YYYY")}</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Budget Produksi</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.budget_produksi} ton</td>
                    </tr>
                <tr>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Actual Produksi</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.aktual_produksi} ton</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Pencapaian</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.pencapaian}%</td>
                </tr>
                <tr>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Luas Tertanam</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.luas_tanam} ha</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Ton/ha</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.tonha} ton</td>
                </tr>
                <tr>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>SKU</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.sku}</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>BHL</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.bhl}</td>
                </tr>
                <tr>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>HK</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.hk}</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Ton/HK</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.tonhk} ton</td>
                </tr>
            </table>
        </div>
        `;
    };

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
    }, [dateRange, axiosAuth]);

    // Clear cache when dateRange changes
    useEffect(() => {
        colorCache.current.clear();
    }, [dateRange]);

    return (
        <BaseMap
            mapType="produksi"
            geoJsonData={maplayer}
            fetchPopupData={fetchPopupData}
            renderPopupContent={renderPopupContent}
            getLayerColor={getLayerColor}
        />
    );
};

export default ProduksiMap;