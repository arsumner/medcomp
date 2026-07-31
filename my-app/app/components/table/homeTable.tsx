"use client"

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

  const getCell = (row: (typeof rows)[number], columnId: string) => {
    const cell = row.getVisibleCells().find((c) => c.column.id === columnId)
    if (!cell) return null
    return flexRender(cell.column.columnDef.cell, cell.getContext())
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
                <col className="w-[25%]" />
                <col className="w-[17%]" />
                <col className="w-[26%]" />
                <col className="w-[32%]" />
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
                    Diff.
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const original = row.original as MobileRowData & {
                    years_experience: number
                  }
                  const diffs = getMobileDifferentials(original)

                  return (
                    <tr
                      key={row.id}
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
                        {diffs.length === 0 ? (
                          <p className="text-[10px] text-[#94A3B8]">None</p>
                        ) : (
                          diffs.map((d) => (
                            <p key={d.label} className="text-[10px] leading-[1.5] text-[#64748B]">
                              {d.label} <span className="font-medium text-black">+${d.value}</span>
                            </p>
                          ))
                        )}
                      </td>
                    </tr>
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