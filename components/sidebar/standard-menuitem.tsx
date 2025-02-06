import { MenuItemProps } from "@/types";
import { ChevronRight, type LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import Link from "next/link";

const StandardMenuItem = ({ item, pathname }: { item: MenuItemProps; pathname: string }) => {
    const constructUrl = (pathname: string, itemUrl: string) => {
        const base = pathname.split("/")[1];
        return `/${base}${itemUrl}`;
    };
    const IconComponent = LucideIcons[item.icon as keyof typeof LucideIcons] as LucideIcon;
    const url = constructUrl(pathname, item.url);

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <Link href={url}>
                    {IconComponent ? <IconComponent /> : <ChevronRight />}
                    {item.title}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
};

export default StandardMenuItem