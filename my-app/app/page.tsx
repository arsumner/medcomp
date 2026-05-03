import Navbar from "./components/navbar"
import Hero from "./components/hero"
import { columns, UserEntry } from "./components/table/columns"
import DataTable from "./components/table/dataTable"
import { supabase } from '../src/lib/supabase'

async function getData() {
  const { data, error } = await supabase.from('submission').select(`
    *, role(profession, department),
    hospital (name, city, state)
    `).order('submitted_at', {ascending: false}).limit(15)

  if (error) {
    console.error(error.message)
    return []
  }
  return data
}

export default async function Home() {
  const data = await getData()

  return (
    <main className="min-h-screen bg-[#F9FAFB]">

      <Hero />

      <section className="px-8 py-16 bg-[#F9FAFB]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0A0F1E]">
              Recent Salary Submissions
            </h2>
            <p className="mt-2 text-[#6B7280]">
              Real healthcare salary insights from professionals across the U.S.
            </p>
          </div>
          <DataTable columns={columns} data={data} />
        </div>
      </section>
    </main>
  )
}