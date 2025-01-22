"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import axios from "axios"

// Create a server-side axios instance
const serverAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

export async function getRoles() {
    try {
        // Get session on the server side
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.get("/api/role", {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error fetching roles:", error)
        return { data: null, error: "Failed to fetch roles" }
    }
}

export async function createRole(roleData: any) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.post("/api/role", roleData, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error fetching roles:", error)
        return { data: null, error: "Failed to fetch roles" }
    }
}

export async function deleteRole(roleId: number) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        await serverAxios.delete(`/api/role/delete/${roleId}`, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { success: true, error: null }
    } catch (error) {
        console.error("Error deleting role:", error)
        return { success: false, error: "Failed to delete role" }
    }
}

export async function updateRole(roleId: number, roleData: any) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.patch(`/api/role/update/${roleId}`, roleData, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error updating role:", error)
        return { data: null, error: "Failed to update role" }
    }
}

export async function getUsersRoles() {
    try {
        // Get session on the server side
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.get("/api/role/user", {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error fetching users roles:", error)
        return { data: null, error: "Failed to fetch users roles" }
    }
}

export async function updateUserRoles(userId: string, roleIds: number[]) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.post("/api/role/assign", {
            userId,
            roleIds
        }, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error updating user roles:", error)
        return { data: null, error: "Failed to update user roles" }
    }
}

