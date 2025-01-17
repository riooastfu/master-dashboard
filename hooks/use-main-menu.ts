import { LucideIcon, Shield } from "lucide-react";
import { Palmtree, Map } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MenuData {
    name?: string,
    url?: string,
    icon?: LucideIcon
}

interface MenuStore {
    type: MenuType,
    onSwitch: (type: MenuType, data?: MenuData) => void
}
export const menuData = [
    {
        name: "GIS",
        url: "/gis",
        icon: Map
    },
    {
        name: "PASTIPLANT",
        url: "/pastiplant",
        icon: Palmtree
    },
    {
        name: "ADMIN",
        url: "/admin",
        icon: Shield
    }
]

export type MenuType = "gis" | "pastiplant" | "admin" | "";


export const useMainMenu = create<MenuStore>()(
    persist(
        (set) => ({
            type: "",
            onSwitch: (type) => set({ type })
        }),
        {
            name: 'menu-storage'
        }
    )
)