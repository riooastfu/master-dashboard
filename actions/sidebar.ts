"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import axios from "axios"

const serverAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

export const getNavigation = async () => {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.get("/api/navigation", {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data.data, error: null }
    }
    catch (error) {
        console.error("Error fetching navigation:", error)
        return { data: null, error: "Failed to fetch navigation" }
    }
}

export const getNavigationRole = async (id: string) => {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.get(`api/navigation/${id}`, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data.data, error: null }
    }
    catch (error) {
        console.error("Error fetching navigation:", error)
        return { data: null, error: "Failed to fetch navigation" }
    }
}