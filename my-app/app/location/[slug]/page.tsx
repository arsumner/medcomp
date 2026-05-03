import { supabase } from '@/lib/supabase'
import DataTable from '../../components/table/dataTable'
import { columns } from '../../components/table/columns'
import Link from 'next/link'

function formatState(slug: string) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function percentile(arr: number[], p: number) {
  if (arr.length === 0) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const index = Math.ceil((p / 100) * sorted.length) - 1
  return sorted[Math.max(0, index)]
}

async function getStateData(slug: string) {
  const state = formatState(slug)

  const { data, error } = await supabase
    .from('submission')
    .select(`
      *,
      role (profession, department),
      hospital!inner (name, city, state)
    `)
    .eq('hospital.state', state)
    .order('submitted_at', { ascending: false })

  if (error || !data) return { submissions: [], p25: 0, p75: 0, p90: 0 }

  const rates = data.map(d => d.base_rate).filter(Boolean)
  return {
    submissions: data,
    p25: percentile(rates, 25),
    p75: percentile(rates, 75),
    p90: percentile(rates, 90),
    state,
  }
}

export default async function StatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { submissions, p25, p75, p90, state } = await getStateData(slug)

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <section className="bg-[#0A0F1E] px-8 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-widest text-[#0D9488] font-semibold mb-3">
            Salary Data
          </p>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
            {state}
          </h1>
          <p className="text-[#9CA3AF] text-base max-w-lg mb-6">
            Real compensation data submitted by healthcare professionals in {state}.
          </p>
          <Link
            href="/submit"
            className="bg-[#0D9488] hover:bg-[#0F766E] text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors duration-200"
          >
            Submit Your Salary
          </Link>
        </div>
      </section>

      <section className="px-8 py-10">
        <div className="mx-auto max-w-5xl grid grid-cols-3 gap-6">
          {[
            { label: '25th Percentile', value: p25 },
            { label: '75th Percentile', value: p75 },
            { label: '90th Percentile', value: p90 },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm text-center">
              <p className="text-xs uppercase tracking-widest text-[#9CA3AF] font-semibold mb-2">{label}</p>
              <p className="text-3xl font-bold text-[#0A0F1E]">${value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 pb-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-[#0A0F1E] mb-6">Recent Submissions</h2>
          {submissions.length > 0 ? (
            <DataTable columns={columns} data={submissions} />
          ) : (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center shadow-sm">
              <p className="text-[#9CA3AF] text-base">No submissions yet for {state}.</p>
              <Link href="/submit" className="mt-4 inline-block text-[#0D9488] font-semibold hover:underline">
                Be the first to submit →
              </Link>
            </div>
          )}
        </div>
      </section>

    </main>
  )
}