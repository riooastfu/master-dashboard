// components/datatable/navmenutable/data-table.tsx
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
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChevronDown } from "lucide-react"
import { NavigationProps } from "@/types/types"
import { DeleteDialog } from "./delete-dialog"

interface DataTableProps {
    columns: ColumnDef<NavigationProps>[]
    data: NavigationProps[]
    onEdit: (record: NavigationProps) => void
    onDelete: (id: number) => void
}

export function DataTable({
    columns,
    data,
    onEdit,
    onDelete,
}: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean
        navigationId?: number
        navigationName?: string
    }>({
        isOpen: false
    })

    const handleDeleteClick = (navigationId: number, navigationName: string) => {
        setDeleteDialog({
            isOpen: true,
            navigationId,
            navigationName
        })
    }

    const handleDeleteConfirm = () => {
        if (deleteDialog.navigationId) {
            onDelete(deleteDialog.navigationId)
        }
        setDeleteDialog({ isOpen: false })
    }

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
        meta: {
            onEdit,
            onDelete: (navigationId: number, navigationName: string) => handleDeleteClick(navigationId, navigationName),
        },
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
            <DeleteDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ isOpen: false })}
                onConfirm={handleDeleteConfirm}
                navigationName={deleteDialog.navigationName || ""}
            />
            <div className="flex items-center justify-between py-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Filter by title..."
                        value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("title")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <Select
                        value={(table.getColumn("menu")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) =>
                            table.getColumn("menu")?.setFilterValue(value === "all" ? "" : value)
                        }
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="All menu types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="gis">GIS</SelectItem>
                            <SelectItem value="pastiplant">Pastiplant</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={(table.getColumn("mode")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) =>
                            table.getColumn("mode")?.setFilterValue(value === "all" ? "" : value)
                        }
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="All modes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Modes</SelectItem>
                            <SelectItem value="title">Title</SelectItem>
                            <SelectItem value="subtitle">Subtitle</SelectItem>
                            <SelectItem value="click">Click</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className="w-[80px]">
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