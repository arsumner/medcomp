"use client"

import { ColumnDef } from "@tanstack/react-table"

export type UserEntry = {
  submissionid: number
  base_rate: number
  pay_type: string
  years_experience: number
  submitted_at: string
  Role: {
    profession: string
    department: string
  }
  Hospital: {
    name: string
    city: string
    state: string
  }
}

export const columns: ColumnDef<UserEntry>[] = [
  {
    accessorKey: "role.profession",
    header: "Profession",
  },
  {
    accessorKey: "role.department",
    header: "Department",
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

      return <span>{formatted}</span>
    }
  },
    {
    accessorKey: "years_experience",
    header: "Years of Experience",
  },
  {
    accessorKey: "hospital.name",
    header: "Hospital",
  },
  {
    id: "location",
    header: "Location",
    cell: ({ row }) => {
      const city = row.original.hospital?.city
      const state = row.original.hospital?.state
      return <span>{city}, {state}</span>
    }
  },
  {
    id: "submitted_at",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.submitted_at)
      return <span>{date.toLocaleDateString('en-US')}</span>
    }
  }
]