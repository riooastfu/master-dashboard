// columns.tsx
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import { UserProps } from "@/types"

export interface DataTableMeta {
    onAssignRoles: (user: UserProps) => void
}

export const columns: ColumnDef<UserProps, any>[] = [
    {
        accessorKey: "employid",
        header: "Employee ID",
    },
    {
        accessorKey: "username",
        header: "Username",
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
                        className="flex items-center gap-2"
                        onClick={() => meta.onAssignRoles(user)}
                    >
                        <Shield size={16} />
                        Assign Roles
                    </Button>
                </div>
            )
        },
    },
]