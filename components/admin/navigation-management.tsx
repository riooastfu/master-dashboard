"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HelpCircle, Plus } from "lucide-react"
import { DataTable } from "@/components/datatable/adminnavigationtable/data-table"
import { columns } from "@/components/datatable/adminnavigationtable/column"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { NavigationProps } from "@/types/types"
import { createNavigation, deleteNavigation, getNavigations, updateNavigation } from "@/actions/admin/navigation"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { navManagementFormSchema } from "@/schemas"
import { WarningGuideDialog } from "../datatable/adminnavigationtable/warning-guide-dialog.tsx"

type CreatedNavDataProps = {
    title: string;
    url: string;
    mode: "title" | "subtitle" | "click";
    menu: "admin" | "gis" | "pastiplant";
    parent_menu_id?: string;  // Make it optional
    icon?: string;
}

// Available icons and menu types
const availableIcons = [
    { value: "Package", label: "Package" },
    { value: "Activity", label: "Activity" },
    { value: "LaptopMinimal", label: "Laptop" },
    { value: "User", label: "User" },
    { value: "UserPen", label: "User Pen" },
    { value: "BriefcaseBusiness", label: "Briefcase" },
]

const menuModes = [
    { value: "title", label: "Title (Parent)" },
    { value: "subtitle", label: "Subtitle (Child)" },
    { value: "click", label: "Click (Single)" },
]

const menuTypes = [
    { value: "admin", label: "Admin" },
    { value: "gis", label: "GIS" },
    { value: "pastiplant", label: "Pastiplant" },
]

export default function NavigationManagementComponent() {
    const router = useRouter()

    const [menus, setMenus] = useState<NavigationProps[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [editingMenu, setEditingMenu] = useState<NavigationProps | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isGuideOpen, setIsGuideOpen] = useState(false)
    const [createdNavData, setCreatedNavData] = useState<CreatedNavDataProps | null>(null)

    const form = useForm<z.infer<typeof navManagementFormSchema>>({
        resolver: zodResolver(navManagementFormSchema),
        defaultValues: {
            title: "",
            url: "",
            parent_menu_id: "",
            icon: "",
            mode: "click",
            menu: "admin",
        },
    })

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [navData] = await Promise.all([
                getNavigations(),
            ]);

            if (navData.data) {
                setMenus(navData.data)
            }

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to refresh data. Please try again.');
            }
        }
    };

    // Add refresh function
    const refreshData = async () => {
        try {
            const { data: refreshedUsers, error } = await getNavigations();
            if (error) {
                toast.error('Failed to refresh data');
                return;
            }
            if (refreshedUsers) {
                setMenus(refreshedUsers);
                router.refresh(); // Refresh Next.js cache
            }
        } catch (error) {
            toast.error('Failed to refresh data');
        }
    };

    const handleSubmit = async (data: z.infer<typeof navManagementFormSchema>) => {
        try {
            setIsSubmitting(true);

            if (editingMenu) {
                const result = await updateNavigation(editingMenu.id, data);
                if (result.error) {
                    toast.error(result.error);
                    return;
                }

                await refreshData();
                toast.success('Navigation updated successfully');
                handleCancel();
            } else {
                const result = await createNavigation(data);
                if (result.error) {
                    toast.error(result.error);
                    return;
                }

                await refreshData();
                setCreatedNavData(data);  // Store created nav data
                setIsGuideOpen(true);     // Show guide dialog
                handleCancel();           // Close form dialog
                toast.success('Navigation created successfully');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleEdit = (menu: NavigationProps) => {
        setEditingMenu(menu)
        form.reset({
            title: menu.title,
            url: menu.url,
            parent_menu_id: menu.parent_menu_id?.toString() || "",
            icon: menu.icon || "",
            mode: menu.mode as "title" | "subtitle" | "click",
            menu: menu.menu as "admin" | "gis" | "pastiplant",
        })
        setIsOpen(true)
    }

    const handleDelete = async (id: number) => {
        try {
            const result = await deleteNavigation(id);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            await refreshData(); // Refresh data after delete
            toast.success('Menu deleted successfully');
        } catch (error) {
            toast.error('An error occurred while deleting')
        }
    }

    const handleCancel = () => {
        setIsOpen(false)
        setEditingMenu(null)
        form.reset({
            title: "",
            url: "",
            parent_menu_id: "",
            icon: "",
            mode: "click",
            menu: "admin",
        })
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {  // When dialog is closing
            setEditingMenu(null);
            form.reset({
                title: "",
                url: "",
                parent_menu_id: "",
                icon: "",
                mode: "click",
                menu: "admin",
            })
        }
    };

    // Get parent menu options based on mode
    const getParentMenuOptions = () => {
        const mode = form.watch("mode")
        if (mode === "subtitle") {
            return menus.filter(menu => menu.mode === "title")
        }
        return []
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Navigation Management</h1>
                <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                    <Button
                        className="flex items-center gap-2"
                        onClick={() => setIsOpen(true)}
                    >
                        <Plus size={16} />
                        Add Navigation
                    </Button>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingMenu ? 'Edit Navigation' : 'Create Navigation'}
                            </DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter URL" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="mode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center">
                                                <FormLabel>Mode</FormLabel>
                                                <HoverCard>
                                                    <HoverCardTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-5 w-5">
                                                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                                        </Button>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent className="w-80">
                                                        <div className="space-y-2">
                                                            <h4 className="text-sm font-semibold">Mode Types:</h4>
                                                            <div className="text-sm space-y-1">
                                                                <p><span className="font-medium">Title:</span> Parent menu that can have subtitles (children)</p>
                                                                <p><span className="font-medium">Subtitle:</span> Child menu that belongs to a title menu</p>
                                                                <p><span className="font-medium">Click:</span> Single menu item without children</p>
                                                            </div>
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            </div>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || "click"}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select mode" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {menuModes.map((mode) => (
                                                        <SelectItem key={mode.value} value={mode.value}>
                                                            {mode.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {form.watch("mode") === "subtitle" && (
                                    <FormField
                                        control={form.control}
                                        name="parent_menu_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Parent Menu</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value || "none"} // Provide default value
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select parent menu" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="none">None</SelectItem>
                                                        {getParentMenuOptions().map((menu) => (
                                                            <SelectItem key={menu.id} value={menu.id.toString()}>
                                                                {menu.title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <FormField
                                    control={form.control}
                                    name="icon"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Icon</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || "none"} // Provide default value
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select icon" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">None</SelectItem>
                                                    {availableIcons.map((icon) => (
                                                        <SelectItem key={icon.value} value={icon.value}>
                                                            {icon.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="menu"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Menu Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || "admin"} // Provide default value
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select menu type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {menuTypes.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancel}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Saving...' : (editingMenu ? 'Update' : 'Create')}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable
                columns={columns}
                data={menus}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {createdNavData && (
                <WarningGuideDialog
                    isOpen={isGuideOpen}
                    onClose={() => {
                        setIsGuideOpen(false);
                        setCreatedNavData(null);
                    }}
                    formData={createdNavData}
                    parentMenus={menus}
                />
            )}
        </div>
    )
}