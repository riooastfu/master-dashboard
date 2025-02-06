import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";

const SidebarSkeleton = () => {
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="p-4">
                    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <div className="p-4 space-y-4">
                    {/* Menu Items */}
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-3">
                            {/* Menu Header */}
                            <div className="flex items-center space-x-3">
                                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                            </div>

                            {/* SubMenu Items */}
                            <div className="ml-8 space-y-2">
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </SidebarContent>

            <SidebarFooter>
                <div className="p-4">
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
};

export default SidebarSkeleton;