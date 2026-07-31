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

export const diffStyles: Record<string, { bg: string; border: string; text: string; badge: string; badgeText: string }> = {
  Night:     { bg: "bg-[#EEF2FF]", border: "border-[#C7D2FE]", text: "text-[#3730A3]", badge: "bg-[#C7D2FE]", badgeText: "text-[#3730A3]" },
  Evening:   { bg: "bg-[#EEF2FF]", border: "border-[#C7D2FE]", text: "text-[#3730A3]", badge: "bg-[#C7D2FE]", badgeText: "text-[#3730A3]" },
  Charge:    { bg: "bg-[#FEFCE8]", border: "border-[#FDE68A]", text: "text-[#92400E]", badge: "bg-[#FDE68A]", badgeText: "text-[#92400E]" },
  Preceptor: { bg: "bg-[#F5F3FF]", border: "border-[#DDD6FE]", text: "text-[#5B21B6]", badge: "bg-[#DDD6FE]", badgeText: "text-[#5B21B6]" },
  Cert:      { bg: "bg-[#F0FDF4]", border: "border-[#BBF7D0]", text: "text-[#14532D]", badge: "bg-[#BBF7D0]", badgeText: "text-[#14532D]" },
}

export function getDifferentialsList(row: UserEntry) {
  return [
    { label: "Night", value: row.night_diff },
    { label: "Evening", value: row.evening_diff },
    { label: "Charge", value: row.charge_diff },
    { label: "Preceptor", value: row.preceptor_pay },
    { label: "Cert", value: row.certification_pay },
  ].filter((d) => d.value)
}

export function formatSubmittedLabel(submittedAt: string) {
  const date = new Date(submittedAt)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  if (diffMonths < 12) return `${diffMonths}mo ago`
  return `${diffYears}y ago`
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
      const diffs = getDifferentialsList(row.original)

      if (diffs.length === 0) {
        return <span className="text-sm text-[#94A3B8]">None</span>
      }

      return (
        <div className="flex max-w-xs flex-wrap gap-1.5">
          {diffs.map(d => {
            const s = diffStyles[d.label] ?? {
              bg: "bg-[#F1F5F9]", border: "border-[#CBD5E1]", text: "text-[#475569]",
              badge: "bg-[#CBD5E1]", badgeText: "text-[#475569]",
            }
            return (
              <span
                key={d.label}
                className={`inline-flex items-center gap-1.5 rounded-full border ${s.border} ${s.bg} px-2.5 py-1 text-xs font-medium ${s.text}`}
              >
                <span className={`flex h-4 w-4 items-center justify-center rounded-full ${s.badge} text-[10px] font-semibold ${s.badgeText}`}>
                  +
                </span>
                <span>{d.label}</span>
                <span className="font-semibold">${d.value}</span>
              </span>
            )
          })}
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
      const label = formatSubmittedLabel(row.original.submitted_at)
      return <span className="text-sm text-[#6B7280]">{label}</span>
    }
  }
]
