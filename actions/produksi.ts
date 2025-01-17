import { axiosAuth } from "@/lib/axios";
import moment from 'moment-timezone';

export const getPersentase = async (fullBlockCode: string, tanggal_mulai: string, tanggal_akhir: string) => {
    try {


        const response = await axiosAuth.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/produksi/budget`, {
            fullBlockCode: fullBlockCode,
            tglAwal: tanggal_mulai,
            tglAkhir: tanggal_akhir
        });

        return response.data.percentage

    } catch (error) {
        return null
    }
}
