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

export default function LocationsClient({ topStates, topCities, initialMapData }: Props) {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<'states' | 'cities'>('states')
  const [rankingTab, setRankingTab] = useState<'states' | 'cities'>('states')
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
    fetch(`/api/roles?mapData=true&profession=${encodeURIComponent(selectedProfession)}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setMapData(d); setMapLoading(false) })
      .catch(() => setMapLoading(false))
  }, [selectedProfession, initialMapData])

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

  const stateMap = Object.fromEntries(mapData.map(d => [d.state, d]))
  const avgs = mapData.map(d => d.avg)
  const min = avgs.length > 0 ? Math.min(...avgs) : 0
  const max = avgs.length > 0 ? Math.max(...avgs) : 100

  const stateSuggestions = states.filter(s => s.toLowerCase().includes(query.toLowerCase()) && query.length > 0).slice(0, 10)
  const activeSuggestions = searchType === 'states' ? stateSuggestions : placeSuggestions
  const rankingItems = rankingTab === 'states' ? topStates : topCities

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
    <div className="space-y-16">

      <div>
        <div className="mb-6">
          <p className="text-sm font-semibold text-[#178C85]">Search by location</p>
          <h2 className="mt-2 font-serif text-4xl font-normal tracking-[-0.03em] text-[#071A3D] md:text-5xl">
            Find pay in your area.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#667085]">
            Type a state or city and see what people are reporting nearby.
          </p>
        </div>

        <div ref={inputRef} className="relative max-w-3xl">
          <div className="rounded-[2rem] border border-[#E2E8EF] bg-white p-3 shadow-[0_24px_80px_rgba(7,17,38,0.08)]">
            <div className="mb-3 flex flex-col gap-3 rounded-[1.45rem] bg-[#F8F7F4] p-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="px-2 text-sm font-semibold text-[#8D9AA7]">Search by:</p>
              <div className="inline-flex rounded-full border border-[#E2E8EF] bg-white p-1">
                {(['states', 'cities'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => { setSearchType(type); setQuery(''); setShowDropdown(false); setPlaceSuggestions([]) }}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${searchType === type ? 'bg-[#071A3D] text-white shadow-sm' : 'text-[#8D9AA7] hover:text-[#071A3D]'}`}
                  >
                    {type === 'states' ? 'State' : 'City'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex min-h-[64px] flex-1 items-center gap-3 px-4">
                <span className="text-lg text-[#8D9AA7]">⌕</span>
                <input
                  value={query}
                  onChange={e => { setQuery(e.target.value); setShowDropdown(true) }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowDropdown(true)}
                  placeholder={searchType === 'states' ? 'Search a state, like New York' : 'Search a city, like Brooklyn or Miami'}
                  className="w-full bg-transparent text-base font-semibold text-[#071A3D] outline-none placeholder:text-[#B0BCCE]"
                />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                className="min-h-[56px] rounded-full bg-[#071A3D] px-8 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(7,26,61,0.18)] transition hover:-translate-y-0.5 hover:bg-[#102A5C]"
              >
                Search
              </button>
            </div>
          </div>

          {showDropdown && query.length > 0 && activeSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 z-[999] mt-3 max-h-[360px] w-full overflow-y-auto overscroll-contain rounded-[1.5rem] border border-[#E2E8EF] bg-white p-2 shadow-[0_22px_60px_rgba(7,17,38,0.14)]">
              <p className="px-4 pb-2 pt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#B0BCCE]">
                {searchType === 'states' ? 'Matching states' : 'Matching cities'}
              </p>
              {searchType === 'states'
                ? stateSuggestions.map(state => (
                    <button key={state} type="button" onClick={() => handleSelectState(state)}
                      className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-[#F8F7F4]">
                      <div>
                        <p className="text-sm font-semibold text-[#071A3D]">{state}</p>
                        <p className="mt-0.5 text-xs text-[#B0BCCE]">View statewide salary reports</p>
                      </div>
                      <span className="text-sm text-[#B0BCCE]">→</span>
                    </button>
                  ))
                : placeSuggestions.map(city => (
                    <button key={city.fullText} type="button" onClick={() => handleSelectCity(city.name, city.fullText)}
                      className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-[#F8F7F4]">
                      <div>
                        <p className="text-sm font-semibold text-[#071A3D]">{city.name}</p>
                        <p className="mt-0.5 text-xs text-[#B0BCCE]">{city.fullText}</p>
                      </div>
                      <span className="text-sm text-[#B0BCCE]">→</span>
                    </button>
                  ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2 text-sm text-[#8D9AA7]">
            {['California', 'New York', 'Texas'].map(state => (
              <button key={state} type="button"
                onClick={() => { setSearchType('states'); handleSelectState(state) }}
                className="rounded-full border border-[#E2E8EF] bg-white px-4 py-2 shadow-sm transition hover:border-[#D7E1E7] hover:text-[#071A3D]">
                {state}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-6">
          <p className="text-sm font-semibold text-[#178C85]">Interactive map</p>
          <h2 className="mt-2 font-serif text-4xl font-normal tracking-[-0.03em] text-[#071A3D] md:text-5xl">
            Average pay by state.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#667085]">
            Hover over a state to see the average reported pay. Click to dig into the details.
          </p>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-[#E2E8EF] bg-white shadow-[0_18px_60px_rgba(7,17,38,0.05)]">
          <div className="relative" style={{ height: '580px' }}>
            <div className="absolute left-4 top-4 z-10">
              <div className="rounded-2xl border border-[#E2E8EF] bg-white/95 px-4 py-3 shadow-[0_8px_24px_rgba(7,17,38,0.08)] backdrop-blur-sm">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8D9AA7]">
                  Viewing pay for
                </p>
                <select
                  value={selectedProfession}
                  onChange={e => setSelectedProfession(e.target.value)}
                  className="w-48 bg-transparent text-sm font-semibold text-[#071A3D] outline-none"
                >
                  {allProfessions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {tooltip && (
              <div
                className="pointer-events-none fixed z-50 rounded-2xl border border-[#E2E8EF] bg-white px-4 py-3 text-sm shadow-[0_18px_45px_rgba(7,17,38,0.12)]"
                style={{ left: tooltip.x + 16, top: tooltip.y - 60 }}
              >
                <p className="font-semibold text-[#071A3D]">{tooltip.name}</p>
                <p className="mt-1 font-semibold text-[#178C85]">{formatMoney(tooltip.avg)}/hr avg</p>
              </div>
            )}

            {mapLoading ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm font-medium text-[#B0BCCE]">Loading map...</p>
              </div>
            ) : (
              <UsMap key={selectedProfession} stateMap={stateMap} min={min} max={max} onHover={setTooltip} />
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#178C85]">Location rankings</p>
            <h2 className="mt-2 font-serif text-4xl font-normal tracking-[-0.03em] text-[#071A3D] md:text-5xl">
              {rankingTab === 'states' ? 'Highest paying states.' : 'Highest paying cities.'}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#667085]">
              Ranked by average reported pay from anonymous submissions. Click any location to see the full breakdown.
            </p>
          </div>

          <div className="inline-flex rounded-full border border-[#E2E8EF] bg-white p-1">
            {(['states', 'cities'] as const).map(t => (
              <button key={t} type="button" onClick={() => setRankingTab(t)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${rankingTab === t ? 'bg-[#071A3D] text-white shadow-sm' : 'text-[#8D9AA7] hover:text-[#071A3D]'}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-[#E2E8EF] bg-white shadow-[0_18px_60px_rgba(7,17,38,0.05)]">
          <div className="grid grid-cols-[72px_1fr_auto] bg-[#F8F7F4] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#B0BCCE]">
            <span>Rank</span>
            <span>Location</span>
            <span className="text-right">Explore</span>
          </div>

          {rankingItems.map((location, i) => {
            const cityName = location.split(',')[0]
            const stateName = location.split(',')[1]?.trim()
            const href = rankingTab === 'states' ? `/state/${toSlug(location)}` : `/city/${toSlug(cityName)}`

            return (
              <Link key={location} href={href}
                className="group grid grid-cols-[72px_1fr_auto] items-center border-t border-[#E2E8EF] bg-white px-6 py-4 transition hover:bg-[#F8F7F4]">
                <div>
                  <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                    i === 0 ? 'bg-[#E8F5F2] text-[#178C85]'
                    : i === 1 ? 'bg-[#EAF0F8] text-[#315AA6]'
                    : i === 2 ? 'bg-[#F5F0E8] text-[#806126]'
                    : 'border border-[#E2E8EF] bg-white text-[#8D9AA7]'
                  }`}>
                    {i + 1}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#071A3D] transition group-hover:text-[#178C85]">
                    {rankingTab === 'states' ? location : cityName}
                  </p>
                  <p className="mt-1 text-xs text-[#8D9AA7]">
                    {rankingTab === 'states' ? 'State salary ranking' : stateName || 'City salary ranking'}
                  </p>
                </div>

                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8EF] bg-white text-[#8D9AA7] transition group-hover:border-[#071A3D] group-hover:bg-[#071A3D] group-hover:text-white">
                  →
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}