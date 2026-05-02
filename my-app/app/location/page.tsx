'use client'
import { useState, useEffect } from "react"
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

  useEffect(() => {
    fetch('/api/locations')
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

  return (
    <main className="min-h-screen bg-[#F9FAFB]">

      {/* Header */}
      <section className="bg-[#0A0F1E] px-8 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-widest text-[#0D9488] font-semibold mb-3">
            Salary Transparency
          </p>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
            Browse by Location
          </h1>
          <p className="text-[#9CA3AF] text-base max-w-lg mb-8">
            Explore salary data by state or city across the U.S.
          </p>

          <div className="max-w-md">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tab === 'states' ? "Search for a state..." : "Search for a city..."}
              className="w-full bg-[#111827] text-white px-5 py-3 rounded-full border border-[#1F2937] outline-none focus:border-[#0D9488] transition-colors duration-200 placeholder-[#4B5563]"
            />
          </div>
        </div>
      </section>

      {/* Tabs + Content */}
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