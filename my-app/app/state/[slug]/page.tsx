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

  const p25Position = getPercentPosition(p25, rangeMin, rangeMax)
  const p75Position = getPercentPosition(p75, rangeMin, rangeMax)
  const p90Position = getPercentPosition(p90, rangeMin, rangeMax)

  const middleRange = hasSalaryData
    ? Math.round((rangeMin + rangeMax) / 2)
    : 0

  const stats = [
    {
      label: '25th',
      value: p25,
      tone: 'text-[#0F766E]',
      yearly: annualize(p25),
    },
    {
      label: '75th',
      value: p75,
      tone: 'text-[#2F5EA8]',
      yearly: annualize(p75),
    },
    {
      label: '90th',
      value: p90,
      tone: 'text-[#7A5A1A]',
      yearly: annualize(p90),
    },
  ]

  return (
    <main className="min-h-screen bg-[#F6F9FC] px-4 py-8 md:px-8 md:py-12">
      <section className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.75rem] border border-[#DDE7EF] bg-gradient-to-br from-white via-[#FBFCFD] to-[#EEF8F6] p-6 shadow-[0_28px_80px_rgba(15,23,42,0.08)] md:p-10 lg:p-12">
          <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#DDEEFF]/60 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#E7FAF4]/80 blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-serif text-xs font-semibold uppercase tracking-[0.38em] text-[#8B99A8] md:text-sm">
                  Compare salaries in {state}
                </p>

                <h1 className="mt-5 max-w-4xl font-serif text-4xl font-medium leading-tight tracking-[-0.03em] text-[#071633] md:text-6xl">
                  Rankings for {state}
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-[#64748B] md:text-lg">
                  See how your salary compares to other professions in {state}.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <div className="rounded-full border border-[#DFE8F0] bg-white/80 px-4 py-2 text-sm font-medium text-[#64748B] shadow-sm">
                  {count} {count === 1 ? 'submission' : 'submissions'}
                </div>

                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#071633] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(7,22,51,0.16)] transition hover:-translate-y-0.5 hover:bg-[#13284F]"
                >
                  Submit salary
                </Link>
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] border border-[#E1E8EF] bg-white/72 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] backdrop-blur md:mt-14 md:p-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-semibold tracking-[-0.02em] text-[#243142]">
                    Rankings for all healthcare professions in {state}
                  </h2>

                  <p className="mt-2 text-sm text-[#94A3B8]">
                    Based on reported base hourly rates.
                  </p>
                </div>

                <p className="font-serif text-lg text-[#94A3B8] md:text-xl">
                  {hasSalaryData
                    ? `${formatMoney(rangeMin)}–${formatMoney(rangeMax)}/hr`
                    : '$0/hr'}
                </p>
              </div>

              <div className="mt-16 px-2 md:px-4">
                <div className="relative h-28">
                  <div className="absolute left-0 right-0 top-8 h-4 rounded-full bg-[#E8EEF2]" />

                  {hasSalaryData && (
                    <div
                      className="absolute top-8 h-4 rounded-full bg-gradient-to-r from-[#B8E3DE] via-[#CAD8EF] to-[#EAD8B5]"
                      style={{
                        left: `${p25Position}%`,
                        width: `${Math.max(p90Position - p25Position, 5)}%`,
                      }}
                    />
                  )}

                  {hasSalaryData && (
                    <>
                      <div
                        className="absolute top-0 -translate-x-1/2"
                        style={{ left: `${p25Position}%` }}
                      >
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_8px_26px_rgba(15,23,42,0.10)]">
                          <div className="h-6 w-6 rounded-full bg-[#BFE5E1]" />
                        </div>
                        <div className="mx-auto mt-2 h-9 w-px bg-[#D8E1E8]" />
                        <p className="font-serif text-base font-semibold text-[#0F766E]">
                          25th
                        </p>
                      </div>

                      <div
                        className="absolute top-0 -translate-x-1/2"
                        style={{ left: `${p75Position}%` }}
                      >
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_8px_26px_rgba(15,23,42,0.10)]">
                          <div className="h-6 w-6 rounded-full bg-[#CDDAF0]" />
                        </div>
                        <div className="mx-auto mt-2 h-9 w-px bg-[#D8E1E8]" />
                        <p className="font-serif text-base font-semibold text-[#2F5EA8]">
                          75th
                        </p>
                      </div>

                      <div
                        className="absolute top-0 -translate-x-1/2"
                        style={{ left: `${p90Position}%` }}
                      >
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_8px_26px_rgba(15,23,42,0.10)]">
                          <div className="h-6 w-6 rounded-full bg-[#E8DDC8]" />
                        </div>
                        <div className="mx-auto mt-2 h-9 w-px bg-[#D8E1E8]" />
                        <p className="font-serif text-base font-semibold text-[#7A5A1A]">
                          90th
                        </p>
                      </div>
                    </>
                  )}

                  <div className="absolute left-0 top-20 font-serif text-base text-[#94A3B8]">
                    {hasSalaryData ? formatMoney(rangeMin) : '$0'}
                  </div>

                  <div className="absolute left-1/2 top-20 -translate-x-1/2 font-serif text-base text-[#94A3B8]">
                    {hasSalaryData ? formatMoney(middleRange) : '$0'}
                  </div>

                  <div className="absolute right-0 top-20 font-serif text-base text-[#94A3B8]">
                    {hasSalaryData ? formatMoney(rangeMax) : '$0'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {stats.map(({ label, value, tone, yearly }) => (
                <div
                  key={label}
                  className="rounded-[1.75rem] border border-[#E1E8EF] bg-white/80 p-7 text-center shadow-[0_18px_50px_rgba(15,23,42,0.04)] backdrop-blur"
                >
                  <p className={`font-serif text-lg font-semibold ${tone}`}>
                    {label}
                  </p>

                  <p className="mt-8 font-serif text-4xl font-semibold tracking-[-0.04em] text-[#071633] md:text-5xl">
                    {formatMoney(value)}
                    <span className="text-2xl">/hr</span>
                  </p>

                  <p className="mt-5 font-serif text-lg text-[#94A3B8]">
                    {formatMoney(Math.round(yearly / 1000))}k/yr
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-1 py-8 md:py-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#E1E8EF] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.05)] md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#0F766E]">
                Contribute anonymously
              </p>

              <h2 className="mt-2 font-serif text-3xl font-medium tracking-[-0.03em] text-[#071633]">
                Help healthcare workers in {state} compare pay with more
                confidence.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B]">
                Your submission helps build a clearer picture of hourly rates,
                differentials, and role-specific pay across the state.
              </p>
            </div>

            <Link
              href="/submit"
              className="inline-flex w-fit items-center justify-center rounded-full bg-[#071633] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#13284F]"
            >
              Submit anonymously
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-1 pb-20">
        <TableWithFilters
          submissions={submissions}
          count={count}
          emptyMessage={`Be the first to share your salary for ${state}.`}
        />
      </section>
    </main>
  )
}