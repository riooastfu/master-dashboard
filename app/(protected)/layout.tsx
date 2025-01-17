import ModalButton from "@/components/modals/modal-button";
import PopMenu from "@/components/pop-menu";
import AppSidebar from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="p-4 w-full">
                <div className="flex justify-between">
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
                {children}
            </main>
        </SidebarProvider>
    )
}

export default ProtectedLayout