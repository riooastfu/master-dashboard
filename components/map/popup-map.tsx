"use client"

import useAxiosAuth from "@/hooks/use-axios-auth";
import { useModalForm } from "@/hooks/use-modal-form-store";

export const PopupProduksi = async ({ feature }: any) => {
    // const { formDate } = useModalForm();

    // const axiosAuth = useAxiosAuth()

    // const res = await axiosAuth.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/produksi/budget`, {
    //     fullBlockCode: feature.properties.COSTCENTER,
    //     tglAwal: formDate.tanggal_mulai,
    //     tglAkhir: formDate.tanggal_akhir
    // });
    return (
        <div>
            <table className="width:100%; border-collapse: collapse; border: 1px solid black;">
                <tr className="background-color: #f2f2f2;">
                    <td className="border: 1px solid black;"><strong>Estate</strong></td>
                    <td className="border: 1px solid black;">sa</td>
                </tr>
                <tr>
                    <td className="border: 1px solid black;"><strong>Divisi</strong></td>
                    <td className="border: 1px solid black;">{feature.properties.Divisi}</td>
                </tr>
                <tr className="background-color: #f2f2f2;">
                    <td className="border: 1px solid black;"><strong>Blok</strong></td>
                    <td className="border: 1px solid black;">{feature.properties.Blok}</td>
                </tr>
                <tr>
                    <td className="border: 1px solid black;"><strong>Th Tanam</strong></td>
                    <td className="border: 1px solid black;">{feature.properties.Th_Tanam}</td>
                </tr>
                <tr className="background-color: #f2f2f2;">
                    <td className="border: 1px solid black;"><strong>Periode</strong></td>
                    <td className="border: 1px solid black;">-</td>
                </tr>
            </table>
        </div>
    );
}