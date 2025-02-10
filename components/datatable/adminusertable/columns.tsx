// components/DataTable/columns.tsx
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, ArrowUpDown } from "lucide-react"
import { UserProps } from "@/types/types"

export interface DataTableMeta {
    onEdit: (user: UserProps) => void
    onDelete: (id: string, username: string) => void
}

export const columns: ColumnDef<UserProps, any>[] = [
    {
        accessorKey: "employid",
        header: "Employee ID",
    },
    {
        accessorKey: "username",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Username
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        sortingFn: "text"
    },
    {
        accessorKey: "roles",
        header: "Role",
    },
    {
        accessorKey: "perusahaan",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Perusahaan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        sortingFn: "text"
    },
    {
        accessorKey: "estate",
        header: "Estate",
    },
    {
        accessorKey: "divisi",
        header: "Divisi",
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const user = row.original
            const meta = table.options.meta as DataTableMeta

            return (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => meta.onEdit(user)}
                    >
                        <Pencil size={16} />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => meta.onDelete(user.id, user.username)}
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            )
        },
    },
]