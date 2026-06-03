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

function formatMoney(value: number) {
  if (!value || Number.isNaN(value)) return '$0.00'

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
}

function annualize(hourly: number) {
  return hourly * 2080
}

function getPercentPosition(value: number, min: number, max: number) {
  if (!value || !min || !max || min === max) return 0
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
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
    return {
      submissions: [],
      p25: 0,
      p75: 0,
      p90: 0,
      minRate: 0,
      maxRate: 0,
      state,
      count: 0,
    }
  }

  const rates = data
    .map(d => Number(d.base_rate))
    .filter(rate => !Number.isNaN(rate) && rate > 0)

  return {
    submissions: data,
    p25: percentile(rates, 25),
    p75: percentile(rates, 75),
    p90: percentile(rates, 90),
    minRate: rates.length ? Math.min(...rates) : 0,
    maxRate: rates.length ? Math.max(...rates) : 0,
    state,
    count: data.length,
  }
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const {
    submissions,
    p25,
    p75,
    p90,
    minRate,
    maxRate,
    state,
    count,
  } = await getStateData(slug)

  const hasSalaryData = count > 0 && minRate > 0 && maxRate > 0

  const rangeMin = hasSalaryData ? Math.floor(minRate) : 0
  const rangeMax = hasSalaryData ? Math.ceil(maxRate) : 0
  const middleRange = hasSalaryData ? Math.round((rangeMin + rangeMax) / 2) : 0

  const p25Position = getPercentPosition(p25, rangeMin, rangeMax)
  const p75Position = getPercentPosition(p75, rangeMin, rangeMax)
  const p90Position = getPercentPosition(p90, rangeMin, rangeMax)

  const stats = [
    {
      label: '25th',
      value: p25,
      tone: 'text-[#0F766E]',
      dot: 'bg-[#BFE5E1]',
      yearly: annualize(p25),
      position: p25Position,
    },
    {
      label: '75th',
      value: p75,
      tone: 'text-[#2F5EA8]',
      dot: 'bg-[#CDDAF0]',
      yearly: annualize(p75),
      position: p75Position,
    },
    {
      label: '90th',
      value: p90,
      tone: 'text-[#7A5A1A]',
      dot: 'bg-[#E8DDC8]',
      yearly: annualize(p90),
      position: p90Position,
    },
  ]

  return (
    <main className="min-h-screen bg-[#F6F9FC] px-4 py-6 md:px-8 md:py-8">
      <section className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#DDE7EF] bg-gradient-to-br from-white via-[#FBFCFD] to-[#EEF8F6] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.055)] md:p-7">
          <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-[#DDEEFF]/50 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#E7FAF4]/70 blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm text-[#8B99A8]">
                  <Link href="/locations" className="transition hover:text-[#071633]">
                    Locations
                  </Link>
                  <span>/</span>
                  <span className="text-[#071633]">{state}</span>
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B99A8]">
                  Compare salaries in this state
                </p>

                <h1 className="mt-2 max-w-4xl font-serif text-3xl font-medium leading-tight tracking-[-0.03em] text-[#071633] md:text-5xl">
                  Healthcare Pay in {state}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B] md:text-base">
                  See what healthcare workers are reporting across hospitals,
                  cities, roles, departments, and experience levels in {state}.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-[#DFE8F0] bg-white/80 px-4 py-2 text-sm font-medium text-[#64748B] shadow-sm">
                  {count} {count === 1 ? 'submission' : 'submissions'}
                </div>

                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#071633] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(7,22,51,0.14)] transition hover:-translate-y-0.5 hover:bg-[#13284F]"
                >
                  Submit salary
                </Link>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[#E1E8EF] bg-white/78 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.04)] backdrop-blur md:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">
                    Reported pay range
                  </p>

                  <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <p className="font-serif text-2xl font-semibold tracking-[-0.03em] text-[#071633] md:text-3xl">
                      {hasSalaryData
                        ? `${formatMoney(rangeMin)}–${formatMoney(rangeMax)}/hr`
                        : '$0/hr'}
                    </p>

                    <p className="text-sm text-[#94A3B8]">
                      based on base hourly rates
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 lg:min-w-[420px]">
                  {stats.map(({ label, value, tone, yearly }) => (
                    <div
                      key={label}
                      className="rounded-2xl bg-[#F8FAFC] px-3 py-3 text-center"
                    >
                      <p
                        className={`text-xs font-semibold uppercase tracking-[0.12em] ${tone}`}
                      >
                        {label}
                      </p>

                      <p className="mt-1 font-serif text-xl font-semibold tracking-[-0.03em] text-[#071633] md:text-2xl">
                        {formatMoney(value)}
                        <span className="text-sm">/hr</span>
                      </p>

                      <p className="mt-0.5 text-xs text-[#94A3B8]">
                        {formatMoney(Math.round(yearly / 1000))}k/yr
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 px-1">
                <div className="relative h-20">
                  <div className="absolute left-0 right-0 top-8 h-2.5 rounded-full bg-[#E8EEF2]" />

                  {hasSalaryData && (
                    <div
                      className="absolute top-8 h-2.5 rounded-full bg-gradient-to-r from-[#B8E3DE] via-[#CAD8EF] to-[#EAD8B5]"
                      style={{
                        left: `${p25Position}%`,
                        width: `${Math.max(p90Position - p25Position, 5)}%`,
                      }}
                    />
                  )}

                  {hasSalaryData &&
                    stats.map(({ label, tone, dot, position }) => (
                      <div
                        key={label}
                        className="absolute top-5 -translate-x-1/2"
                        style={{ left: `${position}%` }}
                      >
                        <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_8px_20px_rgba(15,23,42,0.10)]">
                          <div className={`h-4 w-4 rounded-full ${dot}`} />
                        </div>

                        <p className={`mt-1 text-center text-xs font-semibold ${tone}`}>
                          {label}
                        </p>
                      </div>
                    ))}

                  <div className="absolute left-0 top-14 text-xs text-[#94A3B8]">
                    {hasSalaryData ? formatMoney(rangeMin) : '$0'}
                  </div>

                  <div className="absolute left-1/2 top-14 -translate-x-1/2 text-xs text-[#94A3B8]">
                    {hasSalaryData ? formatMoney(middleRange) : '$0'}
                  </div>

                  <div className="absolute right-0 top-14 text-xs text-[#94A3B8]">
                    {hasSalaryData ? formatMoney(rangeMax) : '$0'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-1 py-5 md:py-6">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-[#E1E8EF] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.04)] md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#0F766E]">
                100% anonymous always
              </p>

              <h2 className="mt-1 font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Help grow the {state} salary database.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                The more data we have, the easier it is for healthcare workers
                to compare pay by state, city, facility, role, and experience
                level with confidence.
              </p>
            </div>

            <Link
              href="/submit"
              className="inline-flex w-fit items-center justify-center rounded-full bg-[#071633] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#13284F]"
            >
              Submit
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-1 pb-20">
        <TableWithFilters
          submissions={submissions}
          count={count}
          hideFilters={['state']}
          emptyMessage={`Be the first to share your salary for ${state}.`}
        />
      </section>
    </main>
  )
}