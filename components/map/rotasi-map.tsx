"use client"

import CustomMapContainer from "../leaflet/map"

import React from 'react'
import ModalButton from "../modals/modal-button"

const RotasiMap = () => {
    return (
        <CustomMapContainer>
            <ModalButton type={"rotasi"} className="m-3 top-0 right-0 z-[1000] absolute" />
        </CustomMapContainer>
    )
}

export default RotasiMap