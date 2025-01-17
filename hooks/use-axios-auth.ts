"use client"

import { axiosAuth } from "@/lib/axios";
import { useSession } from "next-auth/react"
import { useEffect } from "react"

const useAxiosAuth = () => {
    const { data: session } = useSession();

    useEffect(() => {
        const reqIntercept = axiosAuth.interceptors.request.use((config) => {
            if (!config.headers["Authorization"]) {
                if (session) {
                    config.headers["Authorization"] = `Bearer ${session.user.token}`;
                }
            }

            return config
        });

        return () => {
            axiosAuth.interceptors.request.eject(reqIntercept);
        }
    }, [session]);

    return axiosAuth;
}

export default useAxiosAuth;