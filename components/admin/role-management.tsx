"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Plus } from "lucide-react"
import { DataTable } from "../datatable/adminroletable/data-table"
import { columns } from "@/components/datatable/adminroletable/columns";
import { roleManagementFormSchema } from "@/schemas"
import { RoleProps } from "@/types"
import { createRole, deleteRole, getRoles, updateRole } from "@/actions/admin/role"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useSession } from "next-auth/react"

const authModes = [
    { value: "allmap", label: "All Map" },
    { value: "onept", label: "One PT" },
    { value: "oneestate", label: "One Estate" },
    { value: "onedivisi", label: "One Divisi" },
]

export default function RoleManagementComponent() {
    const router = useRouter();
    const { data: session } = useSession() // Get current session
    const currentUser = session?.user?.username || "" // Get username from session

    const [roles, setRoles] = useState<RoleProps[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<RoleProps | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof roleManagementFormSchema>>({
        resolver: zodResolver(roleManagementFormSchema),
        defaultValues: {
            role: "",
            description: "",
            created_by: currentUser,
            auth_menu: "onedivisi",
        },
    })

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [rolesData] = await Promise.all([
                getRoles(),
            ]);

            if (rolesData.data) {
                setRoles(rolesData.data)
            }

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to fetch data. Please try again.');
            }
        }
    };

    // Add refresh function
    const refreshData = async () => {
        try {
            const { data: refreshedUsers, error } = await getRoles();
            if (error) {
                toast.error('Failed to refresh data');
                return;
            }
            if (refreshedUsers) {
                setRoles(refreshedUsers);
                router.refresh(); // Refresh Next.js cache
            }
        } catch (error) {
            toast.error('Failed to refresh data');
        }
    };

    const handleSubmit = async (data: z.infer<typeof roleManagementFormSchema>) => {
        try {
            setIsSubmitting(true);

            // Ensure created_by is set to current user for new roles
            if (!editingRole) {
                data.created_by = currentUser;
            }

            if (editingRole) {
                const result = await updateRole(editingRole.id, data);
                if (result.error) {
                    toast.error(result.error);
                    return;
                }

                await refreshData(); // Refresh data after update
                toast.success('Role updated successfully');
            } else {
                const result = await createRole(data);
                if (result.error) {
                    toast.error(result.error);
                    return;
                }

                await refreshData(); // Refresh data after create
                toast.success('Role created successfully');
            }
            handleCancel();
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleEdit = (role: RoleProps) => {
        setEditingRole(role)
        form.reset({
            role: role.role,
            description: role.description,
            created_by: role.created_by,
            auth_menu: role.auth_menu as "allmap" | "onept" | "oneestate" | "onedivisi"
        })
        setIsOpen(true)
    }

    const handleDelete = async (roleId: number) => {
        try {
            const result = await deleteRole(roleId);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            await refreshData(); // Refresh data after delete
            toast.success('User deleted successfully');
        } catch (error) {
            toast.error('An error occurred while deleting the role');
        }
    }

    const handleCancel = () => {
        setIsOpen(false)
        setEditingRole(null)
        form.reset({
            role: "",
            description: "",
            created_by: "",
            auth_menu: "onedivisi"
        })
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {  // When dialog is closing
            setEditingRole(null);
            form.reset({
                role: "",
                description: "",
                created_by: "",
                auth_menu: "onedivisi"
            })
        }
    };

    useEffect(() => {
        if (currentUser && !editingRole) {
            form.setValue('created_by', currentUser)
        }
    }, [currentUser, form, editingRole])

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Role Management</h1>
                <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                    <Button
                        className="flex items-center gap-2"
                        onClick={() => setIsOpen(true)}
                    >
                        <Plus size={16} />
                        Add Role
                    </Button>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingRole ? 'Edit Role' : 'Create New Role'}
                            </DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter role name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter role description" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="auth_menu"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Auth Menu</FormLabel>
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
                                                    {authModes.map((mode) => (
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
                                        {isSubmitting ?
                                            'Saving...' :
                                            (editingRole ? 'Update' : 'Create')
                                        }
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable
                columns={columns}
                data={roles}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    )
}