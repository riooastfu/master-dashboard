// /lib/withSession.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import axios from "axios";

// Create a session cache
let sessionCache: any = null;
let sessionExpiry: number | null = null;
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export const serverAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

// Higher order function to wrap API calls with session checking
export const withSession = async <T>(apiCall: () => Promise<T>): Promise<T> => {
    const currentTime = Date.now();

    // Check if we need to refresh the session
    if (!sessionCache || !sessionExpiry || currentTime > sessionExpiry) {
        sessionCache = await getServerSession(authOptions);
        sessionExpiry = currentTime + SESSION_TIMEOUT;
    }

    if (!sessionCache) {
        throw new Error("Unauthorized");
    }

    return apiCall();
}