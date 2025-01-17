"use client"

import * as z from "zod";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useModalStore } from "@/hooks/use-modal-store"
import { PopmenuSchema, ProduksiSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Checkbox } from "../ui/checkbox"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { ScrollArea } from "../ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import useAxiosAuth from "@/hooks/use-axios-auth";
import moment from "moment-timezone";
import { useSession } from "next-auth/react";

interface PerusahaanProps {
    id: string;
    kode: string;
    description: string;
    estates: EstateProps[];
}

interface EstateProps {
    id: string;
    kode: string;
    description: string;
    divisis: DivisiProps[];
}

interface DivisiProps {
    id: string;
    kode: string;
    description: string;
}

export const ProduksiModal = () => {
    const { data: session } = useSession();
    const { isOpen, onClose, type } = useModalStore();
    const { selected, toggleCheckbox, updateStyles, setDateRange, dateRange } = useModalStore();
    const axiosAuth = useAxiosAuth();

    const isModalOpen = isOpen && type === "produksi";

    const [perusahaan, setPerusahaan] = useState<PerusahaanProps[]>([]);

    const form = useForm<z.infer<typeof ProduksiSchema>>({
        resolver: zodResolver(ProduksiSchema),
        defaultValues: {
            tanggal_mulai: new Date(),
            tanggal_akhir: new Date(),
        }
    });

    const isLoading = form.formState.isSubmitting;

    const handleClose = () => {
        // form.reset();
        onClose();
    };

    const onSubmit = (values: z.infer<typeof ProduksiSchema>) => {
        const startDate = moment(values.tanggal_mulai).format('YYYYMM');
        const endDate = moment(values.tanggal_akhir).format('YYYYMM');
        setDateRange({ startDate: values.tanggal_mulai, endDate: values.tanggal_akhir })
        updateStyles(startDate, endDate);
    }

    const onGetPerusahaan = async () => {
        try {
            const response = await axiosAuth.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/perusahaan/role`, {
                perusahaan: session?.user.perusahaanId,
                role: session?.user.role
            });

            setPerusahaan(response.data.data)
        } catch (error) {
            console.log("Err>> ", error)
        }
    }

    useEffect(() => {
        onGetPerusahaan();
    }, []);

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center">
                        Produksi
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your server a personality with a name and an image. You can
                        always change it later.

                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-2">
                                <FormField
                                    control={form.control}
                                    name="tanggal_mulai"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold text-zinc-500">
                                                Tanggal Awal
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                moment(field.value).format("MMMM yyyy")
                                                            ) : (
                                                                <span>Pilih Tanggal</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="end">
                                                    <Calendar
                                                        onChange={(field.onChange)}
                                                        value={field.value}
                                                        maxDate={new Date()}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage></FormMessage>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tanggal_akhir"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold text-zinc-500">
                                                Tanggal Akhir
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                moment(field.value).format("MMMM yyyy")
                                                            ) : (
                                                                <span>Pilih Tanggal</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="end">
                                                    <Calendar
                                                        onChange={(field.onChange)}
                                                        value={field.value}
                                                        maxDate={new Date()}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage></FormMessage>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <ScrollArea className="h-52">
                                <div className="space-y-2">
                                    {perusahaan.map((perusahaan, index) => {
                                        const estateKeys = perusahaan.estates.map(
                                            (estate) => `checkbox-${perusahaan.kode}-${estate.kode}`
                                        );
                                        const divisiKeys = perusahaan.estates.flatMap((estate) =>
                                            estate.divisis.map(
                                                (divisi) => `checkbox-${perusahaan.kode}-${estate.kode}-${divisi.kode}`
                                            )
                                        );

                                        const childrenKeys = [...estateKeys, ...divisiKeys];

                                        return (
                                            <Accordion key={perusahaan.id} type="single" collapsible className="w-full max-w-lg">
                                                <AccordionItem value={`item-${index}`} className="border-b-0">
                                                    <AccordionTrigger>{perusahaan.description}</AccordionTrigger>
                                                    <AccordionContent>
                                                        {/* Perusahaan Checkbox */}
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`checkbox-${perusahaan.kode}`}
                                                                checked={selected[`checkbox-${perusahaan.kode}`] || false}
                                                                onCheckedChange={() =>
                                                                    toggleCheckbox(`checkbox-${perusahaan.kode}`, childrenKeys)
                                                                }
                                                            />
                                                            <label
                                                                htmlFor={`checkbox-${perusahaan.kode}`}
                                                                className="text-sm font-medium"
                                                            >
                                                                Show {perusahaan.kode}
                                                            </label>
                                                        </div>
                                                        {
                                                            perusahaan.estates.map((estate, index) => {
                                                                const estateChildrenKeys = estate.divisis.map(
                                                                    (divisi) =>
                                                                        `checkbox-${perusahaan.kode}-${estate.kode}-${divisi.kode}`
                                                                );

                                                                return (
                                                                    <Accordion key={estate.kode} type="single" collapsible className="ml-6">
                                                                        <AccordionItem value={`item-${index}`} className="border-b-0">
                                                                            <AccordionTrigger>{estate.kode}</AccordionTrigger>
                                                                            <AccordionContent className="space-y-2">
                                                                                {/* Estate Checkbox */}
                                                                                <div className="flex items-center space-x-2">
                                                                                    <Checkbox
                                                                                        id={`checkbox-${perusahaan.kode}-${estate.kode}`}
                                                                                        checked={
                                                                                            selected[`checkbox-${perusahaan.kode}-${estate.kode}`] || false
                                                                                        }
                                                                                        onCheckedChange={() =>
                                                                                            toggleCheckbox(
                                                                                                `checkbox-${perusahaan.kode}-${estate.kode}`,
                                                                                                estateChildrenKeys
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                    <label
                                                                                        htmlFor={`checkbox-${perusahaan.kode}-${estate.kode}`}
                                                                                        className="text-sm font-medium"
                                                                                    >
                                                                                        Show {estate.kode}
                                                                                    </label>
                                                                                </div>

                                                                                {/* Divisis */}
                                                                                <div className="ml-4 space-y-2">
                                                                                    {estate.divisis.map((divisi) => (
                                                                                        <div key={divisi.id} className="flex items-center space-x-2">
                                                                                            <Checkbox
                                                                                                id={`checkbox-${perusahaan.kode}-${estate.kode}-${divisi.kode}`}
                                                                                                checked={
                                                                                                    selected[
                                                                                                    `checkbox-${perusahaan.kode}-${estate.kode}-${divisi.kode}`
                                                                                                    ] || false
                                                                                                }
                                                                                                onCheckedChange={() =>
                                                                                                    toggleCheckbox(
                                                                                                        `checkbox-${perusahaan.kode}-${estate.kode}-${divisi.kode}`
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                            <label
                                                                                                htmlFor={`checkbox-${perusahaan.kode}-${estate.kode}-${divisi.kode}`}
                                                                                                className="text-sm font-medium"
                                                                                            >
                                                                                                {divisi.description}
                                                                                            </label>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </AccordionContent>
                                                                        </AccordionItem>
                                                                    </Accordion>
                                                                )
                                                            })
                                                        }
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>

                                        );
                                    })}

                                    <p>{`${moment(dateRange?.startDate).format('DD MMM YYYY')}, ${moment(dateRange?.endDate).format('DD MMM YYYY')}`}</p>
                                    {/* <pre>{JSON.stringify(selected, null, 2)}</pre> */}
                                </div>
                            </ScrollArea>

                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button type="submit" variant="default" disabled={isLoading}>
                                Cari
                                <Search size={15} />
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}
