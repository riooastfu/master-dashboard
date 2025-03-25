"use client";

import { useEffect, useState } from "react";
import { ProduksiModal } from "../modals/produksi-modal";
import { RotasiModal } from "../modals/rotasi-modal";
import { AktivitasModal } from "../modals/aktivitas-modal";

export const ModalProvider = () => {
    const [isMounted, setisMounted] = useState(false);

    useEffect(() => {
        setisMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <ProduksiModal />
            <RotasiModal />
            <AktivitasModal />
        </>
    );
};
