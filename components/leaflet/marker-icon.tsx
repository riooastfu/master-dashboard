"use client"

import 'leaflet/dist/leaflet.css';
import { Marker } from "react-leaflet";
import { Card } from "../ui/card";
import L, { LatLngExpression } from "leaflet";

interface MarkerProps {
    position: LatLngExpression;
    iconUrl?: string; // Optional custom icon URL
    iconSize?: [number, number]; // Optional custom icon size
}

export const MarkerIcon: React.FC<MarkerProps> = ({ position, iconUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png", iconSize = [25, 41], ...props }) => {
    const customIcon = L.icon({
        iconUrl,
        iconSize,
        iconAnchor: [12, 41],
        popupAnchor: [0, -41]
    })
    return (
        <Marker position={position} icon={customIcon} {...props} />
    )
};
