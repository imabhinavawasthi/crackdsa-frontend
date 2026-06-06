"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const filterValue = (table.getColumn(searchKey || "")?.getFilterValue() as string) ?? "";

  return (
    <div className="space-y-5 select-none">
      {searchKey && (
        <div className="relative max-w-sm">
          <input
            placeholder={searchPlaceholder}
            value={filterValue}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="w-full flex h-10 rounded-xl border border-gray-200 bg-white px-3 pl-9 pr-8 text-xs font-medium shadow-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-500 text-gray-800 dark:text-gray-200"
          />
          <Search size={14} className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
          {filterValue && (
            <button
              type="button"
              onClick={() => table.getColumn(searchKey)?.setFilterValue("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Modern, Classy, Rounded-2xl Table Container */}
      <div className="rounded-2xl border border-gray-150 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-950 shadow-sm transition-all duration-300">
        <Table>
          <TableHeader className="bg-gray-50/60 dark:bg-gray-900/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead 
                      key={header.id} 
                      className="h-11 px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-150 dark:border-gray-800"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
                  className="hover:bg-gray-50/30 dark:hover:bg-gray-900/20 border-b border-gray-100 dark:border-gray-850 last:border-0 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5 px-4 font-normal text-xs text-gray-650 dark:text-gray-300">
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
                  className="h-28 text-center text-xs font-semibold text-gray-400 italic"
                >
                  No search results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Classy Pagination Panel */}
      <div className="flex items-center justify-between py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
        <div>
          <span>
            Page <strong className="font-semibold text-gray-800 dark:text-gray-200">{table.getPageCount() > 0 ? table.getState().pagination.pageIndex + 1 : 0}</strong> of{" "}
            <strong className="font-semibold text-gray-800 dark:text-gray-200">{table.getPageCount()}</strong>
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            className="inline-flex items-center justify-center rounded-xl h-8 w-8 border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400 transition-all cursor-pointer"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            title="Previous Page"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            className="inline-flex items-center justify-center rounded-xl h-8 w-8 border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400 transition-all cursor-pointer"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            title="Next Page"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
