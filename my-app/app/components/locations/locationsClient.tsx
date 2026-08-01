'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { states } from '../../data/states'
import { professions } from '../../data/professions'
import dynamic from 'next/dynamic'
import type { SubmissionRow } from '../../location/page.tsx'

const UsMap = dynamic(() => import('../map/UsMap'), { ssr: false })

const allProfessions = ['All Professions', ...Object.values(professions).flat()]

const TOP_STATE_COUNT = 10
const TOP_CITY_COUNT = 10

function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-')
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

function median(values: number[]) {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function tierFor(years: number): 'entry' | 'mid' | 'senior' {
  if (years <= 2) return 'entry'
  if (years <= 9) return 'mid'
  return 'senior'
}

type ExperienceTiers = { entry: number | null; mid: number | null; senior: number | null }
type StateStat = { state: string; median: number; count: number } & ExperienceTiers
type CityStat = { city: string; state: string; median: number; count: number } & ExperienceTiers

function tierLine(item: ExperienceTiers) {
  const parts: string[] = []
  if (item.entry !== null) parts.push(`Entry ${formatMoney(item.entry)}`)
  if (item.mid !== null) parts.push(`Mid ${formatMoney(item.mid)}`)
  if (item.senior !== null) parts.push(`Senior ${formatMoney(item.senior)}`)
  return parts.join('  ·  ')
}

type Props = {
  submissions: SubmissionRow[]
}

export default function LocationsClient({ submissions }: Props) {
  const [selectedProfession, setSelectedProfession] = useState('All Professions')

  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<'states' | 'cities'>('states')
  const [rankingTab, setRankingTab] = useState<'states' | 'cities'>('states')
  const [showDropdown, setShowDropdown] = useState(false)
  const [placeSuggestions, setPlaceSuggestions] = useState<{ name: string; fullText: string }[]>([])
  const [tooltip, setTooltip] = useState<{ name: string; avg: number; x: number; y: number } | null>(null)

  const router = useRouter()
  const inputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) setShowDropdown(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (searchType !== 'cities' || !query || query.length < 2) {
      setPlaceSuggestions([])
      return
    }
    const fetchCities = async () => {
      try {
        const { AutocompleteSuggestion } = (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary
        const result = await AutocompleteSuggestion.fetchAutocompleteSuggestions({ input: query })

        setPlaceSuggestions(
          result.suggestions
            .filter(s => {
              const types = s.placePrediction?.types ?? []
              return types.some(t =>
                ['locality', 'sublocality', 'sublocality_level_1', 'neighborhood', 'postal_town'].includes(t)
              )
            })
            .map(s => {
              const p = s.placePrediction
              if (!p) return null
              return { name: p.mainText?.toString() ?? '', fullText: p.text?.toString() ?? '' }
            })
            .filter((s): s is { name: string; fullText: string } => s !== null)
            .slice(0, 10)
        )
        setShowDropdown(true)
      } catch { setPlaceSuggestions([]) }
    }
    const timer = setTimeout(fetchCities, 250)
    return () => clearTimeout(timer)
  }, [query, searchType])

  const filtered = useMemo(() => {
    if (selectedProfession === 'All Professions') return submissions
    return submissions.filter(s => s.profession === selectedProfession)
  }, [submissions, selectedProfession])

  const nationalMedian = useMemo(() => median(filtered.map(s => s.rate)), [filtered])

  const stateStats: StateStat[] = useMemo(() => {
    const map = new Map<string, { all: number[]; entry: number[]; mid: number[]; senior: number[] }>()
    filtered.forEach(s => {
      if (!map.has(s.state)) map.set(s.state, { all: [], entry: [], mid: [], senior: [] })
      const bucket = map.get(s.state)!
      bucket.all.push(s.rate)
      bucket[tierFor(s.years)].push(s.rate)
    })
    return Array.from(map.entries()).map(([state, b]) => ({
      state,
      median: median(b.all),
      count: b.all.length,
      entry: b.entry.length ? median(b.entry) : null,
      mid: b.mid.length ? median(b.mid) : null,
      senior: b.senior.length ? median(b.senior) : null,
    }))
  }, [filtered])

  const topStateStats = useMemo(
    () => [...stateStats].sort((a, b) => b.median - a.median).slice(0, TOP_STATE_COUNT),
    [stateStats]
  )

  const highestPayState = topStateStats[0] ?? null
  const mostReportedState = useMemo(
    () => [...stateStats].sort((a, b) => b.count - a.count)[0] ?? null,
    [stateStats]
  )

  const topStateNames = useMemo(() => new Set(topStateStats.map(s => s.state)), [topStateStats])

  const cityStats: CityStat[] = useMemo(() => {
    const map = new Map<string, { city: string; state: string; all: number[]; entry: number[]; mid: number[]; senior: number[] }>()
    filtered.forEach(s => {
      if (!topStateNames.has(s.state)) return
      const key = `${s.city}, ${s.state}`
      if (!map.has(key)) map.set(key, { city: s.city, state: s.state, all: [], entry: [], mid: [], senior: [] })
      const bucket = map.get(key)!
      bucket.all.push(s.rate)
      bucket[tierFor(s.years)].push(s.rate)
    })
    return Array.from(map.values())
      .map(v => ({
        city: v.city,
        state: v.state,
        median: median(v.all),
        count: v.all.length,
        entry: v.entry.length ? median(v.entry) : null,
        mid: v.mid.length ? median(v.mid) : null,
        senior: v.senior.length ? median(v.senior) : null,
      }))
      .sort((a, b) => b.median - a.median)
      .slice(0, TOP_CITY_COUNT)
  }, [filtered, topStateNames])

  const stateMap = useMemo(
    () => Object.fromEntries(stateStats.map(s => [s.state, { state: s.state, avg: s.median, count: s.count }])),
    [stateStats]
  )
  const medians = stateStats.map(s => s.median)
  const min = medians.length > 0 ? Math.min(...medians) : 0
  const max = medians.length > 0 ? Math.max(...medians) : 100

  const stateSuggestions = states.filter(s => s.toLowerCase().includes(query.toLowerCase()) && query.length > 0).slice(0, 10)
  const activeSuggestions = searchType === 'states' ? stateSuggestions : placeSuggestions
  const rankingItems: (StateStat | CityStat)[] = rankingTab === 'states' ? topStateStats : cityStats

  function handleSelectState(state: string) {
    setQuery(state); setShowDropdown(false); router.push(`/state/${toSlug(state)}`)
  }

  function handleSelectCity(city: string, fullText?: string) {
    const cityName = city.split(',')[0]
    setQuery(fullText || cityName); setShowDropdown(false); router.push(`/city/${toSlug(cityName)}`)
  }

  function handleSearch() {
    const q = query.trim()
    if (!q) return
    if (searchType === 'states') {
      const match = states.find(s => s.toLowerCase() === q.toLowerCase())
      if (match) { handleSelectState(match); return }
      if (stateSuggestions.length > 0) handleSelectState(stateSuggestions[0])
      return
    }
    if (placeSuggestions.length > 0) handleSelectCity(placeSuggestions[0].name, placeSuggestions[0].fullText)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div>

      <div className="flex flex-col gap-6 border-b border-[#E1E8EF] pb-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">

        <div className="lg:max-w-xs lg:shrink-0">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">
            Filter by profession
          </label>
          <select
            value={selectedProfession}
            onChange={e => setSelectedProfession(e.target.value)}
            className="w-full border-b border-[#071633] bg-transparent pb-2 text-xl font-semibold text-[#071633] outline-none"
          >
            {allProfessions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <p className="mt-2 text-sm text-[#64748B]">
            {filtered.length} matching {filtered.length === 1 ? 'submission' : 'submissions'}
          </p>
        </div>

        <div ref={inputRef} className="relative flex-1">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">
            Search a state or city
          </label>

          <div className="mb-3 flex items-center gap-6">
            {(['states', 'cities'] as const).map(type => {
              const isActive = searchType === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => { setSearchType(type); setQuery(''); setShowDropdown(false); setPlaceSuggestions([]) }}
                  className={`relative pb-1.5 text-sm font-bold transition ${
                    isActive ? 'text-[#071633]' : 'text-[#94A3B8] hover:text-[#64748B]'
                  }`}
                >
                  {type === 'states' ? 'State' : 'City'}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-0.5 h-[2.5px] rounded-full bg-[#071633]" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3 border-b border-[#E1E8EF] py-2.5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="shrink-0 text-[#64748B]"
            >
              <path
                d="M10.75 18.5a7.75 7.75 0 1 1 0-15.5 7.75 7.75 0 0 1 0 15.5Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>

            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setShowDropdown(true) }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowDropdown(true)}
              placeholder={searchType === 'states' ? 'Search a state, like New York' : 'Search a city, like Brooklyn or Miami'}
              className="min-w-0 flex-1 bg-transparent text-lg font-semibold text-[#071633] outline-none placeholder:text-[#94A3B8]"
            />

            <button
              type="button"
              onClick={handleSearch}
              className="shrink-0 text-sm font-bold text-[#071633] transition hover:text-[#0F766E]"
            >
              Search →
            </button>
          </div>

          {showDropdown && query.length > 0 && activeSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 z-[999] mt-2 max-h-[360px] w-full overflow-y-auto overscroll-contain rounded-md border border-[#E1E8EF] bg-white p-2">
              <p className="px-3 pb-2 pt-2 text-xs font-bold uppercase tracking-[0.16em] text-[#94A3B8]">
                {searchType === 'states' ? 'Matching states' : 'Matching cities'}
              </p>

              {searchType === 'states'
                ? stateSuggestions.map(state => (
                    <button
                      key={state}
                      type="button"
                      onClick={() => handleSelectState(state)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left transition hover:bg-[#FAFBFD]"
                    >
                      <div>
                        <p className="text-sm font-bold text-[#071633]">{state}</p>
                        <p className="mt-0.5 text-xs font-medium text-[#94A3B8]">
                          View statewide salary reports
                        </p>
                      </div>
                      <span className="text-sm font-bold text-[#64748B]">→</span>
                    </button>
                  ))
                : placeSuggestions.map(city => (
                    <button
                      key={city.fullText}
                      type="button"
                      onClick={() => handleSelectCity(city.name, city.fullText)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left transition hover:bg-[#FAFBFD]"
                    >
                      <div>
                        <p className="text-sm font-bold text-[#071633]">{city.name}</p>
                        <p className="mt-0.5 text-xs font-medium text-[#94A3B8]">
                          {city.fullText}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-[#64748B]">→</span>
                    </button>
                  ))}
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-[#64748B]">
            {['California', 'New York', 'Texas'].map(state => (
              <button
                key={state}
                type="button"
                onClick={() => { setSearchType('states'); handleSelectState(state) }}
                className="transition hover:text-[#071633]"
              >
                {state}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">
          National snapshot
        </p>

        <p className="mt-2 font-serif text-5xl font-semibold tracking-[-0.02em] text-[#071633] md:text-6xl">
          {formatMoney(nationalMedian)}
          <span className="ml-2 text-xl font-normal text-[#94A3B8]">/hr median{selectedProfession !== 'All Professions' ? '' : ' nationwide'}</span>
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[#0F766E]">
              Highest paying state
            </p>
            <p className="mt-1.5 font-serif text-3xl font-semibold text-[#071633]">
              {highestPayState?.state ?? '—'}
            </p>
            <p className="mt-1 font-mono text-base tabular-nums text-[#64748B]">
              {highestPayState ? `${formatMoney(highestPayState.median)}/hr median` : 'No data yet'}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[#2F5EA8]">
              Most reports
            </p>
            <p className="mt-1.5 font-serif text-3xl font-semibold text-[#071633]">
              {mostReportedState?.state ?? '—'}
            </p>
            <p className="mt-1 font-mono text-base tabular-nums text-[#64748B]">
              {mostReportedState ? `${mostReportedState.count} submissions` : 'No data yet'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-[#E1E8EF] pt-12">
        <div className="mb-6">
          <p className="text-base font-semibold text-[#0F766E]">Interactive map</p>
          <h2 className="mt-2 font-serif text-3xl font-medium tracking-[-0.02em] text-[#071633] md:text-4xl">
            Median pay by state
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-7 text-[#64748B]">
            Hover a state for the median reported pay
            {selectedProfession !== 'All Professions' ? ` for ${selectedProfession}` : ''}. Click to see the full breakdown.
          </p>
        </div>

        <div className="relative h-[380px] sm:h-[460px] lg:h-[580px]">
          {tooltip && (
            <div
              className="pointer-events-none fixed z-50 rounded-md border border-[#E1E8EF] bg-white px-4 py-3 text-sm"
              style={{ left: tooltip.x + 16, top: tooltip.y - 60 }}
            >
              <p className="font-semibold text-[#071633]">{tooltip.name}</p>
              <p className="mt-1 font-semibold text-[#0F766E]">{formatMoney(tooltip.avg)}/hr median</p>
            </div>
          )}

          <UsMap stateMap={stateMap} min={min} max={max} onHover={setTooltip} />
        </div>
      </div>

      <div className="mt-16 border-t border-[#E1E8EF] pt-12">
        <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-base font-semibold text-[#0F766E]">Location rankings</p>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-[-0.02em] text-[#071633] md:text-4xl">
              {rankingTab === 'states' ? 'Highest paying states' : 'Highest paying cities'}
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-7 text-[#64748B]">
              {rankingTab === 'states'
                ? 'Ranked by median reported pay.'
                : `Ranked by median pay, within the top ${TOP_STATE_COUNT} highest-paying states above.`}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-6">
            {(['states', 'cities'] as const).map(t => {
              const isActive = rankingTab === t
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setRankingTab(t)}
                  className={`relative pb-2 text-base font-bold transition ${
                    isActive ? 'text-[#071633]' : 'text-[#94A3B8] hover:text-[#64748B]'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-0.5 h-[2.5px] rounded-full bg-[#071633]" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-b border-[#E1E8EF] px-1 pb-2">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
            Rank &amp; Location
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
            Median /hr
          </span>
        </div>

        <div className="divide-y divide-[#EDF1F5]">
          {rankingItems.length === 0 && (
            <p className="py-6 text-base text-[#94A3B8]">
              Not enough data yet for {selectedProfession === 'All Professions' ? 'this view' : selectedProfession}.
            </p>
          )}

          {rankingItems.map((item, i) => {
            const isState = rankingTab === 'states'
            const label = isState ? (item as StateStat).state : (item as CityStat).city
            const sublabel = isState
              ? `${item.count} ${item.count === 1 ? 'submission' : 'submissions'}`
              : `${(item as CityStat).state} · ${item.count} ${item.count === 1 ? 'submission' : 'submissions'}`
            const href = isState
              ? `/state/${toSlug((item as StateStat).state)}`
              : `/city/${toSlug((item as CityStat).city)}`
            const tiers = tierLine(item)

            return (
              <Link
                key={isState ? label : `${label}-${(item as CityStat).state}`}
                href={href}
                className="group flex flex-col gap-3 py-5 transition hover:bg-white sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="flex items-start gap-4">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-semibold ${
                    i === 0 ? 'bg-[#E8F5F2] text-[#0F766E]'
                    : i === 1 ? 'bg-[#EAF0F8] text-[#2F5EA8]'
                    : i === 2 ? 'bg-[#F5F0E8] text-[#B8791A]'
                    : 'border border-[#E1E8EF] text-[#94A3B8]'
                  }`}>
                    {i + 1}
                  </span>

                  <div>
                    <p className="text-lg font-medium text-[#071633] transition group-hover:text-[#0F766E]">
                      {label}
                    </p>
                    <p className="mt-0.5 text-sm text-[#94A3B8]">
                      {sublabel}
                    </p>
                    {tiers && (
                      <p className="mt-1.5 font-mono text-xs tabular-nums text-[#94A3B8]">
                        {tiers}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 self-end sm:self-auto">
                  <span className="font-mono text-base tabular-nums text-[#64748B]">
                    {formatMoney(item.median)}
                  </span>
                  <span className="text-[#94A3B8] transition group-hover:translate-x-0.5 group-hover:text-[#071633]">
                    →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}