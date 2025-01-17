"use client"

import { usePathname, useRouter } from "next/navigation";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "../ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuShortcut } from "../ui/dropdown-menu";
import { ChevronsUpDown, GalleryVerticalEnd, Home, LogOut, Map, Palmtree } from "lucide-react";
import { redirect } from "next/navigation";
import { MenuType, useMainMenu } from "@/hooks/use-main-menu";
import { menuData } from "@/hooks/use-main-menu";
import { useSession } from "next-auth/react";
import { useEffect } from "react";


const NavHeader = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();
    const { onSwitch, type } = useMainMenu();
    const onClick = (nav: string) => {
        const type = nav.split('/')[1] as MenuType;
        onSwitch(type);
        router.replace(nav);
    }

    // Filter menu items based on user role
    const filteredMenuData = menuData.filter(item => {
        if (session?.user?.role !== 'admin') {
            return item.name.toLowerCase() !== 'admin';
        }
        return true;
    });

    // Sync menu type with URL on page load and navigation
    useEffect(() => {
        // Get the base route (e.g., /admin/usermanagement -> admin)
        const baseRoute = pathname.split('/')[1];

        // Only update if the current type doesn't match the URL
        if (baseRoute && type !== baseRoute) {
            onSwitch(baseRoute as MenuType);
        }
    }, [pathname, type, onSwitch]);
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <GalleryVerticalEnd className="size-4" />
                            </div>
                            <div className="flex flex-col gap-0.5 leading-none">
                                <span className="font-semibold">{type.toUpperCase()}</span>
                                <span className="">Dashboard</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" align="start">
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Dashboard</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {
                            filteredMenuData.map((item) => (
                                <DropdownMenuItem key={item.name} onClick={() => onClick(item.url)} className="gap-2 p-2">
                                    <div className="flex size-6 items-center justify-center rounded-sm border">
                                        {item.icon && <item.icon className="size-4 shrink-0" />}
                                    </div>
                                    {item.name}
                                    {/* <DropdownMenuShortcut>⌘1</DropdownMenuShortcut> */}
                                </DropdownMenuItem>
                            ))
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default NavHeader;