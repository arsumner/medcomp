"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export default function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  })

  return (
    <div className="w-full">
      <div className="w-full overflow-hidden rounded-2xl border border-[#1F2937] bg-[#fafafa] shadow-xl">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-[#1F2937] bg-[#111827] hover:bg-[#111827]"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-6 py-4 text-sm font-semibold uppercase tracking-wide text-[#9CA3AF]"
                  >
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
              className={`border-[#E5E7EB] transition-colors hover:bg-[#F0FDFA] ${
                row.index % 2 === 0 ? 'bg-white' : 'bg-[#eff3f6]'
              }`}
            >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-6 py-5 text-sm text-black"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-[#9CA3AF]"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4 px-2">
        <p className="text-sm text-[#9CA3AF]">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 text-sm font-medium text-white bg-[#111827] border border-[#1F2937] rounded-lg disabled:opacity-40 hover:border-[#0D9488] transition-colors duration-200"
          >
            ← Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 text-sm font-medium text-white bg-[#111827] border border-[#1F2937] rounded-lg disabled:opacity-40 hover:border-[#0D9488] transition-colors duration-200"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}