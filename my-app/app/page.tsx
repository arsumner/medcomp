import Hero from "./components/home/hero"
import { columns } from "./components/table/columns"
import DataTable from "./components/table/homeTable"
import { supabase } from "../src/lib/supabase"
import FeatureWalkthrough from "./components/featureWalkthrough"


export const dynamic = "force-dynamic"

async function getData() {
  const { data, error } = await supabase
    .from("submission")
    .select(`
      *,
      role(profession, department),
      hospital (name, city, state)
    `)
    .order("submitted_at", { ascending: false })
    .limit(15)

  if (error) {
    console.error(error.message)
    return []
  }

  return data
}

async function getTotalReports() {
  const { count, error } = await supabase
    .from("submission")
    .select("*", { count: "exact", head: true })

  if (error) {
    console.error(error.message)
    return 0
  }

  return count ?? 0
}

export default async function Home() {
  const [data, totalReports] = await Promise.all([
    getData(),
    getTotalReports(),
  ])

  return (
    <main className="min-h-screen bg-[#F5F4F1]">
      <Hero totalReports={totalReports} />
      <FeatureWalkthrough />

      <section className="px-6 pb-24 pt-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-[#178C85]">
                Recently shared
              </p>
              <h2 className="mt-2 font-serif text-3xl font-normal tracking-[-0.03em] text-[#071A3D] md:text-4xl">
                See what others are reporting
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#64748B] md:text-base">
                Browse recent anonymous pay reports from healthcare workers across roles, locations, and hospital systems.
              </p>
            </div>
            <div className="text-sm text-[#94A3B8]">
              Updated as new reports come in
            </div>
          </div>
          <DataTable columns={columns} data={data} />
        </div>
      </section>
    </main>
  )
}