import { axiosAuth } from "@/lib/axios";

export const getPerusahaan = async () => {
    try {
        const perusahaan = await axiosAuth.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/perusahaan`);

        if (perusahaan.data) {
            return perusahaan.data.data
        }
    }
    catch (error) {
        return null
    }
}