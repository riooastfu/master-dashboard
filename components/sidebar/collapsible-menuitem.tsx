import { ChevronRight, type LucideIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import SubMenuitem from "./sub-menuitem";
import * as LucideIcons from "lucide-react";
import { MenuItemProps } from "@/types/types";

const CollapsibleMenuItem = ({ item, pathname }: { item: MenuItemProps; pathname: string }) => {
    const IconComponent = LucideIcons[item.icon as keyof typeof LucideIcons] as LucideIcon;

    return (
        <Collapsible asChild defaultOpen={item.is_active} className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {IconComponent ? <IconComponent /> : <ChevronRight />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SubMenuitem items={item.nav_items} parentUrl={item.url} pathname={pathname} />
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
};

export default CollapsibleMenuItem