'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { states } from '../../data/states'
import { professions } from '../../data/professions'
import { usePlacesAutocomplete } from '../../hooks/usePlacesAutocomplete'

const allProfessions = Object.values(professions).flat()

function toSlug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
}

type HeroProps = {
  totalReports: number
}

type SearchCategory = 'profession' | 'state' | 'city' | 'hospital'

type CitySuggestion = {
  name: string
  fullText: string
}

type SearchSuggestion = {
  key: string
  label: string
  value: string
  routeValue: string
}

const searchOptions: {
  value: SearchCategory
  label: string
  placeholder: string
}[] = [
  {
    value: 'profession',
    label: 'Role',
    placeholder: 'Search RN, PA, CRNA, Radiology Tech…',
  },
  {
    value: 'city',
    label: 'City',
    placeholder: 'Search Miami, Seattle, Brooklyn…',
  },
  {
    value: 'state',
    label: 'State',
    placeholder: 'Search New York, California, Florida…',
  },
  {
    value: 'hospital',
    label: 'Hospital',
    placeholder: 'Search Mount Sinai, Mayo Clinic…',
  },
]

export default function Hero({ totalReports }: HeroProps) {
  const [category, setCategory] = useState<SearchCategory>('profession')
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [error, setError] = useState('')
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([])

  const router = useRouter()
  const inputRef = useRef<HTMLDivElement>(null)

  const activeSearch = searchOptions.find(option => option.value === category)

  const hospitalSuggestions = usePlacesAutocomplete(
    category === 'hospital' ? query : '',
    'hospital'
  )

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
    if (category !== 'city' || !query || query.length < 2) {
      setCitySuggestions([])
      return
    }

    const fetchCities = async () => {
      try {
        const { AutocompleteSuggestion } =
          (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary

        const result = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: query,
          includedPrimaryTypes: ['locality', 'sublocality_level_1'],
        })

        const suggestions = result.suggestions
          .map((s) => {
            const placePrediction = s.placePrediction
            if (!placePrediction) return null
            return {
              name: placePrediction.mainText?.toString() ?? '',
              fullText: placePrediction.text?.toString() ?? '',
            }
          })
          .filter((s): s is CitySuggestion => Boolean(s && s.name && s.fullText))

        setCitySuggestions(suggestions)
        setShowDropdown(true)
      } catch {
        setCitySuggestions([])
      }
    }

    const timer = setTimeout(fetchCities, 300)
    return () => clearTimeout(timer)
  }, [query, category])

  function getSuggestions(): SearchSuggestion[] {
    if (!query || query.length < 1) return []

    if (category === 'profession') {
      return allProfessions
        .filter(p => p.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 7)
        .map(p => ({ key: p, label: p, value: p, routeValue: p }))
    }

    if (category === 'state') {
      return states
        .filter(s => s.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 7)
        .map(s => ({ key: s, label: s, value: s, routeValue: s }))
    }

    if (category === 'city') {
      return citySuggestions.slice(0, 7).map(city => {
        const cityName = city.name.split(',')[0].trim()
        return {
          key: city.fullText,
          label: city.fullText,
          value: city.fullText,
          routeValue: cityName,
        }
      })
    }

    if (category === 'hospital') {
      return hospitalSuggestions.slice(0, 7).map(hospital => ({
        key: hospital,
        label: hospital,
        value: hospital,
        routeValue: hospital,
      }))
    }

    return []
  }

  function handleCategoryChange(value: SearchCategory) {
    setCategory(value)
    setQuery('')
    setError('')
    setShowDropdown(false)
    setCitySuggestions([])
  }

  function handleSelect(suggestion: SearchSuggestion) {
    setQuery(suggestion.value)
    setError('')
    setShowDropdown(false)

    if (category === 'profession') {
      router.push(`/profession/${toSlug(suggestion.routeValue)}`)
    } else if (category === 'state') {
      router.push(`/state/${toSlug(suggestion.routeValue)}`)
    } else if (category === 'city') {
      router.push(`/city/${toSlug(suggestion.routeValue)}`)
    } else if (category === 'hospital') {
      router.push(`/hospital/${toSlug(suggestion.routeValue)}`)
    }
  }

  function handleSearch() {
    setError('')

    if (!query.trim()) {
      setError('Start typing, then choose a result from the list.')
      return
    }

    const currentSuggestions = getSuggestions()

    if (category === 'profession') {
      const match = currentSuggestions.find(
        s => s.value.toLowerCase() === query.toLowerCase()
      )
      if (!match) {
        setError('Choose a role from the suggestions so we can take you to the right page.')
        return
      }
      handleSelect(match)
      return
    }

    if (category === 'state') {
      const match = currentSuggestions.find(
        s => s.value.toLowerCase() === query.toLowerCase()
      )
      if (!match) {
        setError('Choose a state from the suggestions so we can take you to the right page.')
        return
      }
      handleSelect(match)
      return
    }

    if (category === 'city') {
      if (currentSuggestions.length === 0) {
        setError('Choose a city from the suggestions so we can take you to the right page.')
        return
      }
      const match =
        currentSuggestions.find(
          s =>
            s.value.toLowerCase() === query.toLowerCase() ||
            s.routeValue.toLowerCase() === query.toLowerCase()
        ) || currentSuggestions[0]
      handleSelect(match)
      return
    }

    if (category === 'hospital') {
      if (currentSuggestions.length === 0) {
        setError('Choose a hospital from the suggestions so we can take you to the right page.')
        return
      }
      const match =
        currentSuggestions.find(s => s.value.toLowerCase() === query.toLowerCase()) ||
        currentSuggestions[0]
      handleSelect(match)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch()
  }

  const currentSuggestions = getSuggestions()

  return (
    <section className="bg-[#F5F4F1]">
      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-5 pb-16 pt-24 text-center sm:px-6 lg:pt-28">
        <div className="mx-auto max-w-5xl">
          <p className="mx-auto mb-4 text-sm font-bold uppercase tracking-[0.08em] text-[#5E6B7A]">
            Built by a nurse. Free for everyone.
          </p>

          <h1 className="font-serif text-[46px] font-normal leading-[1.02] tracking-[-0.055em] text-[#07152F] sm:text-[64px] lg:text-[70px]">
            Let&apos;s talk about <br /> pay in healthcare.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-8 text-[#425166] sm:text-[18px]">
            We&apos;re all curious, but none of us talk about it. So we built a place where healthcare workers
            can anonymously share what they earn. No names, no accounts, no strings attached.
          </p>
        </div>

        <div ref={inputRef} className="relative z-30 mt-10 w-full max-w-4xl">
          <div className="rounded-[2rem] bg-white/90 p-2 shadow-[0_24px_80px_rgba(7,21,47,0.14)] ring-1 ring-[#D4E0E8] backdrop-blur-md">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
              <div className="flex shrink-0 rounded-full bg-[#E8EEF2] p-1">
                {searchOptions.map(option => {
                  const isActive = option.value === category
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleCategoryChange(option.value)}
                      className={`rounded-full px-4 py-2 text-sm font-bold transition sm:px-5 ${
                        isActive
                          ? 'bg-[#07152F] text-white shadow-sm'
                          : 'text-[#4B5C6F] hover:bg-white hover:text-[#07152F]'
                      }`}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>

              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[1.5rem] bg-white px-4 py-2 ring-1 ring-[#D7E2E9] transition focus-within:ring-2 focus-within:ring-[#4A9EA6]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0 text-[#536579]"
                >
                  <path
                    d="M10.75 18.5a7.75 7.75 0 1 1 0-15.5 7.75 7.75 0 0 1 0 15.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="m16.5 16.5 4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setError('')
                    setShowDropdown(true)
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowDropdown(true)}
                  placeholder={activeSearch?.placeholder}
                  className="min-w-0 flex-1 bg-transparent py-3 text-[16px] font-semibold text-[#07152F] outline-none placeholder:text-[#64748B]"
                />

                <button
                  type="button"
                  onClick={handleSearch}
                  className="hidden shrink-0 rounded-full bg-[#07152F] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(7,21,47,0.22)] transition hover:bg-[#122A56] focus:outline-none focus:ring-4 focus:ring-[#C9D9FF] sm:inline-flex"
                >
                  Search
                </button>
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="rounded-full bg-[#07152F] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(7,21,47,0.22)] transition hover:bg-[#122A56] focus:outline-none focus:ring-4 focus:ring-[#C9D9FF] sm:hidden"
              >
                Search
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          {showDropdown && currentSuggestions.length > 0 && (
            <ul className="absolute z-50 mt-3 max-h-72 w-full overflow-auto rounded-[1.5rem] border border-[#D4E0E8] bg-white/95 p-2 text-left shadow-[0_24px_70px_rgba(15,23,42,0.16)] backdrop-blur-md">
              {currentSuggestions.map((suggestion) => (
                <li
                  key={suggestion.key}
                  onClick={() => handleSelect(suggestion)}
                  className="cursor-pointer rounded-2xl px-4 py-3 text-sm font-semibold text-[#243447] transition hover:bg-[#EEF7F8] hover:text-[#07152F]"
                >
                  {suggestion.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative z-20 mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-semibold text-[#4B5C6F]">
          <span>Real pay, not estimates</span>
          <span className="h-1 w-1 rounded-full bg-[#8FA1B3]" />
          <span>No account needed</span>
          <span className="h-1 w-1 rounded-full bg-[#8FA1B3]" />
          <span>Always anonymous</span>
        </div>

        <div className="relative z-20 mt-6 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/submit"
            className="inline-flex items-center justify-center rounded-full border border-[#B7C7D4] bg-white px-6 py-3 text-sm font-bold text-[#07152F] shadow-sm transition hover:border-[#8FA5B7] hover:bg-[#F8FBFD] focus:outline-none focus:ring-4 focus:ring-[#D4E3FF]"
          >
            Share your pay
          </Link>

          <p className="max-w-md text-sm font-medium leading-6 text-[#536579]">
            We strive to un-gatekeep healthcare pay and need your help. All of our data comes from real humans, like you!
          </p>
        </div>
      </div>
    </section>
  )
}