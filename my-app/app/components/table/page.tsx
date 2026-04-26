import { columns, UserEntry } from "./columns"
import { DataTable } from "./table"

async function getData(): Promise<UserEntry[]> {
  // Fetch data from your API here.
  return [
    {
    id: "1",
    profession: "Registered Nurse",
    hospital: "Brooklyn Methodist",
    city: "Brooklyn",
    state: "New York",
    salary: 120000,
    createdAt: "02-01-2026"
    },
    {
    id: "2",
    profession: "Registered Nurse",
    hospital: "Brooklyn Methodist",
    city: "Brooklyn",
    state: "New York",
    salary: 120000,
    createdAt: "02-01-2026"
    },
  ]
}

export default async function Table() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}