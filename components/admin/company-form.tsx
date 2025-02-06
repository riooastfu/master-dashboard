// app/admin/management/company-form.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { CompanyProps } from "@/types"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { createCompany, updateCompany } from "@/actions/admin/company"
import { useEffect } from "react"

const formSchema = z.object({
    kode: z.string().min(1, "Code is required").max(10, "Code must be less than 10 characters"),
    no_urut: z.coerce.number().int("Order must be an integer").positive("Order must be positive"),
    description: z.string().min(1, "Company name is required"),
})

interface CompanyFormProps {
    initialData?: CompanyProps | null
    onSuccess: () => void
}

export function CompanyForm({ initialData, onSuccess }: CompanyFormProps) {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kode: initialData?.kode || "",
            no_urut: initialData?.no_urut || 0,
            description: initialData?.description || "",
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            if (initialData) {
                const result = await updateCompany(initialData.id, data)
                if (result.error) {
                    toast.error(result.error)
                    return
                }
                toast.success("Company updated successfully")
            } else {
                const result = await createCompany(data)
                if (result.error) {
                    toast.error(result.error)
                    return
                }
                toast.success("Company created successfully")
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
            // Reset form when initialData becomes null (cancel edit)
            form.reset({
                kode: "",
                no_urut: 0,
                description: "",
            })
        } else {
            // Set form data when initialData is provided (edit mode)
            form.reset({
                kode: initialData.kode,
                no_urut: initialData.no_urut,
                description: initialData.description,
            })
        }
    }, [initialData, form])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="kode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter company code (e.g., PAS, CUS)" {...field} />
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
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter company name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    {initialData ? "Update" : "Create"} Company
                </Button>
            </form>
        </Form>
    )
}