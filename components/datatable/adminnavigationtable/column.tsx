// components/datatable/navmenutable/columns.tsx
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { NavigationProps } from "@/types"

export interface DataTableMeta {
    onEdit: (menu: NavigationProps) => void
    onDelete: (id: number, navigationName: string) => void
}

export const columns: ColumnDef<NavigationProps, any>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "url",
        header: "URL",
    },
    {
        accessorKey: "parent_menu_id",
        header: "Parent Menu",
        cell: ({ row }) => {
            const parentId = row.getValue("parent_menu_id")
            return parentId ? String(parentId) : "None"
        },
    },
    {
        accessorKey: "icon",
        header: "Icon",
        cell: ({ row }) => {
            const icon = row.getValue("icon")
            return icon || "None"
        },
    },
    {
        accessorKey: "mode",
        header: "Mode",
    },
    {
        accessorKey: "menu",
        header: "Menu Type",
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const menu = row.original
            const meta = table.options.meta as DataTableMeta

            return (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => meta.onEdit(menu)}
                    >
                        <Pencil size={16} />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => meta.onDelete(menu.id, menu.title)}
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            )
        },
    },
]