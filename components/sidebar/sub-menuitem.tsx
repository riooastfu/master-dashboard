import Link from "next/link";
import { SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "../ui/sidebar";
import React from "react";

// components/SubMenuItems.tsx
interface SubMenuItemsProps {
    items?: Array<{ title: string; url: string }>;
    parentUrl: string;
    pathname: string;
}

const SubMenuItems = ({ items, parentUrl, pathname }: SubMenuItemsProps) => {
    const constructUrl = (pathname: string, parentUrl: string, itemUrl: string) => {
        const base = pathname.split("/")[1];
        return `/${base}${parentUrl}${itemUrl}`;
    };

    return (
        <SidebarMenuSub>
            {items?.map((item) => (
                <SidebarMenuSubItem key={item.title}>
                    <SidebarMenuSubButton asChild>
                        <Link href={constructUrl(pathname, parentUrl, item.url)}>
                            {item.title}
                        </Link>
                    </SidebarMenuSubButton>
                </SidebarMenuSubItem>
            ))}
        </SidebarMenuSub>
    );
};

export default React.memo(SubMenuItems);