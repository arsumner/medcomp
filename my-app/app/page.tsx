import Navbar from "./components/navbar"
import Hero from "./components/hero"
import { columns, UserEntry } from "./components/table/columns"
import Table from "./components/table/dataTable"

async function getData(): Promise<UserEntry[]> {
  return [
    {
      id: "1",
      profession: "Registered Nurse",
      hospital: "Brooklyn Methodist",
      city: "Brooklyn",
      state: "New York",
      salary: 120000,
      createdAt: "02-01-2026",
    },
    {
      id: "2",
      profession: "Registered Nurse",
      hospital: "Brooklyn Methodist",
      city: "Brooklyn",
      state: "New York",
      salary: 118000,
      createdAt: "02-15-2026",
    },
  ]
}

export default async function Home() {
  const data = await getData()

  return (
    <main className="min-h-screen bg-[#0A0F1E]">

      <Hero />

      <section className="px-8 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">
              Recent Salary Submissions
            </h2>
            <p className="mt-2 text-[#9CA3AF]">
              Real healthcare salary insights from professionals across the U.S.
            </p>
          </div>

          <Table columns={columns} data={data} />
        </div>
      </section>
    </main>
  )
}