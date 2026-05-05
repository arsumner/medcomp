import { supabase } from '@/lib/supabase'
import TableWithFilters from '../../components/table/filtersTable'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function formatState(slug: string) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
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

  if (error || !data) {
    return { submissions: [], p25: 0, p75: 0, p90: 0, state, count: 0 }
  }

  const rates = data.map(d => d.base_rate).filter(Boolean)

  return {
    submissions: data,
    p25: percentile(rates, 25),
    p75: percentile(rates, 75),
    p90: percentile(rates, 90),
    state,
    count: data.length,
  }
}

export default async function StatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { submissions, p25, p75, p90, state, count } = await getStateData(slug)

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#EEF2FF_0%,_transparent_36%)] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-14 md:px-8 md:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-xs font-medium text-[#475569]">
                State salary data
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-[#0F172A] md:text-6xl">
                Healthcare salaries in {state}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#64748B] md:text-lg">
                Compare what healthcare workers across {state} are actually earning, based on anonymous salary submissions.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#64748B]">
                <span className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2">
                  {count} submissions
                </span>
                <span className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2">
                  Anonymous data
                </span>
                <span className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2">
                  Healthcare-specific roles
                </span>
              </div>
            </div>

            <Link
              href="/submit"
              className="inline-flex w-fit items-center justify-center rounded-xl bg-[#4C6FFF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3B5BDB]"
            >
              Submit your salary
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: '25th percentile', value: p25, description: 'Lower range' },
            { label: '75th percentile', value: p75, description: 'Higher range' },
            { label: '90th percentile', value: p90, description: 'Top reported pay' },
          ].map(({ label, value, description }) => (
            <div
              key={label}
              className="rounded-[1.5rem] border border-[#E2E8F0] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.04)]"
            >
              <p className="text-sm font-medium text-[#64748B]">{label}</p>

              <div className="mt-3 flex items-end gap-1">
                <p className="text-4xl font-semibold tracking-tight text-[#0F172A]">
                  ${value.toLocaleString()}
                </p>
                <span className="mb-1.5 text-sm text-[#94A3B8]">/hr</span>
              </div>

              <p className="mt-3 text-sm text-[#64748B]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8 md:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#E2E8F0] bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] p-6 md:p-8">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#4C6FFF]/10 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[#4C6FFF]">
                Contribute anonymously
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
                Help healthcare workers in {state} understand fair pay.
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
                Most people do not know if they are underpaid. Your submission helps create transparency across hospitals, roles, and experience levels.
              </p>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#64748B]">
                <span className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5">
                  Anonymous
                </span>
                <span className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5">
                  Takes ~2 minutes
                </span>
              </div>
            </div>

            <Link
              href="/submit"
              className="inline-flex items-center justify-center rounded-xl bg-[#4C6FFF] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3B5BDB]"
            >
              Submit anonymously
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <TableWithFilters
            submissions={submissions}
            count={count}
            emptyMessage={`Be the first to share your salary for ${state}.`}
          />
        </div>
      </section>
    </main>
  )
}