import Navbar from "./components/layout/navbar"
import Hero from "./components/home/hero"
import { columns, UserEntry } from "./components/table/columns"
import DataTable from "./components/table/homeTable"
import { supabase } from '../src/lib/supabase'

export const dynamic = 'force-dynamic'

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
    <main className="min-h-screen bg-[#F8FAFC]">
      <Hero />

      <section className="px-6 pb-24 pt-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border border-[#E2E8F0] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.06)] md:p-8">
            <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-[#4C6FFF]">
                  Most Recent Submissions
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A] md:text-3xl">
                  See what others are reporting
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#64748B] md:text-base">
                  Browse recent anonymous submissions from healthcare workers across roles, locations, and hospital systems.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F8FAFC] px-4 py-3 text-sm text-[#64748B]">
                Real-time updates as new salary data is shared
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#E2E8F0]">
              <DataTable columns={columns} data={data} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}