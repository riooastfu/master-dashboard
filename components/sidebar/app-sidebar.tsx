"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { AudioWaveform, BookOpen, Bot, ChevronsUpDown, Command, Frame, GalleryVerticalEnd, Home, LogOut, Map, PieChart, Settings, Settings2, SquareTerminal, User } from "lucide-react"

import NavHeader from "./nav-header";
import NavMain from "./nav-main";
import NavFooter from "./nav-footer";
import { useEffect, useState } from "react";
import useAxiosAuth from "@/hooks/use-axios-auth";
import { getNavigation, getNavigationRole } from "@/actions/sidebar";
import { useSession } from "next-auth/react";

interface NavProps {
    title: string
    url: string
    icon?: string
    is_active?: boolean
    nav_items?: {
        title: string
        url: string
    }
};


const AppSidebar = () => {
    const { data: session } = useSession();
    const [nav, setNav] = useState([]);

    // This is sample data.
    const data = {
        user: {
            name: "dlwlrma",
            role: "admin",
            avatar: "https://i.pinimg.com/originals/a9/00/49/a900494ac06bfb931efb6885c995c9ff.jpg",
        },
        navMain: [
            {
                title: "Playground",
                url: "#",
                icon: SquareTerminal,
                isActive: true,
                items: [
                    {
                        title: "History",
                        url: "/history",
                    },
                    {
                        title: "Starred",
                        url: "#",
                    },
                    {
                        title: "Settings",
                        url: "#",
                    },
                ],
            },
            {
                title: "Models",
                url: "#",
                icon: Bot,
                items: [
                    {
                        title: "Genesis",
                        url: "#",
                    },
                    {
                        title: "Explorer",
                        url: "#",
                    },
                    {
                        title: "Quantum",
                        url: "#",
                    },
                ],
            },
            {
                title: "Documentation",
                url: "#",
                icon: BookOpen,
                items: [
                    {
                        title: "Introduction",
                        url: "#",
                    },
                    {
                        title: "Get Started",
                        url: "#",
                    },
                    {
                        title: "Tutorials",
                        url: "#",
                    },
                    {
                        title: "Changelog",
                        url: "#",
                    },
                ],
            },
            {
                title: "Settings",
                url: "#",
                icon: Settings2,
                items: [
                    {
                        title: "General",
                        url: "#",
                    },
                    {
                        title: "Team",
                        url: "#",
                    },
                    {
                        title: "Billing",
                        url: "#",
                    },
                    {
                        title: "Limits",
                        url: "#",
                    },
                ],
            },
        ],
        projects: [
            {
                name: "Design Engineering",
                url: "#",
                icon: Frame,
            },
            {
                name: "Sales & Marketing",
                url: "#",
                icon: PieChart,
            },
            {
                name: "Travel",
                url: "#",
                icon: Map,
            },
        ],
    }

    const fetchNavigation = async () => {
        const navData = await getNavigationRole(session?.user.roleId);
        if (navData) {
            setNav(navData);
        }
    };

    useEffect(() => {
        fetchNavigation();
    }, [])

    return (
        <Sidebar>
            <SidebarHeader>
                <NavHeader />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={nav} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter />
            </SidebarFooter>
        </Sidebar>
    );
}

export default AppSidebar;