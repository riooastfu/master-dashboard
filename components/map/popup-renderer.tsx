import React from 'react';
import { MapType } from '@/types/map-types';
import moment from 'moment-timezone';

// Helper function to get estate name based on code
const getEstateName = (kode_estate: string): string => {
    switch (kode_estate) {
        case "0601": return "MABALI1";
        case "0602": return "MABALI2";
        case "0603": return "MABALI3";
        case "1201": return "TERONG";
        case "1202": return "MENTABE";
        case "1204": return "PINANG";
        case "0801": return "ASDE";
        case "0802": return "AAPE";
        case "0803": return "KBE";
        case "0701": return "SRE";
        case "0702": return "ASE";
        case "0703": return "ALE";
        case "0201": return "AK";
        case "0203": return "ABR";
        case "0204": return "AS";
        case "0301": return "SKK";
        case "0501": return "ST";
        case "0502": return "SS";
        default: return "NOT FOUND";
    }
};

// Common header for all popup types
const generateCommonHeader = (data: any, dateRange: any) => {
    const estate = getEstateName(data.estate);
    const periodDisplay = dateRange?.startDate && dateRange?.endDate
        ? `${moment(dateRange.startDate).format("MMM YYYY")} - ${moment(dateRange.endDate).format("MMM YYYY")}`
        : 'N/A';

    return `
        <tr style="background-color: #d4d4d4;">
            <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Estate</strong></td>
            <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${estate}</td>
        </tr>
        <tr>
            <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Divisi</strong></td>
            <td class="text-[14px]" style="border: 1px solid #3b3b3b;">DIV ${data.divisi}</td>
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
            <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${periodDisplay}</td>
        </tr>
    `;
};

// Production-specific popup content
const renderProduksiPopup = (data: any, dateRange: any) => {
    const commonHeader = generateCommonHeader(data, dateRange);

    return `
        <div class="max-w-sm">
            <table class="w-full border-collapse" style="border: 1px solid #3b3b3b;">
                ${commonHeader}
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

// Rotation-specific popup content
const renderRotasiPopup = (data: any, dateRange: any) => {
    const commonHeader = generateCommonHeader(data, dateRange);

    return `
        <div class="max-w-sm">
            <table class="w-full border-collapse" style="border: 1px solid #3b3b3b;">
                ${commonHeader}
                <tr style="background-color: #d4d4d4;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Luas Area</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.luas_tanam} ha</td>
                </tr>
                <tr>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Rotasi Ke</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.rotasi || 'N/A'}</td>
                </tr>
                <tr style="background-color: #d4d4d4;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Target Rotasi</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.target_rotasi || 'N/A'}</td>
                </tr>
                <tr>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Tanggal Mulai</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.tgl_mulai || 'N/A'}</td>
                </tr>
                <tr style="background-color: #d4d4d4;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Tanggal Selesai</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.tgl_selesai || 'N/A'}</td>
                </tr>
            </table>
        </div>
    `;
};

// Activity-specific popup content
const renderAktivitasPopup = (data: any, dateRange: any, activityCode: string) => {
    const commonHeader = generateCommonHeader(data, dateRange);

    return `
        <div class="max-w-sm">
            <table class="w-full border-collapse" style="border: 1px solid #3b3b3b;">
                ${commonHeader}
                <tr>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Luas Area</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.luas_tanam} ha</td>
                </tr>
                <tr>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Aktual Produksi</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.aktual_produksi} ton</td>
                </tr>
                <tr style="background-color: #d4d4d4;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Aktivitas</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.activity}</td>
                </tr>
                <tr style="background-color: #d4d4d4;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Deskripsi</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.activity_desc}</td>
                </tr>
                <tr style="background-color: #d4d4d4;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Budget HK</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.budgethk}</td>
                </tr>
                <tr style="background-color: #d4d4d4;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Aktual HK</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.actualhk}</td>
                </tr>
                <tr style="background-color: #d4d4d4;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Variance HK</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.variancehk}%</td>
                </tr>
                <tr style="background-color: #d4d4d4;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Budget HK/ha</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.budgethkha}</td>
                </tr>
                <tr style="background-color: #d4d4d4;">
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;"><strong>Aktual HK/ha</strong></td>
                    <td class="text-[14px]" style="border: 1px solid #3b3b3b;">${data.actualhkha}</td>
                </tr>
        </div>
    `;
};

// Main popup renderer function
export const renderPopupContent = (
    data: any,
    mapType: MapType,
    dateRange: any,
    activityCode: string = "",
    fallbackRenderer?: (data: any) => string
) => {
    if (!data) return '<div>No data available</div>';

    switch (mapType) {
        case 'produksi':
            return renderProduksiPopup(data, dateRange);
        case 'rotasi':
            return renderRotasiPopup(data, dateRange);
        case 'aktivitas':
            return renderAktivitasPopup(data, dateRange, activityCode);
        default:
            // Use fallback renderer if provided
            return fallbackRenderer ? fallbackRenderer(data) : '<div>Unknown map type</div>';
    }
};

export default {
    renderPopupContent,
    getEstateName
};