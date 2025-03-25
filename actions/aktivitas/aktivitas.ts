"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import axios from "axios"
import { MapType } from "@/types/map-types"

const serverAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

export async function getAktivitasByRole(roleId: string) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.get(`/api/aktivitas/role/${roleId}`, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data.data, error: null }
    } catch (error) {
        console.error("Error fetching companies:", error)
        return { data: null, error: "Failed to fetch companies" }
    }
}

export const getPersentase = async (fullBlockCode: string, tanggal_mulai: string, tanggal_akhir: string, activityCode: string) => {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }
        // Check if activityCode is provided
        if (!activityCode) {
            console.warn("Activity code is empty");
            return 0; // Return 0 instead of an error object
        }

        const response = await serverAxios.post(`/api/aktivitas/persentase`, {
            fullBlockCode: fullBlockCode,
            tglAwal: tanggal_mulai,
            tglAkhir: tanggal_akhir,
            activityCode: activityCode
        },
            {
                headers: {
                    Authorization: `Bearer ${session.user.token}`
                }
            });


        return response.data.percentage;

    } catch (error) {
        console.error("Error fetching persentase:", error);
        return 0; // Return 0 instead of an error object
    }
}

// New function to fetch popup data based on map type
export const fetchPopupDataByMapType = async (
    fullBlockCode: string,
    tanggal_mulai: string,
    tanggal_akhir: string,
    mapType: MapType,
    activityCode?: string
) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            throw new Error("Unauthorized");
        }

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
            {
                headers: {
                    Authorization: `Bearer ${session.user.token}`
                }
            }
        );

        return response.data.data;
    } catch (error) {
        console.error(`Error fetching popup data for ${mapType}:`, error);
        return null;
    }
}