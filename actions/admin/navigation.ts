"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import axios from "axios"

// Create a server-side axios instance
const serverAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

export async function getNavigations() {
    try {
        // Get session on the server side
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
    } catch (error) {
        console.error("Error fetching navigations:", error)
        return { data: null, error: "Failed to fetch navigations" }
    }
}

export async function getRoleNavigations() {
    try {
        // Get session on the server side
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.get("/api/navigation/role", {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data.data, error: null }
    } catch (error) {
        console.error("Error fetching role navigations:", error)
        return { data: null, error: "Failed to fetch role navigations" }
    }
}

export async function createNavigation(navigationData: any) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.post("/api/navigation", navigationData, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error fetching navigations:", error)
        return { data: null, error: "Failed to fetch navigations" }
    }
}

export async function updateNavigation(navigationId: number, navigationData: any) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.patch(`/api/navigation/${navigationId}`, navigationData, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error fetching navigations:", error)
        return { data: null, error: "Failed to fetch navigations" }
    }
}

export async function deleteNavigation(navigationId: number) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        await serverAxios.delete(`/api/navigation/${navigationId}`, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { success: true, error: null }
    } catch (error) {
        console.error("Error deleting navigation:", error)
        return { success: false, error: "Failed to delete navigation" }
    }
}

export async function deleteRoleNavigation(navigationData: any) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        // Ensure we're sending roleId and navigationId (not navId)
        await serverAxios.post(`/api/navigation/role`, {
            roleId: navigationData.roleId,
            navigationId: navigationData.navId // Convert navId to navigationId
        }, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { success: true, error: null }
    } catch (error) {
        console.error("Error deleting role navigation:", error)
        return { success: false, error: "Failed to delete role navigation" }
    }
}

export async function assignRoleNavigation(navigationData: any) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        // Ensure we're sending roleId and navigationId
        await serverAxios.post(`/api/navigation/assign`, {
            roleId: navigationData.roleId,
            navigationId: navigationData.navId // Convert navId to navigationId
        }, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { success: true, error: null }
    } catch (error) {
        console.error("Error assign role navigation:", error)
        return { success: false, error: "Failed to assign role navigation" }
    }
}