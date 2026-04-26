"use client"

import { ColumnDef} from "@tanstack/react-table"

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
    accessorKey: "Role.profession",
    header: "Profession",
  },
  {
    accessorKey: "Role.department",
    header: "Department",
  },
    {
    accessorKey: "base_rate",
    header: "Salary",
  },
  {
    accessorKey: "pay_type",
    header: "Pay Type",
  },
    {
    accessorKey: "years_experience",
    header: "Years of Experience",
  },
  {
    accessorKey: "Hospital.name",
    header: "Hospital",
  },
  {
    accessorKey: "Hospital.city",
    header: "City",
  },
    {
    accessorKey: "Hospital.state",
    header: "State",
  },
    {
    accessorKey: "pay_type",
    header: "Hourly/Salary",
  },
  {
    accessorKey: "submitted_at",
    header: "Submitted",
  }
]