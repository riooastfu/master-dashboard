"use client"

// ProduksiMap.tsx
import React, { useCallback, useEffect, useRef } from 'react';
import moment from 'moment-timezone';
import BaseMap from '../base-map';
import { getPersentase } from '@/actions/produksi';
import maplayer from '@/public/geojson/map.json';
import { useMapStore } from '@/hooks/map-hooks/use-map-store-compat';
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
        const kode_estate = data.estate;
        var estate;

        kode_estate == "0601" ? estate = "MABALI1"
            : kode_estate == "0602" ? estate = "MABALI2"
                : kode_estate == "0603" ? estate = "MABALI3"
                    : kode_estate == "1201" ? estate = "TERONG"
                        : kode_estate == "1202" ? estate = "MENTABE"
                            : kode_estate == "1204" ? estate = "PINANG"
                                : kode_estate == "0801" ? estate = "ASDE"
                                    : kode_estate == "0802" ? estate = "AAPE"
                                        : kode_estate == "0803" ? estate = "KBE"
                                            : kode_estate == "0701" ? estate = "SRE"
                                                : kode_estate == "0702" ? estate = "ASE"
                                                    : kode_estate == "0703" ? estate = "ALE"
                                                        : kode_estate == "0201" ? estate = "AK"
                                                            : kode_estate == "0203" ? estate = "ABR"
                                                                : kode_estate == "0204" ? estate = "AS"
                                                                    : kode_estate == "0301" ? estate = "SKK"
                                                                        : kode_estate == "0501" ? estate = "ST"
                                                                            : kode_estate == "0502" ? estate = "SS"
                                                                                : estate = "NOT FOUND"
        return `
            <div class="max-w-sm">
            <table class="w-full border-collapse" style="border: 1px solid #3b3b3b;">
                <tr style="background-color: #d4d4d4;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Estate</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${estate}</td>
                </tr>
                <tr>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Divisi</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.divisi}</td>
                </tr>
                <tr style="background-color: #d4d4d4;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Blok</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.blok}</td>
                </tr>
                <tr>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Th Tanam</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.thn_tanam}</td>
                    </tr>
                <tr style="background-color: #d4d4d4;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Periode</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${moment(dateRange?.startDate).format("MMM YYYY")} - ${moment(dateRange?.endDate).format("MMM YYYY")}</td>
                </tr>
                <tr style="background-color: #d4d4d4;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Budget Produksi</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.budget_produksi} ton</td>
                    </tr>
                <tr>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Actual Produksi</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.aktual_produksi} ton</td>
                </tr>
                <tr style="background-color: #d4d4d4;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Pencapaian</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.pencapaian}%</td>
                </tr>
                <tr>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Luas Tertanam</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.luas_tanam} ha</td>
                </tr>
                <tr style="background-color: #d4d4d4;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Ton/ha</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.tonha} ton</td>
                </tr>
                <tr>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>SKU</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.sku}</td>
                </tr>
                <tr style="background-color: #d4d4d4;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>BHL</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.bhl}</td>
                </tr>
                <tr>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>HK</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.hk}</td>
                </tr>
                <tr style="background-color: #d4d4d4;">
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