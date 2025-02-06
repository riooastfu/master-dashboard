"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";

import NavHeader from "./nav-header";
import NavMain from "./nav-main";
import NavFooter from "./nav-footer";
import { useSession } from "next-auth/react";
import SidebarSkeleton from "./sidebar-skeleton";
import { useNavigation } from "@/hooks/use-navigation";


const AppSidebar = () => {
    const { data: session } = useSession();
    const { nav, isLoading, error } = useNavigation(session?.user.roleId || '');

    if (isLoading) return <SidebarSkeleton />;
    if (error) return <div>Error loading navigation</div>;

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