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

function formatMoney(value: number) {
  if (!value || Number.isNaN(value)) return '$0.00'

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
}

type StateData = {
  state: string
  avg: number
  count: number
}

type Props = {
  topStates: string[]
  topCities: string[]
  initialMapData: StateData[]
}

export default function LocationsClient({
  topStates,
  topCities,
  initialMapData,
}: Props) {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<'states' | 'cities'>('states')
  const [rankingTab, setRankingTab] = useState<'states' | 'cities'>('states')
  const [showDropdown, setShowDropdown] = useState(false)
  const [placeSuggestions, setPlaceSuggestions] = useState<{ name: string; fullText: string }[]>([])
  const [mapData, setMapData] = useState<StateData[]>(initialMapData)
  const [selectedProfession, setSelectedProfession] = useState('All Professions')
  const [tooltip, setTooltip] = useState<{
    name: string
    avg: number
    x: number
    y: number
  } | null>(null)
  const [mapLoading, setMapLoading] = useState(false)

  const router = useRouter()
  const inputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedProfession === 'All Professions') {
      setMapData(initialMapData)
      return
    }

    setMapLoading(true)

    fetch(`/api/roles?mapData=true&profession=${encodeURIComponent(selectedProfession)}`, {
      cache: 'no-store',
    })
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
    if (searchType !== 'cities' || !query || query.length < 2) {
      setPlaceSuggestions([])
      return
    }

    const fetchCities = async () => {
      try {
        const { AutocompleteSuggestion } =
          (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary

        const result =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: query,
            includedPrimaryTypes: ['locality'],
          })

        setPlaceSuggestions(
          result.suggestions
            .map(s => {
              const placePrediction = s.placePrediction

              if (!placePrediction) return null

              return {
                name: placePrediction.mainText?.toString() ?? '',
                fullText: placePrediction.text?.toString() ?? '',
              }
            })
            .filter(
              (s): s is { name: string; fullText: string } => s !== null
            )
            .slice(0, 10)
        )

        setShowDropdown(true)
      } catch {
        setPlaceSuggestions([])
      }
    }

    const timer = setTimeout(fetchCities, 250)
    return () => clearTimeout(timer)
  }, [query, searchType])

  const stateMap = Object.fromEntries(mapData.map(d => [d.state, d]))
  const avgs = mapData.map(d => d.avg)
  const min = avgs.length > 0 ? Math.min(...avgs) : 0
  const max = avgs.length > 0 ? Math.max(...avgs) : 100

  const stateSuggestions = states
    .filter(
      state =>
        state.toLowerCase().includes(query.toLowerCase()) &&
        query.length > 0
    )
    .slice(0, 10)

  const activeSuggestions =
    searchType === 'states' ? stateSuggestions : placeSuggestions

  const rankingItems = rankingTab === 'states' ? topStates : topCities

  function handleSelectState(state: string) {
    setQuery(state)
    setShowDropdown(false)
    router.push(`/state/${toSlug(state)}`)
  }

  function handleSelectCity(city: string, fullText?: string) {
    const cityName = city.split(',')[0]

    setQuery(fullText || cityName)
    setShowDropdown(false)
    router.push(`/city/${toSlug(cityName)}`)
  }

  function handleSearch() {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return

    if (searchType === 'states') {
      const exactStateMatch = states.find(
        state => state.toLowerCase() === trimmedQuery.toLowerCase()
      )

      if (exactStateMatch) {
        handleSelectState(exactStateMatch)
        return
      }

      if (stateSuggestions.length > 0) {
        handleSelectState(stateSuggestions[0])
      }

      return
    }

    if (placeSuggestions.length > 0) {
      handleSelectCity(placeSuggestions[0].name, placeSuggestions[0].fullText)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="relative overflow-visible rounded-[2.35rem] border border-[#D5E2E6] bg-[linear-gradient(145deg,#FFFFFF_0%,#F7FBFA_46%,#EEF6FA_100%)] p-6 shadow-[0_26px_80px_rgba(7,17,38,0.09)] md:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#DCECF8]/80 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-[#DDEFEA]/70 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <p className="mb-4 text-s font-semibold uppercase tracking-[0.22em] text-[#5F7182]">
              Start here
            </p>

            <p className="mx-auto mt-4 text-lg max-w-2xl text-base text-black">
              Choose a city or state, then compare anonymous healthcare salary
              reports in that area.
            </p>

            <div
              ref={inputRef}
              className="relative z-30 mx-auto mt-8 max-w-3xl text-left"
            >
              <div className="rounded-[2rem] border border-[#D5E2E6] bg-white p-3 shadow-[0_26px_80px_rgba(7,17,38,0.12)]">
                <div className="mb-3 flex flex-col gap-3 rounded-[1.45rem] bg-[#F7FBFA] p-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="px-2 text-sm font-semibold text-[#637384]">
                    Search by:
                  </p>

                  <div className="inline-flex rounded-full border border-[#D9E5E8] bg-white p-1">
                    {(['states', 'cities'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setSearchType(type)
                          setQuery('')
                          setShowDropdown(false)
                          setPlaceSuggestions([])
                        }}
                        className={`rounded-full px-30 py-2 text-sm font-semibold transition ${
                          searchType === type
                            ? 'bg-[#06183A] text-white shadow-sm'
                            : 'text-[#637384] hover:text-[#071126]'
                        }`}
                      >
                        {type === 'states' ? 'State' : 'City'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex min-h-[64px] flex-1 items-center gap-3 px-4">
                    <span className="text-lg text-[#8A99A7]">⌕</span>

                    <input
                      value={query}
                      onChange={e => {
                        setQuery(e.target.value)
                        setShowDropdown(true)
                      }}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setShowDropdown(true)}
                      placeholder={
                        searchType === 'states'
                          ? 'Search a state, like New York'
                          : 'Search a city, like New York City'
                      }
                      className="w-full bg-transparent text-base font-semibold text-[#071126] outline-none placeholder:text-[#9AA8B6]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSearch}
                    className="min-h-[56px] rounded-[1.35rem] bg-[#06183A] px-8 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(6,24,58,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0A214C]"
                  >
                    Search
                  </button>
                </div>
              </div>

              {showDropdown && query.length > 0 && activeSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 z-[999] mt-3 max-h-[360px] w-full overflow-y-auto overscroll-contain rounded-[1.5rem] border border-[#D9E5E8] bg-white p-2 shadow-[0_22px_60px_rgba(7,17,38,0.14)]">
                  <p className="px-4 pb-2 pt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#8A99A7]">
                    {searchType === 'states' ? 'Matching states' : 'Matching cities'}
                  </p>

                  {searchType === 'states'
                    ? stateSuggestions.map(state => (
                        <button
                          key={state}
                          type="button"
                          onClick={() => handleSelectState(state)}
                          className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-[#F7FBFA]"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#071126]">
                              {state}
                            </p>

                            <p className="mt-0.5 text-xs text-[#8A99A7]">
                              View statewide salary reports
                            </p>
                          </div>

                          <span className="text-sm text-[#8A99A7]">→</span>
                        </button>
                      ))
                    : placeSuggestions.map(city => (
                        <button
                          key={city.fullText}
                          type="button"
                          onClick={() =>
                            handleSelectCity(city.name, city.fullText)
                          }
                          className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-[#F7FBFA]"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#071126]">
                              {city.name}
                            </p>

                            <p className="mt-0.5 text-xs text-[#8A99A7]">
                              {city.fullText}
                            </p>
                          </div>

                          <span className="text-sm text-[#8A99A7]">→</span>
                        </button>
                      ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-[#637384]">
                <button
                  type="button"
                  onClick={() => {
                    setSearchType('states')
                    handleSelectState('California')
                  }}
                  className="rounded-full border border-[#D9E5E8] bg-white/82 px-4 py-2 shadow-sm transition hover:border-[#BFD4DA] hover:text-[#071126]"
                >
                  California
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSearchType('states')
                    handleSelectState('New York')
                  }}
                  className="rounded-full border border-[#D9E5E8] bg-white/82 px-4 py-2 shadow-sm transition hover:border-[#BFD4DA] hover:text-[#071126]"
                >
                  New York
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSearchType('states')
                    handleSelectState('Texas')
                  }}
                  className="rounded-full border border-[#D9E5E8] bg-white/82 px-4 py-2 shadow-sm transition hover:border-[#BFD4DA] hover:text-[#071126]"
                >
                  Texas
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="overflow-hidden rounded-[2rem] border border-[#D9E5E8] bg-white/88 shadow-[0_18px_60px_rgba(7,17,38,0.055)]">
          <div className="grid gap-0 lg:grid-cols-[300px_1fr]">
            <aside className="border-b border-[#E3ECEF] bg-[linear-gradient(145deg,#F8FCFB_0%,#EFF7F7_100%)] p-6 lg:border-b-0 lg:border-r">
              <p className="text-sm font-semibold text-[#346C83]">
                Explore salaries nationwide
              </p>

              <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-[-0.03em] text-[#071126]">
                Average pay by state.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#687887]">
                Hover over a state to preview average reported pay, or click to view detailed pay info for that state.
              </p>

              <div className="mt-6">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A99A7]">
                  Filter by profession
                </label>

                <select
                  value={selectedProfession}
                  onChange={e => setSelectedProfession(e.target.value)}
                  className="mt-3 w-full rounded-2xl border border-[#D9E5E8] bg-white px-4 py-3 text-sm font-semibold text-[#253449] outline-none transition focus:border-[#BFD4DA]"
                >
                  {allProfessions.map(p => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 rounded-[1.4rem] border border-[#D9E5E8] bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A99A7]">
                  Current view
                </p>

                <p className="mt-2 text-sm font-semibold text-[#071126]">
                  {selectedProfession}
                </p>

                <p className="mt-1 text-xs leading-5 text-[#687887]">
                  Based on available anonymous salary submissions.
                </p>
              </div>
            </aside>

            <div className="p-4 md:p-5">
              <div
                className="relative overflow-hidden rounded-[1.6rem] border border-[#D9E5E8] bg-[linear-gradient(145deg,#FFFFFF_0%,#F8FBFB_100%)]"
                style={{ height: '500px' }}
              >
                {tooltip && (
                  <div
                    className="pointer-events-none fixed z-50 rounded-2xl border border-[#D9E5E8] bg-white px-4 py-3 text-sm shadow-[0_18px_45px_rgba(7,17,38,0.16)]"
                    style={{ left: tooltip.x + 16, top: tooltip.y - 60 }}
                  >
                    <p className="font-semibold text-[#071126]">
                      {tooltip.name}
                    </p>
                    <p className="mt-1 font-semibold text-[#346C83]">
                      {formatMoney(tooltip.avg)}/hr avg
                    </p>
                  </div>
                )}

                {mapLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm font-medium text-[#8A99A7]">
                      Loading map...
                    </p>
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

              <div className="mt-4 grid gap-3 text-sm text-[#687887] md:grid-cols-3">
                <div className="rounded-2xl bg-[#F8FBFB] p-4">
                  <p className="font-semibold text-[#253449]">Darker states</p>
                  <p className="mt-1 text-xs leading-5">
                    Higher average reported hourly pay.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F8FBFB] p-4">
                  <p className="font-semibold text-[#253449]">Lighter states</p>
                  <p className="mt-1 text-xs leading-5">
                    Lower average reported hourly pay.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F8FBFB] p-4">
                  <p className="font-semibold text-[#253449]">Gray states</p>
                  <p className="mt-1 text-xs leading-5">
                    Not enough salary submissions yet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="overflow-hidden rounded-[2rem] border border-[#D9E5E8] bg-white/88 shadow-[0_18px_60px_rgba(7,17,38,0.055)]">
          <div className="grid gap-0 lg:grid-cols-[300px_1fr]">
            <aside className="border-b border-[#E3ECEF] bg-[linear-gradient(145deg,#F8FCFB_0%,#EFF7F7_100%)] p-6 lg:border-b-0 lg:border-r">
              <p className="text-sm font-semibold text-[#346C83]">
                Location rankings
              </p>

              <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-[-0.03em] text-[#071126]">
                {rankingTab === 'states'
                  ? 'Top paying states.'
                  : 'Top paying cities.'}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#687887]">
                Toggle between states and cities and see where your colleages are making the
              </p>

              <div className="mt-6 inline-flex rounded-full border border-[#D9E5E8] bg-white p-1">
                {(['states', 'cities'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setRankingTab(t)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      rankingTab === t
                        ? 'bg-[#06183A] text-white shadow-sm'
                        : 'text-[#637384] hover:text-[#071126]'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </aside>

            <div className="p-4 md:p-5">
              <div className="overflow-hidden rounded-[1.5rem] border border-[#D9E5E8]">
                <div className="grid grid-cols-[72px_1fr_auto] bg-[#F8FBFB] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#637384]">
                  <span>Rank</span>
                  <span>Location</span>
                  <span className="text-right">Explore</span>
                </div>

                {rankingItems.map((location, i) => {
                  const cityName = location.split(',')[0]
                  const stateName = location.split(',')[1]?.trim()
                  const href =
                    rankingTab === 'states'
                      ? `/state/${toSlug(location)}`
                      : `/city/${toSlug(cityName)}`

                  return (
                    <Link
                      key={location}
                      href={href}
                      className="group grid grid-cols-[72px_1fr_auto] items-center border-t border-[#D9E5E8] bg-white px-5 py-4 transition hover:bg-[#F8FBFB]"
                    >
                      <div>
                        <span
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                            i === 0
                              ? 'bg-[#DDEFEA] text-[#346C83]'
                              : i === 1
                                ? 'bg-[#EAF5FA] text-[#315D7E]'
                                : i === 2
                                  ? 'bg-[#F3EFE5] text-[#7A5A1A]'
                                  : 'border border-[#D9E5E8] bg-white text-[#637384]'
                          }`}
                        >
                          {i + 1}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#071126] transition group-hover:text-[#346C83]">
                          {rankingTab === 'states' ? location : cityName}
                        </p>

                        <p className="mt-1 text-xs text-[#687887]">
                          {rankingTab === 'states'
                            ? 'State salary ranking'
                            : stateName || 'City salary ranking'}
                        </p>
                      </div>

                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D4E2E6] bg-white text-[#5A7280] transition group-hover:border-[#06183A] group-hover:bg-[#06183A] group-hover:text-white">
                        →
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}