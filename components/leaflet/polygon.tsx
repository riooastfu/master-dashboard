"use client";

import "leaflet/dist/leaflet.css";
import { Polygon, PolygonProps } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";


interface CustomPolygonProps extends Omit<PolygonProps, "positions"> {
    positions: LatLngExpression[] | LatLngTuple[][];
    color?: string;
    fillColor?: string;
    fillOpacity?: number;
}

export const CustomPolygon: React.FC<CustomPolygonProps> = ({
    positions,
    color = "purple", // Default outline color
    fillColor = "blue", // Default fill color
    fillOpacity = 0.5, // Default fill opacity
    ...props
}) => {
    const pathOptions = { color, fillColor, fillOpacity };

    return <Polygon positions={positions} pathOptions={pathOptions} {...props} />;
};
