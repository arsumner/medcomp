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
          <p className="mx-auto mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#8D9AA7]">
            Built by a nurse. Free for everyone.
          </p>

          <h1 className="font-serif text-[46px] font-normal leading-[1.02] tracking-[-0.055em] text-[#07152F] sm:text-[64px] lg:text-[78px]">
            We're getting rid of the stigma around talking about pay in healthcare.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-8 text-[#526174] sm:text-[18px]">
            We're all curious, but none of us talk about it. So we built a place where healthcare workers
            can anonymously share what they earn. No names, no accounts, no strings attached.
          </p>
        </div>

        <div ref={inputRef} className="relative z-30 mt-9 w-full max-w-4xl">
          <div className="rounded-[34px] border border-[#BFD1DD] bg-white p-3 shadow-[0_30px_100px_rgba(6,24,58,0.20)] ring-1 ring-[#E8F0F5]">
            <div className="mb-3 px-3 pt-1 text-left">
              <p className="text-lg font-bold text-[#263B52]">
                What do you want to look up?
              </p>
            </div>

            <div className="grid grid-cols-4 gap-1 rounded-full border border-[#D8E5EA] bg-[#DDEBED] p-1 shadow-inner">
              {searchOptions.map(option => {
                const isActive = option.value === category
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleCategoryChange(option.value)}
                    className={`rounded-full px-2 py-2.5 text-center text-[13px] font-bold transition sm:text-lg ${
                      isActive
                        ? 'bg-[#06183A] text-white shadow-[0_8px_20px_rgba(6,24,58,0.22)]'
                        : 'text-[#4F6070] hover:bg-white/60 hover:text-[#06183A]'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>

            <div className="mt-3 flex flex-col gap-3 rounded-[27px] border border-[#BFD1DD] bg-[#F4F8FA] p-3 shadow-inner md:flex-row md:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[22px] bg-white px-3 shadow-sm md:bg-transparent md:shadow-none">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#DDF5F2] text-[#087A7B] ring-1 ring-[#BFE5E1]">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M10.75 18.5a7.75 7.75 0 1 1 0-15.5 7.75 7.75 0 0 1 0 15.5Z" stroke="currentColor" strokeWidth="2" />
                    <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>

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
                  className="min-w-0 flex-1 bg-transparent py-4 text-[16px] font-medium text-[#101827] outline-none placeholder:text-[#7D8BA0]"
                />
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="shrink-0 rounded-full bg-[#06183A] px-9 py-4 text-[18px] font-bold text-white shadow-[0_12px_30px_rgba(6,24,58,0.26)] transition hover:bg-[#102B62] focus:outline-none focus:ring-4 focus:ring-[#C8D8FF]"
              >
                Search
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-left text-sm text-red-600">
              {error}
            </p>
          )}

          {showDropdown && currentSuggestions.length > 0 && (
            <ul className="absolute z-50 mt-3 max-h-72 w-full overflow-auto rounded-3xl border border-[#C7D7E2] bg-white p-2 text-left shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
              {currentSuggestions.map((suggestion) => (
                <li
                  key={suggestion.key}
                  onClick={() => handleSelect(suggestion)}
                  className="cursor-pointer rounded-2xl px-4 py-3 text-sm font-semibold text-[#334155] transition hover:bg-[#EEF8FA] hover:text-[#06183A]"
                >
                  {suggestion.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative z-20 mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium text-[#5F6F80]">
          <span>Real pay, not estimates</span>
          <span className="h-1 w-1 rounded-full bg-[#B8C6D1]" />
          <span>No account needed</span>
          <span className="h-1 w-1 rounded-full bg-[#B8C6D1]" />
          <span>Always anonymous</span>
        </div>

        <div className="relative z-20 mt-6 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/submit"
            className="inline-flex items-center justify-center rounded-full border border-[#C8D6E0] bg-white px-6 py-3 text-sm font-bold text-[#06183A] shadow-sm transition hover:border-[#AFC1D0] hover:bg-[#F8FBFD] focus:outline-none focus:ring-4 focus:ring-[#DDEBFF]"
          >
            Share what you make
          </Link>

          <p className="max-w-md text-sm leading-6 text-[#7D8BA0]">
            Every submission helps someone else know their worth.
          </p>
        </div>
      </div>
    </section>
  )
}