"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import axios from "axios"

const serverAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

export async function getCompaniesByRole(perusahaan: string, role: string) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            throw new Error("Unauthorized")
        }

        const response = await serverAxios.post("/api/perusahaan/role", {
            perusahaan,
            role
        },
            {
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