// app/admin/management/division-form.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { EstateProps, DivisionProps } from "@/types"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { createDivision, updateDivision } from "@/actions/admin/company"
import { useEffect } from "react"

const formSchema = z.object({
    kode: z.string().min(1, "Code is required").max(10, "Code must be less than 10 characters"),
    no_urut: z.coerce.number().int("Order must be an integer").positive("Order must be positive"),
    description: z.string().min(1, "Division name is required"),
    estateId: z.string().min(1, "Estate is required"),
})

interface DivisionFormProps {
    estates: EstateProps[]
    initialData?: DivisionProps | null
    onSuccess: () => void
}

export function DivisionForm({ estates, initialData, onSuccess }: DivisionFormProps) {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kode: initialData?.kode || "",
            no_urut: initialData?.no_urut || 0,
            description: initialData?.description || "",
            estateId: initialData?.estateId || "",
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            if (initialData) {
                const result = await updateDivision(initialData.id, data)
                if (result.error) {
                    toast.error(result.error)
                    return
                }
                toast.success("Division updated successfully")
            } else {
                const result = await createDivision(data)
                if (result.error) {
                    toast.error(result.error)
                    return
                }
                toast.success("Division created successfully")
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
                estateId: "",
            })
        } else {
            form.reset({
                kode: initialData.kode,
                no_urut: initialData.no_urut,
                description: initialData.description,
                estateId: initialData.estateId,
            })
        }
    }, [initialData, form])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="estateId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estate</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select estate" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {estates.map((estate) => (
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
                    name="kode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter division code (e.g., DIV01)" {...field} />
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
                            <FormLabel>Division Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter division name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    {initialData ? "Update" : "Create"} Division
                </Button>
            </form>
        </Form>
    )
}