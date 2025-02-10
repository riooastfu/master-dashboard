// columns.tsx
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { ActivityProps } from "@/types/types";

export interface ActivityTableMeta {
    onToggleActivity: (activityId: number, activityName: string) => void;
    selectedActivities: number[];
}

export const columns: ColumnDef<ActivityProps, any>[] = [
    {
        accessorKey: "kode",
        header: "Code",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        id: "actions",
        header: "Access",
        cell: ({ row, table }) => {
            const activity = row.original
            const meta = table.options.meta as ActivityTableMeta

            return (
                <Checkbox
                    checked={meta.selectedActivities.includes(activity.id)}
                    onCheckedChange={() => meta.onToggleActivity(activity.id, activity.description)}
                />
            )
        },
    },
]