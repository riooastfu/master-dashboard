"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { menuData, MenuType, useMainMenu } from "@/hooks/use-main-menu";
import { useEffect } from "react";

interface ItemProps {
    title: string;
    url: string;
    icon?: string;
    is_active?: boolean;
    mode: string;
    menu: string;
    nav_items?: {
        title: string;
        url: string;
    }[];
}

const NavMain = ({ items }: { items: ItemProps[] }) => {
    const pathname = usePathname();
    const { type, onSwitch } = useMainMenu();

    useEffect(() => {
        const menuItem = menuData.find(item => item.url === location.pathname);
        if (menuItem) {
            onSwitch(menuItem.url.replace('/', '') as MenuType);
        }
    }, [pathname])

    return (
        <SidebarGroup>
            {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
            <SidebarMenu>
                {items?.map((item) => {
                    const IconComponent = LucideIcons[item.icon as keyof typeof LucideIcons] as LucideIcon;

                    return type === "gis" && item.menu === "gis" ?
                        item.mode === "title" ? (
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={item.is_active}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title}>
                                            {IconComponent ? (
                                                <IconComponent />
                                            ) : (
                                                <ChevronRight />
                                            )}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.nav_items?.map((subItem) => (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}
                                                >
                                                    <SidebarMenuSubButton asChild>
                                                        <Link
                                                            href={
                                                                "/" +
                                                                pathname.split(
                                                                    "/"
                                                                )[1] +
                                                                item.url +
                                                                subItem.url
                                                            }
                                                        >
                                                            {subItem.title}
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ) : (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link
                                        href={
                                            "/" +
                                            pathname.split("/")[1] +
                                            item.url
                                        }
                                    >
                                        {IconComponent ? (
                                            <IconComponent />
                                        ) : (
                                            <ChevronRight />
                                        )}
                                        {item.title}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                        : type === "pastiplant" && item.menu === "pastiplant" ?
                            item.mode === "title" ? (
                                <Collapsible
                                    key={item.title}
                                    asChild
                                    defaultOpen={item.is_active}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title}>
                                                {IconComponent ? (
                                                    <IconComponent />
                                                ) : (
                                                    <ChevronRight />
                                                )}
                                                <span>{item.title}</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.nav_items?.map((subItem) => (
                                                    <SidebarMenuSubItem
                                                        key={subItem.title}
                                                    >
                                                        <SidebarMenuSubButton asChild>
                                                            <Link
                                                                href={
                                                                    "/" +
                                                                    pathname.split(
                                                                        "/"
                                                                    )[1] +
                                                                    item.url +
                                                                    subItem.url
                                                                }
                                                            >
                                                                {subItem.title}
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ) : (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={
                                                "/" +
                                                pathname.split("/")[1] +
                                                item.url
                                            }
                                        >
                                            {IconComponent ? (
                                                <IconComponent />
                                            ) : (
                                                <ChevronRight />
                                            )}
                                            {item.title}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                            : type === "admin" && item.menu === "admin" ?
                                item.mode === "title" ? (
                                    <Collapsible
                                        key={item.title}
                                        asChild
                                        defaultOpen={item.is_active}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={item.title}>
                                                    {IconComponent ? (
                                                        <IconComponent />
                                                    ) : (
                                                        <ChevronRight />
                                                    )}
                                                    <span>{item.title}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.nav_items?.map((subItem) => (
                                                        <SidebarMenuSubItem
                                                            key={subItem.title}
                                                        >
                                                            <SidebarMenuSubButton asChild>
                                                                <Link
                                                                    href={
                                                                        "/" +
                                                                        pathname.split(
                                                                            "/"
                                                                        )[1] +
                                                                        item.url +
                                                                        subItem.url
                                                                    }
                                                                >
                                                                    {subItem.title}
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                ) : (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={
                                                    "/" +
                                                    pathname.split("/")[1] +
                                                    item.url
                                                }
                                            >
                                                {IconComponent ? (
                                                    <IconComponent />
                                                ) : (
                                                    <ChevronRight />
                                                )}
                                                {item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ) : null
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
};

export default NavMain;
