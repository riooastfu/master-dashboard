"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import axios from "axios"

const serverAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

export const getDataRotasi = async (fullBlockCode: string, tglAwal: string) => {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.post("/api/rotasi", {
            fullBlockCode,
            tglAwal
        },
            {
                headers: {
                    Authorization: `Bearer ${session.user.token}`
                }
            })

        return { data: response.data[0], error: null }
    } catch (error: any) {
        console.error("Error fetching data rotasi:", error.response.status)
        return { data: null, error: "Failed to fetch data rotasi" }
    }
}

export const getPopUpData = async (fullBlockCode: string, tglAwal: string) => {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.post(`/api/rotasi/popup`, {
            fullBlockCode,
            tglAwal
        });

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error fetching popup data:", error);
        return { data: null, error: "Failed to fetch popup data" }
    }
}
