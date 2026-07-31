"use client"

import React, { useState } from "react"
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

type MobileRowData = {
  night_diff: number | null
  evening_diff: number | null
  charge_diff: number | null
  preceptor_pay: number | null
  certification_pay: number | null
  years_experience: number
  role: { profession: string; department: string }
  hospital: { name: string; city: string; state: string }
}

function getMobileDifferentials(row: MobileRowData) {
  return [
    { label: "Night", value: row.night_diff },
    { label: "Evening", value: row.evening_diff },
    { label: "Charge", value: row.charge_diff },
    { label: "Preceptor", value: row.preceptor_pay },
    { label: "Cert", value: row.certification_pay },
  ].filter((d) => d.value)
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
  const rows = table.getRowModel().rows
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const getCell = (row: (typeof rows)[number], columnId: string) => {
    const cell = row.getVisibleCells().find((c) => c.column.id === columnId)
    if (!cell) return null
    return flexRender(cell.column.columnDef.cell, cell.getContext())
  }

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-[1.25rem] border border-[#EEF2F7] bg-white">
        <div className="hidden w-full overflow-x-auto sm:block">
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
              {rows?.length ? (
                rows.map((row, i) => (
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
        
        
                <div className="w-full sm:hidden">
          {rows?.length ? (
            <table className="w-full table-fixed border-collapse">
              <colgroup>
                <col className="w-[27%]" />
                <col className="w-[19%]" />
                <col className="w-[32%]" />
                <col className="w-[22%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-[#EEF2F7] bg-[#FAFBFD]">
                  <th className="px-1.5 py-2 text-left text-[9.5px] font-semibold uppercase tracking-[0.05em] text-[#B0BCCE]">
                    Role
                  </th>
                  <th className="px-1.5 py-2 text-left text-[9.5px] font-semibold uppercase tracking-[0.05em] text-[#B0BCCE]">
                    Pay
                  </th>
                  <th className="px-1.5 py-2 text-left text-[9.5px] font-semibold uppercase tracking-[0.05em] text-[#B0BCCE]">
                    Hospital
                  </th>
                  <th className="px-1.5 py-2 text-left text-[9.5px] font-semibold uppercase tracking-[0.05em] text-[#B0BCCE]">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const original = row.original as MobileRowData
                  const diffs = getMobileDifferentials(original)
                  const isOpen = expandedRows.has(row.id)

                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        className={`border-t border-[#EEF2F7] ${i % 2 === 0 ? "bg-white" : "bg-[#FAFBFD]"}`}
                      >
                        <td className="px-1.5 py-2.5 align-top">
                          <p className="text-[11px] font-medium leading-tight text-black">
                            {original.role?.profession}
                          </p>
                          <p className="mt-0.5 text-[10px] text-[#94A3B8]">
                            {original.years_experience} {original.years_experience === 1 ? "yr" : "yrs"}
                          </p>
                          <div className="mt-0.5 text-[10px] text-[#94A3B8]">
                            {getCell(row, "submitted_at")}
                          </div>
                        </td>
                        <td className="px-1.5 py-2.5 align-top">
                          <div className="text-[11px] font-medium leading-tight text-black">
                            {getCell(row, "compensation")}
                          </div>
                        </td>
                        <td className="px-1.5 py-2.5 align-top">
                          <p className="text-[11px] font-medium leading-tight text-black">
                            {original.hospital?.name}
                          </p>
                          <p className="mt-0.5 text-[10px] text-[#94A3B8]">
                            {original.hospital?.city}, {original.hospital?.state}
                          </p>
                        </td>
                        <td className="px-1.5 py-2.5 align-top">
                          <button
                            type="button"
                            onClick={() => toggleRow(row.id)}
                            aria-expanded={isOpen}
                            className="flex items-center gap-1 text-[10px] font-medium text-[#071A3D]"
                          >
                            Details
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 12 12"
                              fill="none"
                              className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            >
                              <path
                                d="M2 4L6 8L10 4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>

                      {isOpen && (
                        <tr className="border-t border-[#EEF2F7] bg-[#FAFBFD]">
                          <td colSpan={4} className="px-4 py-5">

                            <div className="mb-5 rounded-[1rem] border border-[#EEF2F7] bg-white px-5 py-5">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#B0BCCE]">
                                Compensation
                              </p>
                              <p className="mt-1.5 text-[26px] font-semibold leading-none tracking-[-0.02em] text-[#071A3D]">
                                {getCell(row, "compensation")}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#B0BCCE]">
                                  Role
                                </p>
                                <p className="mt-1 text-[14px] font-medium text-black">
                                  {original.role?.profession}
                                </p>
                                <p className="text-[12px] text-[#6B7280]">
                                  {original.role?.department}
                                </p>
                              </div>

                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#B0BCCE]">
                                  Experience
                                </p>
                                <p className="mt-1 text-[14px] font-medium text-black">
                                  {original.years_experience} {original.years_experience === 1 ? "year" : "years"}
                                </p>
                              </div>

                              <div className="col-span-2">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#B0BCCE]">
                                  Hospital
                                </p>
                                <p className="mt-1 text-[14px] font-medium text-black">
                                  {original.hospital?.name}
                                </p>
                                <p className="text-[12px] text-[#6B7280]">
                                  {original.hospital?.city}, {original.hospital?.state}
                                </p>
                              </div>

                              <div className="col-span-2">
                                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#B0BCCE]">
                                  Differentials
                                </p>
                                {diffs.length === 0 ? (
                                  <p className="text-[13px] text-[#94A3B8]">None reported</p>
                                ) : (
                                  <div className="flex flex-wrap gap-2">
                                    {diffs.map((d) => (
                                      <span
                                        key={d.label}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-[#E5ECEF] bg-white px-3 py-1.5 text-[12px] font-medium text-[#334155]"
                                      >
                                        {d.label}
                                        <span className="font-semibold text-black">+${d.value}</span>
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex h-28 items-center justify-center text-center text-sm text-[#94A3B8]">
              No salary submissions yet.
            </div>
          )}
        </div>

      </div>
    </div>
  )
}