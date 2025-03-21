// columns.tsx
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { ActivityProps } from "@/types/types";
import { Loader2 } from "lucide-react";

export interface ActivityTableMeta {
    onToggleActivity: (activityId: number, activityName: string) => void;
    selectedActivities: number[];
    loadingActivity?: number | null; // New prop to track which activity is being loaded
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
            const isLoading = meta.loadingActivity === activity.id

            return (
                <div className="flex justify-center">
                    {isLoading ? (
                        // Show loading spinner when this specific activity is being toggled
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : (
                        <Checkbox
                            checked={meta.selectedActivities.includes(activity.id)}
                            onCheckedChange={() => meta.onToggleActivity(activity.id, activity.description)}
                        />
                    )}
                </div>
            )
        },
    },
]