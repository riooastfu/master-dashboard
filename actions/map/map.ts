"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import axios from "axios"
import { MapType } from "@/types/map-types"

// Create a single instance of axios to use across all API calls
const serverAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

/**
 * Get authorization headers using the current session
 */
const getAuthHeaders = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error("Unauthorized");
    }

    return {
        Authorization: `Bearer ${session.user.token}`
    };
};

/**
 * Get aktivitas by role
 */
export async function getAktivitasByRole(roleId: string) {
    try {
        const headers = await getAuthHeaders();

        const response = await serverAxios.get(`/api/aktivitas/role/${roleId}`, {
            headers
        });

        return { data: response.data.data, error: null };
    } catch (error) {
        console.error("Error fetching activities by role:", error);
        return { data: null, error: "Failed to fetch activities" };
    }
}

/**
 * Get percentage for aktivitas map
 */
export const getPersentase = async (
    fullBlockCode: string,
    tanggal_mulai: string,
    tanggal_akhir: string,
    activityCode: string
) => {
    try {
        const headers = await getAuthHeaders();

        // Check if activityCode is provided
        if (!activityCode) {
            console.warn("Activity code is empty");
            return 0;
        }

        const response = await serverAxios.post(`/api/aktivitas/persentase`,
            {
                fullBlockCode,
                tglAwal: tanggal_mulai,
                tglAkhir: tanggal_akhir,
                activityCode
            },
            { headers }
        );

        return response.data.percentage;
    } catch (error) {
        console.error("Error fetching persentase:", error);
        return 0;
    }
};

/**
 * Fetch popup data based on map type
 */
export const fetchPopupData = async (
    fullBlockCode: string,
    tanggal_mulai: string,
    tanggal_akhir: string,
    mapType: MapType,
    activityCode?: string
) => {
    try {
        const headers = await getAuthHeaders();

        let endpoint = '';
        const payload: any = {
            fullBlockCode,
            tglAwal: tanggal_mulai,
            tglAkhir: tanggal_akhir
        };

        // Set the appropriate endpoint based on map type
        switch (mapType) {
            case 'produksi':
                endpoint = '/api/produksi/produksi/popup';
                break;
            case 'rotasi':
                endpoint = '/api/rotasi/popup';
                break;
            case 'aktivitas':
                endpoint = '/api/aktivitas/popup';
                // Add activity code for aktivitas map type
                if (activityCode) {
                    payload.activityCode = activityCode;
                }
                break;
            default:
                endpoint = '/api/produksi/produksi/popup';
        }

        const response = await serverAxios.post(
            endpoint,
            payload,
            { headers }
        );

        return response.data.data;
    } catch (error) {
        console.error(`Error fetching popup data for ${mapType}:`, error);
        return null;
    }
};

/**
 * Get map color data based on map type
 */
export const getMapColor = async (
    properties: any,
    mapType: MapType,
    tanggal_mulai: string,
    tanggal_akhir: string,
    activityCode?: string
) => {
    try {
        const headers = await getAuthHeaders();
        const fullBlockCode = properties.COSTCENTER;

        let endpoint = '';
        const payload: any = {
            fullBlockCode,
            tglAwal: tanggal_mulai,
            tglAkhir: tanggal_akhir
        };

        // Configure endpoint and payload based on map type
        switch (mapType) {
            case 'produksi':
                endpoint = '/api/produksi/persentase';
                break;
            case 'rotasi':
                endpoint = '/api/rotasi/persentase';
                break;
            case 'aktivitas':
                endpoint = '/api/aktivitas/persentase';
                if (activityCode) {
                    payload.activityCode = activityCode;
                }
                break;
            default:
                return '#FFFFFF'; // Default color
        }

        const response = await serverAxios.post(
            endpoint,
            payload,
            { headers }
        );

        return response.data.percentage;
    } catch (error) {
        console.error(`Error getting color data for ${mapType}:`, error);
        return 0;
    }
};