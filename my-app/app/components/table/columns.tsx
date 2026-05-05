"use client"

import { ColumnDef } from "@tanstack/react-table"

export type UserEntry = {
  submissionid: number
  base_rate: number
  pay_type: string
  years_experience: number
  submitted_at: string
  night_diff: number | null
  evening_diff: number | null
  charge_diff: number | null
  preceptor_pay: number | null
  certification_pay: number | null
  role: {
    profession: string
    department: string
  }
  hospital: {
    name: string
    city: string
    state: string
  }
}

export const columns: ColumnDef<UserEntry>[] = [
  {
    id: "role",
    header: "Role",
    cell: ({ row }) => {
      const profession = row.original.role?.profession
      const department = row.original.role?.department
      return (
        <div>
          <p className="text-sm font-medium text-black">{profession}</p>
          <p className="text-xs text-[#6B7280] mt-0.5">{department}</p>
        </div>
      )
    }
  },
  {
    id: "compensation",
    header: "Compensation",
    cell: ({ row }) => {
      const rate = row.original.base_rate
      const type = row.original.pay_type
      const formatted = type === 'salary'
        ? `$${rate.toLocaleString()}/yr`
        : type === 'travel'
        ? `$${rate.toLocaleString()}/wk`
        : `$${rate.toLocaleString()}/hr`
      return <span className="font-medium">{formatted}</span>
    }
  },
  {
    id: "differentials",
    header: "Differentials",
    cell: ({ row }) => {
      const diffs = [
        { label: "Night", value: row.original.night_diff },
        { label: "Evening", value: row.original.evening_diff },
        { label: "Charge", value: row.original.charge_diff },
        { label: "Preceptor", value: row.original.preceptor_pay },
        { label: "Cert", value: row.original.certification_pay },
      ].filter(d => d.value)

      if (diffs.length === 0) {
        return <span className="text-sm text-[#94A3B8]">None</span>
      }

      return (
        <div className="flex max-w-xs flex-wrap gap-1.5">
          {diffs.map(d => (
            <span
              key={d.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-2.5 py-1 text-xs font-medium text-[#1E3A8A]"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-[#2563EB]">
                +
              </span>
              <span>{d.label}</span>
              <span className="font-semibold">${d.value}</span>
            </span>
          ))}
        </div>
      )
    }
  },
    {
    accessorKey: "years_experience",
    header: "Exp.",
  },
  {
    id: "hospital",
    header: "Hospital",
    cell: ({ row }) => {
      const name = row.original.hospital?.name
      const city = row.original.hospital?.city
      const state = row.original.hospital?.state
      return (
        <div>
          <p className="text-sm font-medium text-black">{name}</p>
          <p className="text-xs text-[#6B7280] mt-0.5">{city}, {state}</p>
        </div>
      )
    }
  },
  {
    id: "submitted_at",
    header: "Submitted",
    cell: ({ row }) => {
      const date = new Date(row.original.submitted_at)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)
      const diffMonths = Math.floor(diffDays / 30)
      const diffYears = Math.floor(diffDays / 365)

      let label = ''
      if (diffHours < 1) label = 'Just now'
      else if (diffHours < 24) label = `${diffHours}h ago`
      else if (diffDays < 30) label = `${diffDays}d ago`
      else if (diffMonths < 12) label = `${diffMonths}mo ago`
      else label = `${diffYears}y ago`

      return <span className="text-sm text-[#6B7280]">{label}</span>
    }
  }
]