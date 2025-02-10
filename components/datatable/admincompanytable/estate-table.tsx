// components/management/estate-table.tsx
"use client"

import { DataTable } from "./data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { CompanyProps, EstateProps } from "@/types/types"

export function EstateTable({ data, companies, onEdit, onDelete }: { data: EstateProps[]; companies: CompanyProps[], onEdit: (estate: EstateProps) => void, onDelete: (id: string) => void }) {
    const columns: ColumnDef<EstateProps>[] = [
        { accessorKey: "kode", header: "Code" },
        { accessorKey: "no_urut", header: "Order" },
        { accessorKey: "description", header: "Estate Name" },
        {
            id: "company",
            header: "Company",
            cell: ({ row }) => {
                const estate = row.original
                return companies.find(c => c.id === estate.perusahaanId)?.description || "-"
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const estate = row.original
                return (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(estate)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(estate.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )
            }
        }
    ]
    return (
        <DataTable
            columns={columns}
            data={data}
            searchKey="description"
        />
    )
}