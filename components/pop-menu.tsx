"use client"

import * as z from "zod";
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { PopmenuSchema } from '@/schemas';
import { Calendar } from './ui/calendar';
import { useForm } from 'react-hook-form';
import { CalendarIcon, ChevronDown, ChevronRight, ChevronsUpDown, Folder, Layers, Search } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";
import { getPerusahaan } from "@/actions/popup";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ScrollArea } from "./ui/scroll-area";
import { useMapStore } from "@/lib/map-store";

type DivisiProps = {
    id: string,
    kode: string,
    description: string,
}

type EstateProps = {
    id: string,
    kode: string,
    description: string,
    divisis: DivisiProps[]
}

type PerusahaanProps = {
    id: string,
    kode: string,
    description: string,
    estates: EstateProps[]
}

const sampleData = [
    {
        name: "Documents",
        children: [
            {
                name: "Work",
                children: [
                    { name: "Project A.docx" },
                    { name: "Project B.pdf" },
                ]
            },
            {
                name: "Personal",
                children: [
                    { name: "Resume.pdf" },
                    { name: "Budget.xlsx" },
                ]
            }
        ]
    },
    {
        name: "Pictures",
        children: [
            { name: "Vacation.jpg" },
            { name: "Family.png" },
        ]
    },
    { name: "Music.mp3" },
]

const PopMenu = () => {
    const { updateStyles, visibility, toggleLayer } = useMapStore();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [perusahaan, setPerusahaan] = useState<PerusahaanProps[]>([]);

    const form = useForm<z.infer<typeof PopmenuSchema>>({
        resolver: zodResolver(PopmenuSchema),
        defaultValues: {
            tanggal_mulai: new Date(),
            tanggal_akhir: new Date(),
            // items_perusahaan: [],
            // items_estate: [],
            // items_divisi: [],
        }
    });

    const onSubmit = (data: z.infer<typeof PopmenuSchema>) => {
        if (updateStyles) updateStyles();
        // updateFeatures();
        // fetchPercentageData('0601.01.Q41', '201301', '201301');
        toast('You submitted the following values:', {
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        });
    }

    const fetchData = async () => {
        const perusahaan = await getPerusahaan();
        if (perusahaan) {
            setPerusahaan(perusahaan);
        }
    };

    useEffect(() => {
        fetchData();
    }, [])
    return (
        <Popover>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Layers />
                            </Button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Menu Pencarian</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-[350px] sm:w-[450px]">
                <div>
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
                                                                    format(field.value, "PPP")
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
                                                                    format(field.value, "PPP")
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

                                <div className="space-y-2">
                                    <p>CUS</p>
                                    {
                                        ['MB1', 'MB2', 'MB3'].map((layer) => (
                                            <div key={layer} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`checkbox-${layer}`}
                                                    checked={visibility[layer]}
                                                    onCheckedChange={() => toggleLayer(layer)}
                                                />
                                                <label
                                                    htmlFor={`checkbox-${layer}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {layer}
                                                </label>
                                            </div>
                                        ))
                                    }

                                    {/* <FormField
                                        control={form.control}
                                        name="items_perusahaan"
                                        render={() => (
                                            <FormItem>
                                                <ScrollArea className="h-52">
                                                    {
                                                        perusahaan.map((perusahaan, index) => (
                                                            <Accordion key={perusahaan.id} type="multiple" className="w-full max-w-lg">
                                                                <AccordionItem value={`item-${index}`} className="border-b-0">
                                                                    <AccordionTrigger>{perusahaan.description}</AccordionTrigger>
                                                                    <AccordionContent>
                                                                        <FormField
                                                                            key={perusahaan.id}
                                                                            control={form.control}
                                                                            name="items_perusahaan"
                                                                            render={({ field }) => {
                                                                                return (
                                                                                    <FormItem key={perusahaan.id} className="flex items-center space-x-2">
                                                                                        <FormControl>
                                                                                            <Checkbox
                                                                                                checked={field.value?.includes(perusahaan.kode)}
                                                                                                onCheckedChange={(checked) => {
                                                                                                    if (checked) {
                                                                                                        field.onChange([...field.value, perusahaan.kode])
                                                                                                    }
                                                                                                    else {
                                                                                                        field.onChange(
                                                                                                            field.value?.filter(
                                                                                                                (value) => value !== perusahaan.kode
                                                                                                            )
                                                                                                        )
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormLabel>Show {perusahaan.kode}</FormLabel>
                                                                                    </FormItem>
                                                                                )
                                                                            }}
                                                                        >

                                                                        </FormField>
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        ))
                                                    }
                                                </ScrollArea>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    >

                                    </FormField> */}
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" variant="default">
                                        Cari
                                        <Search size={15} />
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </PopoverContent>
        </Popover>
    )
}
export default PopMenu