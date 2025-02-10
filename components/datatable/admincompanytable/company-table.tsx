// components/management/company-table.tsx
"use client"
import { DataTable } from "./data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { CompanyProps } from "@/types/types"

export function CompanyTable({ data, onEdit, onDelete }: { data: CompanyProps[], onEdit: (company: CompanyProps) => void, onDelete: (id: string) => void }) {

    const columns: ColumnDef<CompanyProps>[] = [
        { accessorKey: "kode", header: "Code" },
        { accessorKey: "no_urut", header: "Order" },
        { accessorKey: "description", header: "Company Name" },
        {
            id: "actions",
            cell: ({ row }) => {
                const company = row.original
                return (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(company)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(company.id)}>
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