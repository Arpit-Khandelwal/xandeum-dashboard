"use client";

import
  {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    SortingState,
  } from "@tanstack/react-table";
import { useState } from "react";
import
  {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue>
{
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
}: DataTableProps<TData, TValue>)
{
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      pagination,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground/50">
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <input
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="Search nodes..."
            className="w-full h-9 pl-9 pr-4 rounded-md bg-secondary/10 border border-transparent focus:border-primary/50 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 text-foreground"
          />
        </div>
      </div>

      <div className="rounded-md border border-white/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-white/5 hover:bg-transparent">
                {headerGroup.headers.map((header) =>
                {
                  return (
                    <TableHead key={header.id} className="text-muted-foreground font-bold tracking-wider text-xs uppercase h-12">
                      {header.isPlaceholder
                        ? null
                        : (
                          <div
                            className={`flex items-center gap-2 cursor-pointer select-none hover:text-foreground transition-colors ${header.column.getCanSort() ? 'cursor-pointer' : ''}`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: ' ▲',
                              desc: ' ▼',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick && onRowClick(row.original)}
                  className={onRowClick ? "cursor-pointer hover:bg-white/5 border-b border-white/5" : "border-b border-white/5"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-4 font-mono text-sm text-foreground/80">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        {/* Page Size Selector */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className="h-8 w-16 rounded-md border border-input bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {[10, 20, 50, 100].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest mr-4">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-20 p-0"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 w-20 p-0"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
