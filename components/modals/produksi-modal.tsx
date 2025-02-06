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
} from "@/components/ui/dialog"
import { ProduksiSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Checkbox } from "../ui/checkbox"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { ScrollArea } from "../ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import moment from "moment-timezone";
import { useSession } from "next-auth/react";
import { useMapStore } from "@/hooks/use-map-store";
import { getCompaniesByRole } from "@/actions/produksi/company";
import { toast } from "sonner";

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
    const {
        isOpen,
        onClose,
        activeMapType,  // Changed from 'type'
        selected,
        toggleCheckbox,
        updateStyles,
        setDateRange,
        dateRange
    } = useMapStore();  // Changed from useModalStore

    const isModalOpen = isOpen && activeMapType === "produksi";

    const [perusahaan, setPerusahaan] = useState<PerusahaanProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Initialize form with existing dateRange if available
    const form = useForm<z.infer<typeof ProduksiSchema>>({
        resolver: zodResolver(ProduksiSchema),
        defaultValues: {
            tanggal_mulai: dateRange?.startDate || new Date(),
            tanggal_akhir: dateRange?.endDate || new Date(),
        }
    });

    const isFormLoading = form.formState.isSubmitting;

    const handleClose = () => {
        onClose();
    };

    const onSubmit = async (values: z.infer<typeof ProduksiSchema>) => {
        try {
            const startDate = moment(values.tanggal_mulai);
            const endDate = moment(values.tanggal_akhir);

            if (endDate.isBefore(startDate)) {
                form.setError('tanggal_akhir', {
                    type: 'manual',
                    message: 'End date must be after start date'
                });
                return;
            }

            setDateRange({
                startDate: values.tanggal_mulai,
                endDate: values.tanggal_akhir
            });

            // Use the new updateStyles structure
            if (updateStyles.produksi) {
                await updateStyles.produksi(
                    startDate.format('YYYYMM'),
                    endDate.format('YYYYMM')
                );
            }

            onClose();
        } catch (error) {
            console.error('Error updating map:', error);
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (!session?.user) {
                toast.error('Session not available');
                return;
            }

            const perusahaan = session.user.perusahaanId;
            const role = session.user.role;

            const [perusahaanData] = await Promise.all([
                getCompaniesByRole(perusahaan, role),
            ]);

            if (perusahaanData.data) {
                setPerusahaan(perusahaanData.data)
            }

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to fetch data. Please try again.');
            }
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user) {  // Only fetch when session is available
            fetchData();
        }
    }, [session]);

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
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        Loading...
                                    </div>
                                ) : (
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

                                        {/* <p>{`${moment(dateRange?.startDate).format('DD MMM YYYY')}, ${moment(dateRange?.endDate).format('DD MMM YYYY')}`}</p> */}
                                        {/* <pre>{JSON.stringify(selected, null, 2)}</pre> */}
                                    </div>
                                )}

                            </ScrollArea>

                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button type="submit" variant="default" disabled={isFormLoading}>
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
