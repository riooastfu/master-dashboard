import AppSidebar from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <div className="flex justify-between pt-4 pl-4">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <SidebarTrigger />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Toggle Sidebar</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {/* <PopMenu /> */}
                </div>
                <div className="h-full sm:px-4">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}

export default ProtectedLayout