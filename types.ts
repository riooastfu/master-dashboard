export type UserProps = {
    id: string;
    employid: number;
    username: string;
    perusahaanId: string;
    perusahaan: string;
    estateId: string;
    estate: string;
    divisiId: string;
    divisi: string;
    roles: string;
}

export type RoleProps = {
    id: number;
    role: string;
    description: string;
    auth_menu: string;
    created_by: string;
}

export type NavigationProps = {
    id: number
    title: string
    url: string
    parent_menu_id: number | null
    icon: string | null
    is_active: number
    mode: string
    show: number
    menu: string
}

export type RoleNavigationProps = {
    roleId: number;
    navigationId: number;
}

// types/index.ts
export type CompanyProps = {
    id: string
    kode: string
    no_urut: number
    description: string
}

export type EstateProps = {
    id: string
    kode: string
    no_urut: number
    description: string
    perusahaanId: string  // Reference to parent company
}

export type DivisionProps = {
    id: string
    kode: string
    no_urut: number
    description: string
    estateId: string      // Reference to parent estate
}

export enum MenuTypes {
    GIS = 'gis',
    PASTIPLANT = 'pastiplant',
    ADMIN = 'admin'
}

export type MenuItemProps = {
    title: string;
    url: string;
    icon?: string;
    is_active?: boolean;
    mode: 'title' | 'link';
    menu: MenuTypes;
    nav_items?: {
        title: string;
        url: string;
    }[];
}

export type ActivityProps = {
    id: number;
    kode: string;
    description: string;
}