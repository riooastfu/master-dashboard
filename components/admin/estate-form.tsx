// app/admin/management/estate-form.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { CompanyProps, EstateProps } from "@/types"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { createEstate, updateEstate } from "@/actions/admin/company"
import { useEffect } from "react"

const formSchema = z.object({
    kode: z.string().min(1, "Code is required").max(10, "Code must be less than 10 characters"),
    no_urut: z.coerce.number().int("Order must be an integer").positive("Order must be positive"),
    description: z.string().min(1, "Estate name is required"),
    perusahaanId: z.string().min(1, "Company is required"),
})

interface EstateFormProps {
    companies: CompanyProps[]
    initialData?: EstateProps | null
    onSuccess: () => void
}

export function EstateForm({ companies, initialData, onSuccess }: EstateFormProps) {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kode: initialData?.kode || "",
            no_urut: initialData?.no_urut || 0,
            description: initialData?.description || "",
            perusahaanId: initialData?.perusahaanId || "",
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            if (initialData) {
                const result = await updateEstate(initialData.id, data)
                if (result.error) {
                    toast.error(result.error)
                    return
                }
                toast.success("Estate updated successfully")
            } else {
                const result = await createEstate(data)
                if (result.error) {
                    toast.error(result.error)
                    return
                }
                toast.success("Estate created successfully")
            }
            form.reset()
            router.refresh()
            onSuccess()
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    useEffect(() => {
        if (!initialData) {
            form.reset({
                kode: "",
                no_urut: 0,
                description: "",
                perusahaanId: "",
            })
        } else {
            form.reset({
                kode: initialData.kode,
                no_urut: initialData.no_urut,
                description: initialData.description,
                perusahaanId: initialData.perusahaanId,
            })
        }
    }, [initialData, form])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="perusahaanId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select company" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {companies.map((company) => (
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
                <FormField
                    control={form.control}
                    name="kode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter estate code (e.g., MB1, KBE)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="no_urut"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Order Number</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
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
                            <FormLabel>Estate Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter estate name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    {initialData ? "Update" : "Create"} Estate
                </Button>
            </form>
        </Form>
    )
}