import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import TableWithFilters from '../../components/table/filtersTable'

export const dynamic = 'force-dynamic'

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

function getExperienceBuckets(submissions: any[]) {
  const buckets = [
    { label: '0–2 years', min: 0, max: 2 },
    { label: '3–5 years', min: 3, max: 5 },
    { label: '6–10 years', min: 6, max: 10 },
    { label: '10+ years', min: 11, max: Infinity },
  ]

  return buckets.map((bucket) => {
    const rates = submissions
      .filter((s) => {
        const yoe = Number(s.years_experience)
        return !Number.isNaN(yoe) && yoe >= bucket.min && yoe <= bucket.max
      })
      .map((s) => Number(s.base_rate))
      .filter((rate) => !Number.isNaN(rate) && rate > 0)

    const avgHourly = rates.length ? rates.reduce((a, c) => a + c, 0) / rates.length : 0

    return {
      label: bucket.label,
      count: rates.length,
      avgYearly: rates.length ? annualize(avgHourly) : 0,
    }
  })
}

function getTopHospitals(submissions: any[]) {
  const map = new Map<string, { name: string; city?: string; state?: string; rates: number[] }>()

  submissions.forEach((s) => {
    const name = s.hospital?.name
    const rate = Number(s.base_rate)
    if (!name || Number.isNaN(rate) || rate <= 0) return

    if (!map.has(name)) {
      map.set(name, { name, city: s.hospital?.city, state: s.hospital?.state, rates: [] })
    }
    map.get(name)!.rates.push(rate)
  })

  return Array.from(map.values())
    .map((h) => ({
      name: h.name,
      city: h.city,
      state: h.state,
      count: h.rates.length,
      avgYearly: annualize(h.rates.reduce((a, c) => a + c, 0) / h.rates.length),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
}

async function getProfessionData(slug: string) {
  const { data: sampleRole } = await supabase
    .from('role')
    .select('profession')
    .or(`slug.eq.${slug},slug.ilike.${slug}-%`)
    .limit(1)

  const profession = sampleRole?.[0]?.profession
  if (!profession) {
    return { submissions: [], p25: 0, p75: 0, p90: 0, minRate: 0, maxRate: 0, count: 0 }
  }

  const { data: roles } = await supabase
    .from('role')
    .select('roleid')
    .eq('profession', profession)

  const roleids = roles?.map(r => r.roleid) ?? []
  if (!roleids.length) {
    return { submissions: [], p25: 0, p75: 0, p90: 0, minRate: 0, maxRate: 0, count: 0 }
  }

  const { data, error } = await supabase
    .from('submission')
    .select('*, role (profession, department, slug), hospital (name, city, state)')
    .in('roleid', roleids)
    .order('submitted_at', { ascending: false })

  if (error || !data) {
    return { submissions: [], p25: 0, p75: 0, p90: 0, minRate: 0, maxRate: 0, count: 0 }
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
    count: data.length,
  }
}

export default async function ProfessionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { submissions, p25, p75, p90, minRate, maxRate, count } = await getProfessionData(slug)
  const professionName = submissions[0]?.role.profession || slug.replace(/-/g, ' ')

  const hasSalaryData = count > 0 && minRate > 0 && maxRate > 0

  const rangeMin = hasSalaryData ? Math.floor(minRate) : 0
  const rangeMax = hasSalaryData ? Math.ceil(maxRate) : 0

  const p25Position = getPercentPosition(p25, rangeMin, rangeMax)
  const p75Position = getPercentPosition(p75, rangeMin, rangeMax)
  const p90Position = getPercentPosition(p90, rangeMin, rangeMax)
  const experienceBuckets = getExperienceBuckets(submissions)
  const topHospitals = getTopHospitals(submissions)

  const stats = [
    { label: '25th percentile', value: p25, yearly: annualize(p25), position: p25Position, tone: 'text-[#0F766E]', dot: 'bg-[#0F766E]' },
    { label: '75th percentile', value: p75, yearly: annualize(p75), position: p75Position, tone: 'text-[#2F5EA8]', dot: 'bg-[#2F5EA8]' },
    { label: '90th percentile', value: p90, yearly: annualize(p90), position: p90Position, tone: 'text-[#B8791A]', dot: 'bg-[#B8791A]' },
  ]

  return (
    <main className="min-h-screen bg-[#F6F9FC] px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-[-0.02em] text-[#071633] md:text-5xl">
              {professionName}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#64748B]">
              <Link href="/profession" className="transition hover:text-[#071633]">
                ← Browse all roles
              </Link>
              <span>{count} {count === 1 ? 'submission' : 'submissions'} reported</span>
            </div>
          </div>

          <Link
            href="/submit"
            className="inline-flex w-fit items-center justify-center rounded-full bg-[#071633] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#13284F]"
          >
            Submit salary
          </Link>
        </div>

        <div className="mt-12 border-t border-[#E1E8EF] pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">
            Reported pay range
          </p>

          <p className="mt-2 font-serif text-4xl font-semibold tracking-[-0.02em] text-[#071633] md:text-5xl">
            {hasSalaryData ? `${formatMoney(rangeMin)} – ${formatMoney(rangeMax)}` : '$0'}
            <span className="ml-2 text-lg font-normal text-[#94A3B8]">/hr</span>
          </p>

          {hasSalaryData && (
            <>
              <div className="mt-10 grid grid-cols-3 gap-6">
                {stats.map(({ label, value, yearly, tone }) => (
                  <div key={label}>
                    <p className={`text-xs font-medium uppercase tracking-[0.1em] ${tone}`}>
                      {label}
                    </p>
                    <p className="mt-1 font-serif text-2xl font-semibold tracking-[-0.02em] text-[#071633] md:text-3xl">
                      {formatMoney(value)}<span className="text-sm font-normal text-[#94A3B8]">/hr</span>
                    </p>
                    <p className="mt-0.5 text-sm text-[#64748B]">
                      {formatMoney(Math.round(yearly))} / year
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <div className="relative h-16">
                  <div className="absolute left-0 right-0 top-8 h-1.5 rounded-full bg-[#EEF1F5]" />

                  <div
                    className="absolute top-8 h-1.5 rounded-full bg-gradient-to-r from-[#BFE0DB] via-[#C9D9F0] to-[#EAD9B0]"
                    style={{
                      left: `${p25Position}%`,
                      width: `${Math.max(p90Position - p25Position, 4)}%`,
                    }}
                  />

                  {stats.map(({ label, yearly, position, tone, dot }) => (
                    <div
                      key={label}
                      className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
                      style={{ left: `${position}%` }}
                    >
                      <p className="whitespace-nowrap font-mono text-xs font-semibold tabular-nums text-[#071633]">
                        {formatMoney(Math.round(yearly))}
                      </p>
                      <div className={`mt-1.5 h-3.5 w-3.5 rounded-full border-[3px] border-white shadow-sm ${dot}`} />
                      <p className={`mt-1.5 whitespace-nowrap text-[11px] font-semibold ${tone}`}>
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="relative mt-8 h-5 border-t border-[#EDF1F5] pt-3">
                  <span className="absolute left-0 font-mono text-sm tabular-nums text-[#64748B]">
                    {formatMoney(Math.round(annualize(rangeMin)))} /yr
                  </span>
                  <span className="absolute right-0 font-mono text-sm tabular-nums text-[#64748B]">
                    {formatMoney(Math.round(annualize(rangeMax)))} /yr
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-12 border-t border-[#E1E8EF] pt-10">
          <h2 className="font-serif text-2xl font-semibold tracking-[-0.02em] text-[#071633]">
            Average salary by years of experience
          </h2>

          <div className="mt-6 divide-y divide-[#EDF1F5]">
            {experienceBuckets.map((bucket) => (
              <div
                key={bucket.label}
                className="flex items-center justify-between gap-4 py-4"
              >
                <p className="text-sm font-medium text-[#071633]">{bucket.label}</p>

                {bucket.count > 0 ? (
                  <div className="text-right">
                    <p className="font-mono text-lg font-semibold tabular-nums text-[#071633]">
                      {formatMoney(Math.round(bucket.avgYearly))}
                      <span className="text-sm font-normal text-[#94A3B8]"> /yr</span>
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      {bucket.count} {bucket.count === 1 ? 'entry' : 'entries'}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-[#94A3B8]">Not enough data yet</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-[#E1E8EF] pt-10">
          <h2 className="font-serif text-2xl font-semibold tracking-[-0.02em] text-[#071633]">
            Top hospitals reporting this role
          </h2>

          {topHospitals.length > 0 ? (
            <div className="mt-6 divide-y divide-[#EDF1F5]">
              {topHospitals.map((hospital) => (
                <div
                  key={hospital.name}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-[#071633]">{hospital.name}</p>
                    {(hospital.city || hospital.state) && (
                      <p className="mt-0.5 text-xs text-[#94A3B8]">
                        {[hospital.city, hospital.state].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-lg font-semibold tabular-nums text-[#071633]">
                      {formatMoney(Math.round(hospital.avgYearly))}
                      <span className="text-sm font-normal text-[#94A3B8]"> /yr</span>
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      {hospital.count} {hospital.count === 1 ? 'report' : 'reports'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#94A3B8]">Not enough data yet.</p>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[#E1E8EF] pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0F766E]">
              100% anonymous always
            </p>

            <h2 className="mt-1 font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
              Help grow the {professionName} salary database.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
              The more data we have, the easier it is for healthcare workers to compare pay with confidence.
            </p>
          </div>

          <Link
            href="/submit"
            className="inline-flex w-fit items-center justify-center rounded-full bg-[#071633] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#13284F]"
          >
            Submit
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-[#E1E8EF] pt-10 pb-10">
        <TableWithFilters
          submissions={submissions}
          count={count}
          hideFilters={['profession']}
          emptyMessage={`Be the first to share pay information for ${professionName}.`}
        />
      </div>
    </main>
  )
}