// components/management/division-table.tsx
"use client"

import { DataTable } from "./data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { DivisionProps, EstateProps } from "@/types"

export function DivisionTable({ data, estates, onEdit, onDelete }: { data: DivisionProps[]; estates: EstateProps[]; onEdit: (division: DivisionProps) => void; onDelete: (id: string) => void }) {
    const columns: ColumnDef<DivisionProps>[] = [
        { accessorKey: "kode", header: "Code" },
        { accessorKey: "no_urut", header: "Order" },
        { accessorKey: "description", header: "Division Name" },
        {
            id: "estate",
            header: "Estate",
            cell: ({ row }) => {
                const division = row.original
                return estates.find(e => e.id === division.estateId)?.description || "-"
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const division = row.original
                return (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(division)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(division.id)}>
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