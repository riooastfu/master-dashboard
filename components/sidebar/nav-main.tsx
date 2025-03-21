"use client";

import {
    SidebarGroup,
    SidebarMenu,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useMainMenu } from "@/hooks/use-main-menu";
import { useMemo } from "react";
import { MenuItemProps } from "@/types/types";
import CollapsibleMenuItem from "./collapsible-menuitem";
import StandardMenuItem from "./standard-menuitem";


const NavMain = ({ items }: { items: MenuItemProps[] }) => {
    const pathname = usePathname();
    const { type } = useMainMenu();

    const filteredItems = useMemo(() =>
        items?.filter(item => type === item.menu),
        [items, type]
    );

    if (!filteredItems?.length) return null;

    return (
        <SidebarGroup>
            <SidebarMenu>
                {filteredItems.map((item) => (
                    item.mode === 'title'
                        ? <CollapsibleMenuItem key={item.title} item={item} pathname={pathname} />
                        : <StandardMenuItem key={item.title} item={item} pathname={pathname} />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
};

export default NavMain;
