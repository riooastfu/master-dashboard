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