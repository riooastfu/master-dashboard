import useAxiosAuth from "@/hooks/use-axios-auth";

const useApi = () => {
    const axiosAuth = useAxiosAuth();

    const getPersentase = async (fullBlockCode: string) => {
        try {
            const response = await axiosAuth.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/produksi/budget`, {
                fullBlockCode: fullBlockCode,
                tglAwal: '202401',
                tglAkhir: '202411'
            });

            return response.data.percentage

        } catch (error) {
            return null
        }
    }

    const getPerusahaan = async () => {
        try {
            const response = await axiosAuth.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/perusahaan/`);

            return response.data.data

        } catch (error) {
            return null
        }
    }

    const getPerusahaanById = async (id: string) => {
        try {
            const response = await axiosAuth.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/perusahaan/${id}`);

            return response.data.data

        } catch (error) {
            return null
        }
    }

    return {
        getPersentase,
        getPerusahaan,
        getPerusahaanById
    };
};

export default useApi;