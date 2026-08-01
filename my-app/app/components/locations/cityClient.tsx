'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import CityFilters from '../filters/cityFilters'
import { professions } from '../../data/professions'

const allProfessions = ['All Professions', ...Object.values(professions).flat()]

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

function toSlug(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-')
}

type Props = {
  submissions: any[]
  city: string
  parentCity: string | null
  state: string
  aliases: string[] | null
}

export default function CityClient({ submissions, city, parentCity, state, aliases }: Props) {
  const [selectedProfession, setSelectedProfession] = useState('All Professions')

  const filtered = useMemo(() => {
    if (selectedProfession === 'All Professions') return submissions
    return submissions.filter(s => s.role?.profession === selectedProfession)
  }, [submissions, selectedProfession])

  const count = filtered.length

  const rates = useMemo(
    () => filtered
      .map(d => Number(d.base_rate))
      .filter(rate => !Number.isNaN(rate) && rate > 0),
    [filtered]
  )

  const p25 = percentile(rates, 25)
  const p75 = percentile(rates, 75)
  const p90 = percentile(rates, 90)
  const minRate = rates.length ? Math.min(...rates) : 0
  const maxRate = rates.length ? Math.max(...rates) : 0

  const hasSalaryData = count > 0 && minRate > 0 && maxRate > 0
  const rangeMin = hasSalaryData ? Math.floor(minRate) : 0
  const rangeMax = hasSalaryData ? Math.ceil(maxRate) : 0

  const p25Position = getPercentPosition(p25, rangeMin, rangeMax)
  const p75Position = getPercentPosition(p75, rangeMin, rangeMax)
  const p90Position = getPercentPosition(p90, rangeMin, rangeMax)

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
              Healthcare Pay in {city}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#64748B]">
              <Link href="/locations" className="transition hover:text-[#071633]">
                ← Browse all locations
              </Link>
              {state && (
                <Link href={`/state/${toSlug(state)}`} className="transition hover:text-[#071633]">
                  {state}
                </Link>
              )}
              {parentCity && (
                <Link href={`/city/${toSlug(parentCity)}`} className="transition hover:text-[#071633]">
                  Part of {parentCity}
                </Link>
              )}
              <span>{submissions.length} {submissions.length === 1 ? 'submission' : 'submissions'} reported</span>
            </div>

            {aliases && (
              <p className="mt-2 text-sm text-[#94A3B8]">
                Includes submissions from {aliases.join(', ')}.
              </p>
            )}
          </div>

          <Link
            href="/submit"
            className="inline-flex w-fit items-center justify-center rounded-full bg-[#071633] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#13284F]"
          >
            Submit salary
          </Link>
        </div>

        <div className="mt-10 border-t border-[#E1E8EF] pt-8">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">
            Filter by profession
          </label>
          <select
            value={selectedProfession}
            onChange={e => setSelectedProfession(e.target.value)}
            className="w-full max-w-sm border-b border-[#071633] bg-transparent pb-2 text-xl font-semibold text-[#071633] outline-none"
          >
            {allProfessions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">
            Reported pay range
          </p>

          <p className="mt-2 font-serif text-4xl font-semibold tracking-[-0.02em] text-[#071633] md:text-5xl">
            {hasSalaryData ? `${formatMoney(rangeMin)} – ${formatMoney(rangeMax)}` : '$0'}
            <span className="ml-2 text-lg font-normal text-[#94A3B8]">/hr</span>
          </p>

          {hasSalaryData ? (
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
          ) : (
            <p className="mt-4 text-sm text-[#94A3B8]">
              Not enough data yet for {selectedProfession === 'All Professions' ? city : `${selectedProfession} in ${city}`}.
            </p>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[#E1E8EF] pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0F766E]">
              100% anonymous always
            </p>

            <h2 className="mt-1 font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
              Help grow the {city} salary database.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
              The more data we have, the easier it is for healthcare workers to compare pay
              by city, facility, role, and experience level with confidence.
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
        <CityFilters submissions={filtered} count={count} city={city} />
      </div>
    </main>
  )
}