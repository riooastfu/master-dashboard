"use client"

import React from 'react';
import { MapContainer, TileLayer, useMap, MapContainerProps } from 'react-leaflet';

const CustomMapContainer: React.FC<MapContainerProps> = ({ children, ...props }) => {
    return (
        <MapContainer className='h-full z-0' center={[-6.227386, 106.807194]} zoom={15} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            {children}
        </MapContainer>
    )
}

export default CustomMapContainer