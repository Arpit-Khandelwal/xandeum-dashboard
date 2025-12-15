"use client";

import
{
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";

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
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="table-container">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) =>
                {
                  return (
                    <th
                      key={header.id}
                      className="sticky top-0 bg-[var(--bg-card)] z-10 shadow-sm border-b border-[var(--border-color)] cursor-pointer select-none hover:text-white transition-colors"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2 justify-between">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        {{
                          asc: ' ▲',
                          desc: ' ▼',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row.original)}
                  className={onRowClick ? "cursor-pointer hover:bg-white/5 transition-colors" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem' }}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] rounded-b-[var(--radius-md)]">

        {/* Page Size Selector */}
        <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
          <span>Show</span>
          <div className="relative group">
            <select
              value={table.getState().pagination.pageSize}
              onChange={e =>
              {
                table.setPageSize(Number(e.target.value))
              }}
              className="appearance-none bg-[#0f111a] border border-[var(--border-color)] rounded-md py-1.5 pl-3 pr-8 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all cursor-pointer font-mono text-xs"
            >
              {[10, 20, 50, 100].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text-muted)] group-hover:text-white transition-colors">
              <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
          <span>entries</span>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">
            Page <span className="text-white font-mono text-sm mx-1">{table.getState().pagination.pageIndex + 1}</span> of <span className="text-white font-mono text-sm mx-1">{table.getPageCount()}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md border border-[var(--border-color)] bg-[rgba(255,255,255,0.03)] text-[var(--text-muted)] hover:bg-[var(--primary)] hover:text-[#000] hover:border-transparent hover:shadow-[0_0_15px_var(--primary-glow)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--text-muted)] disabled:hover:border-[var(--border-color)] disabled:hover:shadow-none transition-all duration-300"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Prev
            </button>
            <button
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md border border-[var(--border-color)] bg-[rgba(255,255,255,0.03)] text-[var(--text-muted)] hover:bg-[var(--primary)] hover:text-[#000] hover:border-transparent hover:shadow-[0_0_15px_var(--primary-glow)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--text-muted)] disabled:hover:border-[var(--border-color)] disabled:hover:shadow-none transition-all duration-300"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
