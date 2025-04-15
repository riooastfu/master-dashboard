"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import axios from "axios"

const serverAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

export const getPersentase = async (fullBlockCode: string, tanggal_mulai: string, tanggal_akhir: string) => {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }
        const response = await serverAxios.post(`/api/produksi/budget`, {
            fullBlockCode: fullBlockCode,
            tglAwal: tanggal_mulai,
            tglAkhir: tanggal_akhir
        },
            {
                headers: {
                    Authorization: `Bearer ${session.user.token}`
                }
            });

        return { data: response.data.percentage, error: null }

    } catch (error) {
        console.error("Error fetching persentase:", error)
        return { data: null, error: "Failed to fetch persentase" }
    }
}

export const getPopUpData = async (fullBlockCode: string, tglAwal: string, tglAkhir: string) => {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.post(`/api/produksi/produksi/popup`, {
            fullBlockCode: fullBlockCode,
            tglAwal,
            tglAkhir
        }
        );

        return { data: response.data.data, error: null }
    } catch (error) {
        console.error("Error fetching popup data:", error);
        return { data: null, error: "Failed to fetch popup data" }
    }
}

