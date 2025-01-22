"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import axios from "axios"

// Create a server-side axios instance
const serverAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

export async function getUsers() {
    try {
        // Get session on the server side
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.get("/api/user", {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error fetching users:", error)
        return { data: null, error: "Failed to fetch users" }
    }
}

export async function getPerusahaan() {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.get("/api/perusahaan", {
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

export async function deleteUser(userId: string) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        await serverAxios.delete(`/api/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { success: true, error: null }
    } catch (error) {
        console.error("Error deleting user:", error)
        return { success: false, error: "Failed to delete user" }
    }
}

export async function createUser(userData: any) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.post("/api/user", userData, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error creating user:", error)
        return { data: null, error: "Failed to create user" }
    }
}

export async function updateUser(userId: string, userData: any) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.patch(`/api/user/${userId}`, userData, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error updating user:", error)
        return { data: null, error: "Failed to update user" }
    }
}