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
    <main className="min-h-screen bg-[#0A0F1E] px-8 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Check out recent salaries from our community
          </h1>
          <p className="mt-3 text-lg text-[#9CA3AF]">
            Explore submitted salaries by profession, hospital, city, and state.
          </p>
        </div>

        <DataTable columns={columns} data={data} />
      </div>
    </main>
  )
}