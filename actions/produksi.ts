import axios from "axios";

const serverAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

export const getPersentase = async (fullBlockCode: string, tanggal_mulai: string, tanggal_akhir: string) => {
    try {
        const response = await serverAxios.post(`/api/produksi/budget`, {
            fullBlockCode: fullBlockCode,
            tglAwal: tanggal_mulai,
            tglAkhir: tanggal_akhir
        });

        return response.data.percentage

    } catch (error) {
        return { error: "Error fetching persentase" }
    }
}
