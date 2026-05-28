"use client"

import Link from "next/link"
import Image from "next/image"
import mascotImg from '../../../src/assets/heroPill.png'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
  })

  const colCount = columns.length

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-[1.25rem] border border-[#EEF2F7] bg-white">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-[#EEF2F7] bg-[#FAFBFD] hover:bg-[#FAFBFD]"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#B0BCCE]"
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
                table.getRowModel().rows.map((row, i) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`border-t border-[#EEF2F7] transition-colors hover:bg-[#F8FAFC] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFD]'}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="whitespace-nowrap px-6 py-5 text-[13px] text-[#334155]"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={colCount}
                    className="h-28 text-center text-sm text-[#94A3B8]"
                  >
                    No salary submissions yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end gap-5 px-6 pb-10 pt-32 bg-gradient-to-t from-white from-60% via-white/80 to-transparent">
          <Image
            src={mascotImg}
            alt="MedComp mascot"
            height={400}
            className="drop-shadow-md"
          />

          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8A99B0]">
              Browse by role
            </p>
            <p className="mt-2 font-serif text-2xl font-medium tracking-[-0.03em] text-[#071126]">
              Find pay reports for your profession.
            </p>
          </div>

          <Link
            href="/profession"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#06183A] px-7 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(6,24,58,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0A214C] hover:shadow-[0_18px_40px_rgba(6,24,58,0.28)]"
          >
            Browse all roles
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}