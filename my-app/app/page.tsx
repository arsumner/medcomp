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
    <main className="min-h-screen bg-[#0A0F1E]">

      <Hero />

      <section className="px-8 pb-20">
        <div className="w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">
              Recent Salary Submissions
            </h2>
            <p className="mt-2 text-[#9CA3AF]">
              Real healthcare salary insights from professionals across the U.S.
            </p>
          </div>
          <DataTable columns={columns} data={data} />
        </div>
      </section>
    </main>
  )
}