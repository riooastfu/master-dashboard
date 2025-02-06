"use client"

import * as z from "zod"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { activityManagementFormSchema } from "@/schemas"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Plus } from "lucide-react"
import { Input } from "../ui/input"
import { useRouter } from "next/navigation"
import { ActivityProps } from "@/types"
import { DataTable } from "../datatable/adminactivitytable/data-table"
import { columns } from "../datatable/adminactivitytable/columns"
import { createActivity, deleteActivity, getActivity, updateActivity } from "@/actions/admin/activity"
import { toast } from "sonner"

export default function ActivityManagementComponent() {
    const router = useRouter();

    const [activity, setActivity] = useState<ActivityProps[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [editingActivity, setEditingActivity] = useState<ActivityProps | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof activityManagementFormSchema>>({
        resolver: zodResolver(activityManagementFormSchema),
        defaultValues: {
            kode: "",
            description: "",
        },
    })

    // Add refresh function
    const refreshData = async () => {
        try {
            const { data: refreshedActivity, error: errorRefresh } = await getActivity();
            if (errorRefresh) {
                toast.error('Failed to refresh data');
                return;
            }
            if (refreshedActivity) {
                setActivity(refreshedActivity.data);
                router.refresh(); // Refresh Next.js cache
            }
        } catch (error) {
            toast.error('Failed to refresh data');
        }
    };

    const fetchData = async () => {
        try {
            const [activityData] = await Promise.all([
                getActivity(),
            ]);

            if (activityData.data) {
                setActivity(activityData.data)
            }

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to fetch data. Please try again.');
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (data: z.infer<typeof activityManagementFormSchema>) => {
        try {
            setIsSubmitting(true);

            if (editingActivity) {
                const result = await updateActivity(editingActivity.id, data);
                if (result.error) {
                    toast.error(result.error);
                    return;
                }

                await refreshData(); // Refresh data after update
                toast.success('Activity updated successfully');
            } else {
                const result = await createActivity(data);
                if (result.error) {
                    toast.error(result.error);
                    return;
                }

                await refreshData(); // Refresh data after create
                toast.success('Activity created successfully');
            }
            handleCancel();
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleOpenChange = async (open: boolean) => {
        setIsOpen(open);
        if (!open) {  // When dialog is closing
            setEditingActivity(null);
            form.reset({
                kode: "",
                description: "",
            })
        }
    }

    const handleCancel = async () => {
        setIsOpen(false)
        setEditingActivity(null)
        form.reset({
            kode: "",
            description: "",
        })
    }

    const handleEdit = async (activity: ActivityProps) => {
        setEditingActivity(activity)
        form.reset({
            kode: activity.kode,
            description: activity.description,
        })
        setIsOpen(true)
    }

    const handleDelete = async (activityId: number) => {
        try {
            const result = await deleteActivity(activityId);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            await refreshData(); // Refresh data after delete
            toast.success('Activity deleted successfully');
        } catch (error) {
            toast.error('An error occurred while deleting the activity');
        }
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Activity Management</h1>
                <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                    <Button
                        className="flex items-center gap-2"
                        onClick={() => setIsOpen(true)}
                    >
                        <Plus size={16} />
                        Add Activity
                    </Button>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingActivity ? 'Edit Activity' : 'Create New Activity'}
                            </DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
                                <FormField
                                    control={form.control}
                                    name="kode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Activity Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter activity code" {...field} />
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
                                                <Input placeholder="Enter activity description" {...field} />
                                            </FormControl>
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
                                            (editingActivity ? 'Update' : 'Create')
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
                data={activity}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    )
}