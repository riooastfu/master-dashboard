import { axiosAuth } from "@/lib/axios";

export const getNavigation = async () => {
    try {
        const nav = await axiosAuth.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/navigation`);

        if (nav.data) {
            return nav.data.data
        }
    }
    catch (error) {
        return null
    }
}

export const getNavigationRole = async (id?: string) => {
    try {
        const nav = await axiosAuth.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/navigation/${id}`);


        if (nav.data) {
            return nav.data.data
        }
    }
    catch (error) {
        return null
    }
}