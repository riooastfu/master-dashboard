// components/role-activity/data-table.tsx
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ActivityProps } from "@/types/types"

interface DataTableProps {
    columns: ColumnDef<ActivityProps>[],
    data: ActivityProps[],
    meta?: {
        onToggleActivity: (activityId: number, activityName: string) => void;
        selectedActivities: number[];
    }
}

export function DataTable({
    columns,
    data,
    meta,
}: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        meta,
    })

    // Generate page numbers array
    const pageCount = table.getPageCount()
    const currentPage = table.getState().pagination.pageIndex + 1
    let pages = []

    if (pageCount <= 7) {
        pages = Array.from({ length: pageCount }, (_, i) => i + 1)
    } else {
        if (currentPage <= 4) {
            pages = [1, 2, 3, 4, 5, '...', pageCount]
        } else if (currentPage >= pageCount - 3) {
            pages = [1, '...', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount]
        } else {
            pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', pageCount]
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between py-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Filter by code..."
                        value={(table.getColumn("kode")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("kode")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <Input
                        placeholder="Filter by description..."
                        value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("description")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} row(s) total.
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-1">
                        {pages.map((page, i) => (
                            <Button
                                key={i}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                className="w-8"
                                onClick={() => {
                                    if (typeof page === 'number') {
                                        table.setPageIndex(page - 1)
                                    }
                                }}
                                disabled={typeof page !== 'number'}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}