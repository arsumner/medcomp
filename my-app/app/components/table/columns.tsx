"use client"

import { ColumnDef } from "@tanstack/react-table"

export type UserEntry = {
    id: string
    profession: string
    hospital: string
    city: string
    state: string
    salary: number
    createdAt: string
}

export const columns: ColumnDef<UserEntry>[] = [
  {
    accessorKey: "profession",
    header: "Profession",
  },
  {
    accessorKey: "hospital",
    header: "Hospital",
  },
  {
    accessorKey: "city",
    header: "City",
  },
    {
    accessorKey: "state",
    header: "State",
  },
    {
    accessorKey: "salary",
    header: "Salary",
  },
    {
    accessorKey: "createdAt",
    header: "Date posted",
  }
]