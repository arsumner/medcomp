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

import { diffStyles, getDifferentialsList, UserEntry } from "../table/columns"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function DetailsCard({ original }: { original: UserEntry }) {
  const diffs = getDifferentialsList(original)

  return (
    <div className="rounded-md border border-[#E1E8EF] bg-white px-5 py-5">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "1rem",
        }}
      >
        <div style={{ minWidth: 0, gridColumn: "span 2" }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
            Role
          </p>
          <p
            style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
            className="mt-1 text-[14px] font-medium text-[#071633]"
          >
            {original.role?.profession}
          </p>
          <p
            style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
            className="text-[12px] text-[#64748B]"
          >
            {original.role?.department}
          </p>
        </div>

        <div style={{ minWidth: 0 }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
            Experience
          </p>
          <p className="mt-1 text-[14px] font-medium text-[#071633]">
            {original.years_experience} {original.years_experience === 1 ? "year" : "years"}
          </p>
        </div>

        <div style={{ minWidth: 0, gridColumn: "span 2" }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
            Hospital
          </p>
          <p
            style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
            className="mt-1 text-[14px] font-medium text-[#071633]"
          >
            {original.hospital?.name}
          </p>
          <p
            style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
            className="text-[12px] text-[#64748B]"
          >
            {original.hospital?.city}, {original.hospital?.state}
          </p>
        </div>

        <div style={{ minWidth: 0, gridColumn: "span 2" }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
            Compensation
          </p>
          <p className="mt-1 font-serif text-[16px] font-semibold text-[#071633]">
            {original.pay_type === 'salary'
              ? `$${original.base_rate.toLocaleString()}/yr`
              : original.pay_type === 'travel'
              ? `$${original.base_rate.toLocaleString()}/wk`
              : `$${original.base_rate.toLocaleString()}/hr`}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-[#E1E8EF] pt-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
          Differentials
        </p>
        {diffs.length === 0 ? (
          <p className="text-[13px] text-[#94A3B8]">None reported</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {diffs.map((d) => {
              const s = diffStyles[d.label] ?? {
                bg: "bg-[#F1F5F9]",
                border: "border-[#CBD5E1]",
                text: "text-[#475569]",
                badge: "bg-[#CBD5E1]",
                badgeText: "text-[#475569]",
              }
              return (
                <span
                  key={d.label}
                  className={`inline-flex items-center gap-1 rounded-md border ${s.border} ${s.bg} px-2.5 py-1 text-[12px] font-medium ${s.text}`}
                >
                  {d.label}
                  <span className="font-semibold">+${d.value}</span>
                </span>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function DetailsToggle({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label="Toggle details"
      className="flex w-full items-center justify-center text-[#071633]"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 12 12"
        fill="none"
        className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
      >
        <path
          d="M2 4L6 8L10 4"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
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
      <div className="relative overflow-hidden rounded-lg border border-[#E1E8EF] bg-white">
        <div className="hidden w-full overflow-x-auto sm:block">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-[#E1E8EF] bg-[#FAFBFD] hover:bg-[#FAFBFD]"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                  <TableHead className="whitespace-nowrap px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
                    Details
                  </TableHead>
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {rows?.length ? (
                rows.map((row, i) => {
                  const original = row.original as UserEntry
                  const isOpen = expandedRows.has(row.id)
                  return (
                    <React.Fragment key={row.id}>
                      <TableRow
                        data-state={row.getIsSelected() && "selected"}
                        className={`border-t border-[#E1E8EF] transition-colors hover:bg-[#F8FAFC] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFD]'}`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="whitespace-nowrap px-6 py-5 text-[13px] text-[#334155]"
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                        <TableCell className="px-6 py-5 text-center">
                          <DetailsToggle isOpen={isOpen} onClick={() => toggleRow(row.id)} />
                        </TableCell>
                      </TableRow>

                      {isOpen && (
                        <TableRow className={`border-t border-[#E1E8EF] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFD]'}`}>
                          <TableCell colSpan={colCount + 1} className="px-6 py-5">
                            <DetailsCard original={original} />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={colCount + 1}
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
                <col className="w-[26%]" />
                <col className="w-[19%]" />
                <col className="w-[33%]" />
                <col className="w-[22%]" />
              </colgroup>
              <thead>
                <tr className="bg-[#071633]">
                  <th className="whitespace-nowrap px-2 py-3.5 text-left text-[13px] font-semibold uppercase tracking-[0.04em] text-white">
                    Role
                  </th>
                  <th className="whitespace-nowrap px-2 py-3.5 text-left text-[13px] font-semibold uppercase tracking-[0.04em] text-white">
                    Pay
                  </th>
                  <th className="whitespace-nowrap px-2 py-3.5 text-left text-[13px] font-semibold uppercase tracking-[0.04em] text-white">
                    Hospital
                  </th>
                  <th className="whitespace-nowrap px-2 py-3.5 text-center text-[13px] font-semibold uppercase tracking-[0.04em] text-white">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const original = row.original as UserEntry
                  const diffs = getDifferentialsList(original)
                  const isOpen = expandedRows.has(row.id)

                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        className={`border-t border-[#E1E8EF] ${i % 2 === 0 ? "bg-white" : "bg-[#FAFBFD]"}`}
                      >
                        <td className="px-2 py-3 align-top">
                          <p className="text-[12px] font-medium leading-tight text-[#071633]">
                            {original.role?.profession}
                          </p>
                          <p className="mt-1 text-[10.5px] font-medium text-[#334155]">
                            {original.years_experience} {original.years_experience === 1 ? "yr" : "yrs"}
                          </p>
                          <div className="mt-0.5 [&>span]:text-[9px] [&>span]:font-normal [&>span]:leading-none [&>span]:text-[#94A3B8]">
                            {getCell(row, "submitted_at")}
                          </div>
                        </td>
                        <td className="px-2 py-3 align-top">
                          <div className="font-serif text-[13px] font-semibold leading-tight text-[#071633]">
                            {getCell(row, "compensation")}
                          </div>
                        </td>
                        <td className="px-2 py-3 align-top">
                          <p className="text-[12px] font-medium leading-tight text-[#071633]">
                            {original.hospital?.name}
                          </p>
                          <p className="mt-1 text-[10.5px] text-[#334155]">
                            {original.hospital?.city}, {original.hospital?.state}
                          </p>
                        </td>
                        <td className="px-2 py-3 align-top">
                          <DetailsToggle isOpen={isOpen} onClick={() => toggleRow(row.id)} />
                        </td>
                      </tr>

                      {isOpen && (
                        <tr className="border-t border-[#E1E8EF] bg-[#FAFBFD]">
                          <td colSpan={4} className="px-4 py-5">

                            <div className="mb-5 rounded-md border border-[#E1E8EF] bg-white px-5 py-5">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
                                Compensation
                              </p>
                              <p className="mt-1.5 font-serif text-[26px] font-semibold leading-none tracking-[-0.02em] text-[#071633]">
                                {getCell(row, "compensation")}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
                                  Role
                                </p>
                                <p className="mt-1 text-[14px] font-medium text-[#071633]">
                                  {original.role?.profession}
                                </p>
                                <p className="text-[12px] text-[#64748B]">
                                  {original.role?.department}
                                </p>
                              </div>

                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
                                  Experience
                                </p>
                                <p className="mt-1 text-[14px] font-medium text-[#071633]">
                                  {original.years_experience} {original.years_experience === 1 ? "year" : "years"}
                                </p>
                              </div>

                              <div className="col-span-2">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
                                  Hospital
                                </p>
                                <p className="mt-1 text-[14px] font-medium text-[#071633]">
                                  {original.hospital?.name}
                                </p>
                                <p className="text-[12px] text-[#64748B]">
                                  {original.hospital?.city}, {original.hospital?.state}
                                </p>
                              </div>

                              <div className="col-span-2">
                                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
                                  Differentials
                                </p>
                                {diffs.length === 0 ? (
                                  <p className="text-[13px] text-[#94A3B8]">None reported</p>
                                ) : (
                                  <div className="flex flex-wrap gap-2">
                                    {diffs.map((d) => {
                                      const s = diffStyles[d.label] ?? {
                                        bg: "bg-[#F1F5F9]",
                                        border: "border-[#CBD5E1]",
                                        text: "text-[#475569]",
                                        badge: "bg-[#CBD5E1]",
                                        badgeText: "text-[#475569]",
                                      }
                                      return (
                                        <span
                                          key={d.label}
                                          className={`inline-flex items-center gap-1 rounded-md border ${s.border} ${s.bg} px-2.5 py-1 text-[12px] font-medium ${s.text}`}
                                        >
                                          {d.label}
                                          <span className="font-semibold">+${d.value}</span>
                                        </span>
                                      )})}
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