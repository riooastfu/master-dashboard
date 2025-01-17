// components/DataTable/columns.tsx
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

export interface User {
    id: number
    employid: number
    username: string
    perusahaanId: string
    perusahaan: string
    estateId: string
    estate: string
    divisiId: string
    divisi: string
    roles: string
}

export interface DataTableMeta {
    onEdit: (user: User) => void
    onDelete: (id: number, username: string) => void
}

export const columns: ColumnDef<User, any>[] = [
    {
        accessorKey: "employid",
        header: "Employee ID",
    },
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "roles",
        header: "Role",
    },
    {
        accessorKey: "perusahaan",
        header: "Perusahaan",
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