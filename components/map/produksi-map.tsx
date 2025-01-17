"use client";

import React, { useEffect, useRef, useState } from "react";
import moment from "moment-timezone";
import { GeoJSON, Popup, useMap } from "react-leaflet";
import CustomMapContainer from "../leaflet/map";
import ModalButton from "../modals/modal-button";
import useAxiosAuth from "@/hooks/use-axios-auth";
import { getPersentase } from "@/actions/produksi";
import { coordinateMap } from "./config-map";
import cus from "@/public/geojson/CUS/CUS.json";
import { useModalStore } from "@/hooks/use-modal-store";

interface PopupData {
    estate: string;
    divisi: string;
    blok: string;
    thn_tanam: number;
    budget_produksi: string;
    aktual_produksi: string;
    pencapaian: string;
    sku: number;
    bhl: number;
    hk: number;
    tonhk: number;
    luas_tanam: string;
    tonha: string;
}

interface LayerColors {
    [key: string]: string;
}

const getColorByPercentage = (percentage: number): string => {
    if (percentage <= 0) return "#FFF";
    if (percentage <= 80) return "#f55142";
    if (percentage <= 90) return "#f752b0";
    if (percentage <= 100) return "#f5d742";
    if (percentage <= 110) return "#42adf5";
    return "#9cf542";
};

const FlyToOnCheckbox = ({ coords }: { coords: [number, number] }) => {
    const map = useMap();

    useEffect(() => {
        if (coords) {
            map.flyTo(coords, 12);
        }
    }, [coords, map]);

    return null;
};

const ProduksiMap = () => {
    const produksiGeoJsonRef = useRef<any>(null);

    const axiosAuth = useAxiosAuth();
    const { selected, setUpdateStyles, dateRange } = useModalStore()

    const [layerColors, setLayerColors] = useState<LayerColors>({});
    const [popupData, setPopupData] = useState<PopupData | null>(null);

    const setColor = ({ properties }: any) => ({
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5,
        fillColor: layerColors[properties.COSTCENTER] || "#FFF",
    });

    const filterFeatures = (feature: any) => {
        const { Estate: estate, Divisi: divisi } = feature.properties;
        const key = `checkbox-CUS-${estate}${divisi ? `-DIV${String(divisi).padStart(2, "0")}` : ""}`;
        return selected[key] || false;
    };

    const fetchPopupData = async (COSTCENTER: string) => {
        if (!dateRange?.startDate || !dateRange?.endDate) return null;

        const tglAwal = moment(dateRange.startDate).format("YYYYMM");
        const tglAkhir = moment(dateRange.endDate).format("YYYYMM");

        try {
            const response = await axiosAuth.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/produksi/produksi/popup`, {
                fullBlockCode: COSTCENTER,
                tglAwal,
                tglAkhir,
            });
            return response.data.data as PopupData;
        } catch (error) {
            console.error("Error fetching popup data:", error);
            return null;
        }
    };

    const onEachFeature = (feature: any, layer: any) => {
        layer.on({
            click: async () => {
                const popupData = await fetchPopupData(feature.properties.COSTCENTER);
                if (popupData) {
                    setPopupData(popupData);
                    layer.bindPopup(renderPopupContent(popupData)).openPopup();
                }
            },
        });
    };

    const renderPopupContent = (data: PopupData) => `
        <div>
            <table style="width:100%; border-collapse: collapse; border: 1px solid black;">
                <tr style="background-color: #f2f2f2;">
                    <td style="border: 1px solid black;"><strong>Estate</strong></td>
                    <td style="border: 1px solid black;">${data.estate}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black;"><strong>Divisi</strong></td>
                    <td style="border: 1px solid black;">${data.divisi}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <td style="border: 1px solid black;"><strong>Blok</strong></td>
                    <td style="border: 1px solid black;">${data.blok}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black;"><strong>Th Tanam</strong></td>
                    <td style="border: 1px solid black;">${data.thn_tanam}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black;"><strong>Budget Produksi</strong></td>
                    <td style="border: 1px solid black;">${data.budget_produksi} ton</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <td style="border: 1px solid black;"><strong>Actual Produksi</strong></td>
                    <td style="border: 1px solid black;">${data.aktual_produksi} ton</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black;"><strong>Pencapaian</strong></td>
                    <td style="border: 1px solid black;">${data.pencapaian}%</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <td style="border: 1px solid black;"><strong>SKU</strong></td>
                    <td style="border: 1px solid black;">${data.sku}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black;"><strong>BHL</strong></td>
                    <td style="border: 1px solid black;">${data.bhl}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <td style="border: 1px solid black;"><strong>HK</strong></td>
                    <td style="border: 1px solid black;">${data.hk}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black;"><strong>Ton/HK</td>
                    <td style="border: 1px solid black;">${data.tonhk} ton</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <td style="border: 1px solid black;"><strong>Luas Tertanam</strong></td>
                    <td style="border: 1px solid black;">${data.luas_tanam} ha</td>
                </tr>
                <tr>
                    <td style="border: 1px solid black;"><strong>Ton/ha</td>
                    <td style="border: 1px solid black;">${data.tonha} ton</td>
                </tr>
            </table>
        </div>
    `;

    useEffect(() => {
        const updateStyles = async (startDate: string, endDate: string) => {
            if (!produksiGeoJsonRef.current) return;

            const newColors: LayerColors = {};
            const layers = produksiGeoJsonRef.current.getLayers();

            const promises = layers.map(async (layer: any) => {
                const { COSTCENTER } = layer.feature.properties;
                const percentage = await getPersentase(
                    COSTCENTER,
                    moment(startDate).format("YYYYMM"),
                    moment(endDate).format("YYYYMM")
                );
                newColors[COSTCENTER] = getColorByPercentage(percentage);
            });

            await Promise.all(promises);
            setLayerColors(newColors);
        };

        setUpdateStyles(updateStyles);
    }, [setUpdateStyles]);

    return (
        <CustomMapContainer>
            <ModalButton type="produksi" className="m-3 top-0 right-0 z-[1000] absolute" />

            {Object.entries(coordinateMap).map(([key, coords]) =>
                selected[key] ? <FlyToOnCheckbox key={key} coords={coords} /> : null
            )}

            <GeoJSON
                key={`${JSON.stringify(selected)}-${dateRange?.startDate}-${dateRange?.endDate}`}
                data={cus as any}
                style={setColor}
                filter={filterFeatures}
                ref={produksiGeoJsonRef}
                onEachFeature={onEachFeature}
            />
        </CustomMapContainer>
    );
};

export default ProduksiMap;
