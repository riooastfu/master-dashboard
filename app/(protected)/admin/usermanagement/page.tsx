"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useAxiosAuth from "@/hooks/use-axios-auth";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { userManagementFormSchema } from "@/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { DataTable } from "@/components/datatable/adminusertable/data-table";
import { columns } from "@/components/datatable/adminusertable/columns";

interface User {
    id: number;
    employid: number;
    username: string;
    perusahaanId: string;
    perusahaan: string;
    estateId: string;
    estate: string;
    divisiId: string;
    divisi: string;
    roles: string;
}

interface Perusahaan {
    id: string;
    kode: string;
    description: string;
    estates: Array<{
        id: string;
        kode: string;
        description: string;
        divisis: Array<{
            id: string;
            kode: string;
            description: string;
        }>;
    }>;
}

interface Roles {
    id: string;
    role: string;
    description: string;
}

interface FormData {
    name: string;
    email: string;
}


const UserManagementPage = () => {
    const axiosAuth = useAxiosAuth();

    // Sample initial users data
    const [users, setUsers] = useState<User[]>([]);
    const [perusahaan, setPerusahaan] = useState<Perusahaan[]>([])
    const [selectedEstates, setSelectedEstates] = useState<any[]>([]);
    const [selectedDivisis, setSelectedDivisis] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Initialize react-hook-form with Zod validation
    const form = useForm<z.infer<typeof userManagementFormSchema>>({
        resolver: zodResolver(userManagementFormSchema),
        defaultValues: {
            username: '',
            employid: 0,
            password: '',
            confirmPassword: '',
            perusahaanId: '',
            estateId: '',
            divisiId: '',
        }
    });

    const handleSubmit = async (data: z.infer<typeof userManagementFormSchema>) => {
        try {
            if (editingUser) {
                // For update, only include password if it's provided
                const updateData = {
                    ...data,
                    password: data.password || "",
                    confirmPassword: "" // Don't send to API
                };

                const response = await axiosAuth.patch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${editingUser.id}`,
                    updateData
                );

                if (response.status === 200) {
                    toast.success('User updated successfully');
                    getUsers();
                }
            } else {
                // For create
                const { ...createData } = data;
                const response = await axiosAuth.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
                    createData
                );

                if (response.status === 201) {
                    toast.success('User created successfully');
                    getUsers();
                }
            }
            handleCancel();
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while saving the user');
        }
    };

    const handleDelete = async (userId: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await axiosAuth.delete(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${userId}`
                );
                if (response.status === 200) {
                    toast.success('User deleted successfully');
                    getUsers(); // Refresh the list
                }
            } catch (error) {
                toast.error('An error occurred while deleting the user');
            }
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        // Pre-populate the form fields
        form.reset({
            username: user.username,
            employid: user.employid,
            password: '',
            confirmPassword: '',
            perusahaanId: user.perusahaanId,
            estateId: user.estateId,
            divisiId: user.divisiId,
        });

        // Update the estate and division dropdowns
        const selectedCompany = perusahaan.find(p => p.id === user.perusahaanId);
        setSelectedEstates(selectedCompany?.estates || []);

        const selectedEstate = selectedCompany?.estates.find(e => e.id === user.estateId);
        setSelectedDivisis(selectedEstate?.divisis || []);

        setIsOpen(true);
    };

    const handleCancel = () => {
        setIsOpen(false);
        setEditingUser(null);
        form.reset({
            username: '',
            employid: 0,
            password: '',
            confirmPassword: '',
            perusahaanId: '',
            estateId: '',
            divisiId: '',
        });
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {  // When dialog is closing
            setEditingUser(null);
            form.reset({
                username: '',
                employid: 0,
                password: '',
                confirmPassword: '',
                perusahaanId: '',
                estateId: '',
                divisiId: '',
            });
        }
    };

    const handlePerusahaanChange = (perusahaanId: string) => {
        const selectedCompany = perusahaan.find((p: any) => p.id === perusahaanId);
        setSelectedEstates(selectedCompany?.estates || []);
        setSelectedDivisis([]);
        form.setValue('perusahaanId', perusahaanId);
        form.setValue('estateId', '');
        form.setValue('divisiId', '');
    };

    const handleEstateChange = (estateId: string) => {
        const selectedEstate = selectedEstates.find((e: any) => e.id === estateId);
        setSelectedDivisis(selectedEstate?.divisis || []);
        form.setValue('estateId', estateId);
        form.setValue('divisiId', '');
    };

    const getUsers = async () => {
        try {
            const res = await axiosAuth.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/`);
            if (res) {
                setUsers(res.data);
            }
        } catch (error) {
            toast('Peringatan', {
                description: 'Terjadi suatu kesalahan'
            });
        }
    }

    const getPerusahaan = async () => {
        try {
            const res = await axiosAuth.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/perusahaan/`);
            if (res) {
                setPerusahaan(res.data.data);
            }
        } catch (error) {
            toast('Peringatan', {
                description: 'Terjadi suatu kesalahan'
            });
        }
    }

    useEffect(() => {
        getUsers();
        getPerusahaan();
    }, [])
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
                <Dialog open={isOpen} onOpenChange={handleOpenChange}>

                    <Button className="flex items-center gap-2" onClick={() => { setIsOpen(true); }}>
                        <Plus size={16} />
                        Add User
                    </Button>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingUser ? 'Edit User' : 'Create New User'}
                            </DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
                                {/* Username field */}
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter username" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Employee ID field */}
                                <FormField
                                    control={form.control}
                                    name="employid"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Employee ID</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter employee ID"
                                                    {...field}
                                                    disabled={!!editingUser}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Password fields - now shown for both create and update */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-2">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {editingUser ? 'New Password (optional)' : 'Password'}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder={editingUser ? 'Enter new password' : 'Enter password'}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {editingUser ? 'Confirm New Password' : 'Confirm Password'}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Confirm password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="perusahaanId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Company</FormLabel>
                                            <Select onValueChange={handlePerusahaanChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih Perusahaan" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {perusahaan.map((company: any) => (
                                                        <SelectItem key={company.id} value={company.id}>
                                                            {company.description} ({company.kode})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-2">
                                    <FormField
                                        control={form.control}
                                        name="estateId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Estate</FormLabel>
                                                <Select onValueChange={handleEstateChange} value={field.value} disabled={!form.getValues('perusahaanId')}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Estate" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {selectedEstates.map((estate: any) => (
                                                            <SelectItem key={estate.id} value={estate.id}>
                                                                {estate.description} ({estate.kode})
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
                                        name="divisiId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Division</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={!form.getValues('estateId')}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Divisi" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {selectedDivisis.map((divisi: any) => (
                                                            <SelectItem key={divisi.id} value={divisi.id}>
                                                                {divisi.description} ({divisi.kode})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-end gap-2 mt-6">
                                    <Button type="button" variant="outline" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={form.formState.isSubmitting}
                                    >
                                        {editingUser ? 'Update' : 'Create'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable
                columns={columns}
                data={users}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    )
}

export default UserManagementPage;