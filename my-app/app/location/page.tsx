'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { states } from "../data/states"

function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-")
}

export default function Locations() {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'states' | 'cities'>('states')
  const [topStates, setTopStates] = useState<string[]>([])
  const [topCities, setTopCities] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/location')
      .then(r => r.json())
      .then(({ topStates, topCities }) => {
        setTopStates(topStates)
        setTopCities(topCities)
        setLoading(false)
      })
  }, [])

  const filteredStates = states.filter(s =>
    s.toLowerCase().includes(query.toLowerCase())
  )

  const filteredCities = topCities.filter(c =>
    c.toLowerCase().includes(query.toLowerCase())
  )

  function handleSearch() {
    if (!query) return
    if (tab === 'states') {
      router.push(`/state/${toSlug(query)}`)
    } else {
      router.push(`/city/${toSlug(query)}`)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB]">

      <div className="relative bg-[#0A0F1E] px-8 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0D948820_0%,_transparent_70%)] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="inline-flex items-center gap-2 bg-[#0D9488]/10 border border-[#0D9488]/30 text-[#0D9488] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse" />
            Salary Transparency
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight mb-4">
            Browse by Location
          </h1>
          <p className="text-[#9CA3AF] text-lg max-w-lg leading-relaxed mb-8">
            Explore salary data by state or city across the U.S.
          </p>

          <div className="max-w-md flex">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={tab === 'states' ? "Search for a state..." : "Search for a city..."}
              className="flex-1 bg-[#111827] text-white px-5 py-3 rounded-l-full border border-[#1F2937] outline-none focus:border-[#0D9488] transition-colors duration-200 placeholder-[#4B5563]"
            />
            <button
              onClick={handleSearch}
              className="bg-[#0D9488] hover:bg-[#0F766E] text-white px-6 py-3 rounded-r-full font-semibold text-sm transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <section className="px-8 py-12">
        <div className="mx-auto max-w-5xl">

          <div className="flex gap-2 mb-10 border-b border-[#E5E7EB]">
            <button
              onClick={() => { setTab('states'); setQuery('') }}
              className={`pb-3 px-4 text-sm font-semibold transition-colors duration-200 border-b-2 -mb-px ${
                tab === 'states'
                  ? 'border-[#0D9488] text-[#0D9488]'
                  : 'border-transparent text-[#9CA3AF] hover:text-[#0A0F1E]'
              }`}
            >
              States
            </button>
            <button
              onClick={() => { setTab('cities'); setQuery('') }}
              className={`pb-3 px-4 text-sm font-semibold transition-colors duration-200 border-b-2 -mb-px ${
                tab === 'cities'
                  ? 'border-[#0D9488] text-[#0D9488]'
                  : 'border-transparent text-[#9CA3AF] hover:text-[#0A0F1E]'
              }`}
            >
              Cities
            </button>
          </div>

          {loading ? (
            <p className="text-[#9CA3AF] text-sm">Loading...</p>
          ) : (
            <>
              {tab === 'states' && (
                <>
                  <h2 className="text-lg font-bold text-[#0A0F1E] mb-6">
                    {query ? `Results for "${query}"` : 'Top Paying States'}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {(query ? filteredStates : topStates).map((state) => (
                      <Link
                        key={state}
                        href={`/state/${toSlug(state)}`}
                        className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-4 text-center shadow-sm hover:border-[#0D9488] hover:shadow-md transition-all duration-200 group"
                      >
                        <span className="text-[#0A0F1E] font-medium text-sm group-hover:text-[#0D9488] transition-colors duration-200">
                          {state}
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {tab === 'cities' && (
                <>
                  <h2 className="text-lg font-bold text-[#0A0F1E] mb-6">
                    {query ? `Results for "${query}"` : 'Top Paying Cities'}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {(query ? filteredCities : topCities).map((city) => {
                      const cityName = city.split(',')[0]
                      return (
                        <Link
                          key={city}
                          href={`/city/${toSlug(cityName)}`}
                          className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-4 text-center shadow-sm hover:border-[#0D9488] hover:shadow-md transition-all duration-200 group"
                        >
                          <span className="block text-[#0A0F1E] font-medium text-sm group-hover:text-[#0D9488] transition-colors duration-200">
                            {cityName}
                          </span>
                          <span className="block text-[#9CA3AF] text-xs mt-1">
                            {city.split(',')[1]?.trim()}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </>
              )}
            </>
          )}

        </div>
      </section>

    </main>
  )
}