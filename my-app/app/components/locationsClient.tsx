'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { states } from '../data/states'
import { professions } from '../data/professions'
import dynamic from 'next/dynamic'

const UsMap = dynamic(() => import('./map/UsMap'), { ssr: false })

const allProfessions = ['All Professions', ...Object.values(professions).flat()]

function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-')
}

type StateData = { state: string; avg: number; count: number }

type Props = {
  topStates: string[]
  topCities: string[]
  initialMapData: StateData[]
}

export default function LocationsClient({ topStates, topCities, initialMapData }: Props) {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'states' | 'cities'>('states')
  const [showDropdown, setShowDropdown] = useState(false)
  const [placeSuggestions, setPlaceSuggestions] = useState<{ name: string; fullText: string }[]>([])
  const [mapData, setMapData] = useState<StateData[]>(initialMapData)
  const [selectedProfession, setSelectedProfession] = useState('All Professions')
  const [tooltip, setTooltip] = useState<{ name: string; avg: number; x: number; y: number } | null>(null)
  const [mapLoading, setMapLoading] = useState(false)

  const router = useRouter()
  const inputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedProfession === 'All Professions') {
      setMapData(initialMapData)
      return
    }

    setMapLoading(true)

    fetch(`/api/explore?profession=${encodeURIComponent(selectedProfession)}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        setMapData(d)
        setMapLoading(false)
      })
      .catch(() => setMapLoading(false))
  }, [selectedProfession, initialMapData])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (tab !== 'cities' || !query || query.length < 2) {
      setPlaceSuggestions([])
      return
    }

    const fetchCities = async () => {
      try {
        const { AutocompleteSuggestion } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary

        const result = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: query,
          includedPrimaryTypes: ['locality'],
        })

        setPlaceSuggestions(
          result.suggestions.map(s => ({
            name: s.placePrediction.mainText.toString(),
            fullText: s.placePrediction.text.toString(),
          }))
        )

        setShowDropdown(true)
      } catch {
        setPlaceSuggestions([])
      }
    }

    const timer = setTimeout(fetchCities, 300)
    return () => clearTimeout(timer)
  }, [query, tab])

  const stateMap = Object.fromEntries(mapData.map(d => [d.state, d]))
  const avgs = mapData.map(d => d.avg)
  const min = avgs.length > 0 ? Math.min(...avgs) : 0
  const max = avgs.length > 0 ? Math.max(...avgs) : 100

  const stateSuggestions = states
    .filter(s => s.toLowerCase().includes(query.toLowerCase()) && query.length > 0)
    .slice(0, 6)

  const filteredStates = states.filter(s =>
    s.toLowerCase().includes(query.toLowerCase())
  )

  const filteredCities = topCities.filter(c =>
    c.toLowerCase().includes(query.toLowerCase())
  )

  function handleSelect(value: string, fullText?: string) {
    setQuery(fullText || value)
    setShowDropdown(false)

    if (tab === 'states') {
      router.push(`/state/${toSlug(value)}`)
    } else {
      const cityName = value.split(',')[0]
      router.push(`/city/${toSlug(cityName)}`)
    }
  }

  function handleSearch() {
    if (!query) return

    if (tab === 'states' && stateSuggestions.length > 0) {
      handleSelect(stateSuggestions[0])
    } else if (tab === 'cities' && placeSuggestions.length > 0) {
      handleSelect(placeSuggestions[0].name, placeSuggestions[0].fullText)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#EEF2FF_0%,_transparent_36%)] pointer-events-none" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-14 md:px-8 md:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-xs font-medium text-[#475569]">
              Explore salary data
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-[#0F172A] md:text-6xl">
              Browse healthcare salaries by location.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#64748B] md:text-lg">
              Explore how healthcare compensation varies across states and cities using real, anonymous salary submissions.
            </p>

            <div className="mt-6 flex gap-2">
              {(['states', 'cities'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t)
                    setQuery('')
                    setShowDropdown(false)
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    tab === t
                      ? 'bg-[#4C6FFF] text-white'
                      : 'border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:border-[#C7D2FE] hover:bg-white hover:text-[#4C6FFF]'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div ref={inputRef} className="relative mt-4 max-w-xl">
              <div className="flex overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setShowDropdown(true)
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowDropdown(true)}
                  placeholder={tab === 'states' ? 'Search a state...' : 'Search a city...'}
                  className="flex-1 px-5 py-4 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                />

                <button
                  onClick={handleSearch}
                  className="bg-[#4C6FFF] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#3B5BDB]"
                >
                  Search
                </button>
              </div>

              {showDropdown && (tab === 'states' ? stateSuggestions.length > 0 : placeSuggestions.length > 0) && (
                <ul className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xl">
                  {tab === 'states'
                    ? stateSuggestions.map(s => (
                        <li
                          key={s}
                          onClick={() => handleSelect(s)}
                          className="cursor-pointer px-5 py-3 text-sm text-[#334155] transition hover:bg-[#F1F5F9] hover:text-[#4C6FFF]"
                        >
                          {s}
                        </li>
                      ))
                    : placeSuggestions.map(s => (
                        <li
                          key={s.fullText}
                          onClick={() => handleSelect(s.name, s.fullText)}
                          className="cursor-pointer px-5 py-3 text-sm text-[#334155] transition hover:bg-[#F1F5F9] hover:text-[#4C6FFF]"
                        >
                          <p className="font-medium">{s.name}</p>
                          <p className="mt-0.5 text-xs text-[#94A3B8]">{s.fullText}</p>
                        </li>
                      ))}
                </ul>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-[#64748B]">
              <span className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2">
                All 50 states covered
              </span>
              <span className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2">
                Anonymous submissions
              </span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E2E8F0] bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-medium text-[#4C6FFF]">
              What you can explore
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
              Compare pay across regions.
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
              Search by state or city, then dig into submissions by profession, hospital, experience, and pay type.
            </p>

            <div className="mt-5 grid gap-3 text-sm text-[#475569]">
              <div className="rounded-2xl bg-white px-4 py-3">
                See differences between states
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                Compare cities within a region
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                Filter the map by profession
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-8 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border border-[#E2E8F0] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.06)] md:p-8">
            <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-medium text-[#4C6FFF]">
                  Interactive map
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">
                  Average healthcare pay by state
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#64748B] md:text-base">
                  Hover over a state to preview average reported pay, or click a state to view detailed salary submissions.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium uppercase tracking-[0.1em] text-[#94A3B8]">
                  Filter by profession
                </label>

                <select
                  value={selectedProfession}
                  onChange={(e) => setSelectedProfession(e.target.value)}
                  className="min-w-[240px] rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#334155] outline-none transition focus:border-[#4C6FFF] focus:bg-white"
                >
                  {allProfessions.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
              <aside className="rounded-[1.5rem] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                <p className="text-sm font-semibold text-[#0F172A]">
                  How to read this map
                </p>

                <div className="mt-5 space-y-4 text-sm text-[#64748B]">
                  <div>
                    <p className="font-medium text-[#334155]">Darker blue</p>
                    <p className="mt-1 text-xs leading-relaxed">
                      Higher average reported hourly pay.
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-[#334155]">Lighter blue</p>
                    <p className="mt-1 text-xs leading-relaxed">
                      Lower average reported hourly pay.
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-[#334155]">Gray states</p>
                    <p className="mt-1 text-xs leading-relaxed">
                      Not enough salary submissions yet.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#94A3B8]">
                    Current view
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#0F172A]">
                    {selectedProfession}
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                    Based on available anonymous submissions.
                  </p>
                </div>
              </aside>

              <div
                className="relative overflow-hidden rounded-[1.5rem] border border-[#E2E8F0] bg-[#F8FAFC]"
                style={{ height: '500px' }}
              >
                {tooltip && (
                  <div
                    className="fixed z-50 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm shadow-lg pointer-events-none"
                    style={{ left: tooltip.x + 16, top: tooltip.y - 60 }}
                  >
                    <p className="font-semibold text-[#0F172A]">{tooltip.name}</p>
                    <p className="font-semibold text-[#4C6FFF]">
                      ${tooltip.avg.toFixed(2)}/hr avg
                    </p>
                  </div>
                )}

                {mapLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-[#94A3B8]">Loading map...</p>
                  </div>
                ) : (
                  <UsMap
                    stateMap={stateMap}
                    min={min}
                    max={max}
                    onHover={setTooltip}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-[#E2E8F0] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.06)] md:p-8">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium text-[#4C6FFF]">
                Location rankings
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">
                {tab === 'states' ? 'Top paying states' : 'Top paying cities'}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#64748B] md:text-base">
                Ranked by average reported pay from anonymous healthcare salary submissions.
              </p>
            </div>

            <div className="flex rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-1">
              {(['states', 'cities'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t)
                    setQuery('')
                    setShowDropdown(false)
                  }}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    tab === t
                      ? 'bg-white text-[#4C6FFF] shadow-sm'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-[#E2E8F0]">
            <div className="grid grid-cols-[72px_1fr_auto] bg-[#F8FAFC] px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#64748B]">
              <span>Rank</span>
              <span>Location</span>
              <span className="text-right">Explore</span>
            </div>

            {(tab === 'states' ? (query ? filteredStates : topStates) : (query ? filteredCities : topCities)).map((location, i) => {
              const cityName = location.split(',')[0]
              const stateName = location.split(',')[1]?.trim()
              const href = tab === 'states'
                ? `/state/${toSlug(location)}`
                : `/city/${toSlug(cityName)}`

              return (
                <Link
                  key={location}
                  href={href}
                  className="group grid grid-cols-[72px_1fr_auto] items-center border-t border-[#E2E8F0] bg-white px-5 py-4 transition hover:bg-[#F8FAFC]"
                >
                  <div>
                    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                      i === 0
                        ? 'bg-[#EEF2FF] text-[#4C6FFF]'
                        : i === 1
                        ? 'bg-[#F1F5F9] text-[#334155]'
                        : i === 2
                        ? 'bg-[#F8FAFC] text-[#475569]'
                        : 'bg-white text-[#64748B] border border-[#E2E8F0]'
                    }`}>
                      {i + 1}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#0F172A] transition group-hover:text-[#4C6FFF]">
                      {tab === 'states' ? location : cityName}
                    </p>

                    <p className="mt-1 text-xs text-[#64748B]">
                      {tab === 'states'
                        ? 'State salary ranking'
                        : stateName || 'City salary ranking'}
                    </p>
                  </div>

                  <span className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-sm text-[#94A3B8] transition group-hover:border-[#C7D2FE] group-hover:text-[#4C6FFF]">
                    →
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
    </main>
  )
}