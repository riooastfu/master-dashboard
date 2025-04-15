"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import axios from "axios"

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

export const getPopUpData = async (fullBlockCode: string, tglAwal: string, tglAkhir: string, activityCode: string) => {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.post(`/api/aktivitas/popup`, {
            fullBlockCode,
            tglAwal,
            tglAkhir,
            activityCode
        }
        );

        return { data: response.data.data, error: null }
    } catch (error) {
        console.error("Error fetching popup data:", error);
        return { data: null, error: "Failed to fetch popup data" }
    }
}