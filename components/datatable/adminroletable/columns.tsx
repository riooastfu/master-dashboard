// columns.tsx
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Users } from "lucide-react"
import { RoleProps } from "@/types/types"

export interface DataTableMeta {
    onEdit: (role: RoleProps) => void
    onDelete: (id: number, roleName: string) => void
}

export const columns: ColumnDef<RoleProps, any>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "role",
        header: "Role Name",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "auth_menu",
        header: "Auth Menu",
    },
    {
        accessorKey: "created_by",
        header: "Created By",
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const role = row.original
            const meta = table.options.meta as DataTableMeta

            return (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => meta.onEdit(role)}
                    >
                        <Pencil size={16} />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => meta.onDelete(role.id, role.role)}
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            )
        },
    },
]