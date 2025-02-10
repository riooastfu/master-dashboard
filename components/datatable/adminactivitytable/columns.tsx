// columns.tsx
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { ActivityProps } from "@/types/types"

export interface DataTableMeta {
    onEdit: (activity: ActivityProps) => void
    onDelete: (id: number, activityName: string) => void
}

export const columns: ColumnDef<ActivityProps, any>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "kode",
        header: "Kode",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const activity = row.original
            const meta = table.options.meta as DataTableMeta

            return (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => meta.onEdit(activity)}
                    >
                        <Pencil size={16} />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => meta.onDelete(activity.id, activity.description)}
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            )
        },
    },
]