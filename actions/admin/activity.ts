"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import axios from "axios"

// Create a server-side axios instance
const serverAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

export async function getActivity() {
    try {
        // Get session on the server side
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.get("/api/aktivitas", {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data.data, error: null }
    } catch (error) {
        console.error("Error fetching aktivitas:", error)
        return { data: null, error: "Failed to fetch aktivitas" }
    }
}

export async function createActivity(activityData: any) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.post("/api/aktivitas", activityData, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error fetching activites:", error)
        return { data: null, error: "Failed to fetch activites" }
    }
}

export async function deleteActivity(activityId: number) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        await serverAxios.delete(`/api/aktivitas/${activityId}`, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { success: true, error: null }
    } catch (error) {
        console.error("Error deleting activity:", error)
        return { success: false, error: "Failed to delete activity" }
    }
}

export async function updateActivity(activityId: number, activityData: any) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.patch(`/api/aktivitas/${activityId}`, activityData, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error updating activity:", error)
        return { data: null, error: "Failed to update activity" }
    }
}

export async function assignRoleActivity(aktivitasData: { roleId: number, masterAktivitasId: number }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        await serverAxios.post(`/api/aktivitas/assign`, {
            roleId: aktivitasData.roleId,
            masterAktivitasId: aktivitasData.masterAktivitasId
        }, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { success: true, error: null }
    } catch (error) {
        console.error("Error assign role activity:", error)
        return { success: false, error: "Failed to assign role activity" }
    }
}

export async function deleteRoleActivity(activityData: { roleId: number, masterAktivitasId: number }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        await serverAxios.post(`/api/aktivitas/remove`, {
            roleId: activityData.roleId,
            masterAktivitasId: activityData.masterAktivitasId
        }, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { success: true, error: null }
    } catch (error) {
        console.error("Error deleting role activity:", error)
        return { success: false, error: "Failed to delete role activity" }
    }
}
