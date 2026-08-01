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
          <p className="text-sm font-medium text-[#071633]">{profession}</p>
          <p className="text-xs text-[#64748B] mt-0.5">{department}</p>
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
      return <span className="font-serif font-semibold text-[#071633]">{formatted}</span>
    }
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
          <p className="text-sm font-medium text-[#071633]">{name}</p>
          <p className="text-xs text-[#64748B] mt-0.5">{city}, {state}</p>
        </div>
      )
    }
  },
  {
    accessorKey: "years_experience",
    header: "Exp.",
  },
  {
    id: "submitted_at",
    header: "Submitted",
    cell: ({ row }) => {
      const label = formatSubmittedLabel(row.original.submitted_at)
      return <span className="text-sm text-[#64748B]">{label}</span>
    }
  }
]