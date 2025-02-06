// actions/admin/company.ts
"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import axios from "axios"

const serverAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

export async function getCompanies() {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.get("/api/perusahaan/raw", {
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

export async function getEstates() {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.get("/api/estate", {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data.data, error: null }
    } catch (error) {
        console.error("Error fetching estates:", error)
        return { data: null, error: "Failed to fetch estates" }
    }
}

export async function getDivisions() {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.get("/api/divisi", {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data.data, error: null }
    } catch (error) {
        console.error("Error fetching divisions:", error)
        return { data: null, error: "Failed to fetch divisions" }
    }
}

export async function createCompany(data: any) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.post("/api/perusahaan", data, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error creating company:", error)
        return { data: null, error: "Failed to create company" }
    }
}

export async function createEstate(data: any) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.post("/api/estate", data, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error creating estate:", error)
        return { data: null, error: "Failed to create estate" }
    }
}

export async function createDivision(data: any) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.post("/api/divisi", data, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error creating division:", error)
        return { data: null, error: "Failed to create division" }
    }
}

export async function updateCompany(id: string, data: any) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.patch(`/api/perusahaan/${id}`, data, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error updating company:", error)
        return { data: null, error: "Failed to update company" }
    }
}

export async function updateEstate(id: string, data: any) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.patch(`/api/estate/${id}`, data, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error updating estate:", error)
        return { data: null, error: "Failed to update estate" }
    }
}

export async function updateDivision(id: string, data: any) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.patch(`/api/divisi/${id}`, data, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { data: response.data, error: null }
    } catch (error) {
        console.error("Error updating division:", error)
        return { data: null, error: "Failed to update division" }
    }
}

export async function deleteCompany(id: string) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        await serverAxios.delete(`/api/perusahaan/${id}`, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { success: true, error: null }
    } catch (error) {
        console.error("Error deleting company:", error)
        return { success: false, error: "Failed to delete company" }
    }
}

export async function deleteEstate(id: string) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        await serverAxios.delete(`/api/estate/${id}`, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { success: true, error: null }
    } catch (error) {
        console.error("Error deleting estate:", error)
        return { success: false, error: "Failed to delete estate" }
    }
}

export async function deleteDivision(id: string) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        await serverAxios.delete(`/api/divisi/${id}`, {
            headers: {
                Authorization: `Bearer ${session.user.token}`
            }
        })

        return { success: true, error: null }
    } catch (error) {
        console.error("Error deleting division:", error)
        return { success: false, error: "Failed to delete division" }
    }
}