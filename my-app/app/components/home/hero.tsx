'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { states } from '../../data/states'
import { professions } from '../../data/professions'
import { usePlacesAutocomplete } from '../../hooks/usePlacesAutocomplete'

const allProfessions = Object.values(professions).flat()

function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')
}

type HeroProps = {
  totalReports: number
}

export default function Hero({ totalReports }: HeroProps) {
  const [category, setCategory] = useState('profession')
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const inputRef = useRef<HTMLDivElement>(null)

  const goal = 1000
  const progressPercent = Math.min((totalReports / goal) * 100, 100)
  const remainingReports = Math.max(goal - totalReports, 0)

  const placeSuggestions = usePlacesAutocomplete(
    category === 'city' || category === 'hospital' ? query : '',
    category as 'hospital' | 'city'
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

  function getSuggestions(): string[] {
    if (!query || query.length < 1) return []

    if (category === 'profession') {
      return allProfessions
        .filter(p => p.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6)
    }

    if (category === 'state') {
      return states
        .filter(s => s.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6)
    }

    if (category === 'city' || category === 'hospital') {
      return placeSuggestions.slice(0, 6)
    }

    return []
  }

  function handleSelect(value: string) {
    setQuery(value)
    setError('')
    setShowDropdown(false)

    if (category === 'profession') {
      router.push(`/profession/${toSlug(value)}`)
    } else if (category === 'state') {
      router.push(`/state/${toSlug(value)}`)
    } else if (category === 'city') {
      router.push(`/city/${toSlug(value)}`)
    } else if (category === 'hospital') {
      router.push(`/hospital/${toSlug(value)}`)
    }
  }

  function handleSearch() {
    setError('')

    if (!query.trim()) {
      setError('Please enter a search term.')
      return
    }

    if (category === 'profession') {
      const match = allProfessions.find(
        p => p.toLowerCase() === query.toLowerCase()
      )

      if (!match) {
        setError('Please select a valid profession from the dropdown.')
        return
      }

      handleSelect(match)
      return
    }

    if (category === 'state') {
      const match = states.find(
        s => s.toLowerCase() === query.toLowerCase()
      )

      if (!match) {
        setError('Please select a valid U.S. state from the dropdown.')
        return
      }

      handleSelect(match)
      return
    }

    if (category === 'city') {
      if (placeSuggestions.length === 0) {
        setError('Please select a valid city from the dropdown.')
        return
      }

      const match = placeSuggestions.find(
        s => s.toLowerCase() === query.toLowerCase()
      ) || placeSuggestions[0]

      handleSelect(match)
      return
    }

    if (category === 'hospital') {
      if (placeSuggestions.length === 0) {
        setError('Please select a valid hospital from the dropdown.')
        return
      }

      const match = placeSuggestions.find(
        s => s.toLowerCase() === query.toLowerCase()
      ) || placeSuggestions[0]

      handleSelect(match)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch()
  }

  const currentSuggestions = getSuggestions()

  return (
    <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-[#FBFCFE] px-6 py-16 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#EEF2FF_0%,_transparent_36%)] pointer-events-none" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-[#4C6FFF]">
            Forging the path to pay transparency in healthcare. One salary at a time.
          </p>

          <h1 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-tight text-[#0F172A] md:text-6xl">
            Know your worth.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#64748B]">
            Search real pay reports by role, hospital, city, or state. Take the rumors, guesswork, and secrecy out of finding your next role, comparing offers, or planning a move.
          </p>

          <div ref={inputRef} className="relative z-20 mt-9 w-full max-w-3xl">
            <div className="rounded-[1.75rem] border border-[#E2E8F0] bg-white p-3 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="flex flex-col gap-3 md:flex-row">
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value)
                    setQuery('')
                    setError('')
                    setShowDropdown(false)
                  }}
                  className="rounded-2xl bg-[#F8FAFC] px-4 py-4 text-sm font-medium text-[#334155] outline-none md:w-44"
                >
                  <option value="profession">Profession</option>
                  <option value="state">State</option>
                  <option value="city">City</option>
                  <option value="hospital">Hospital</option>
                </select>

                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setError('')
                    setShowDropdown(true)
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowDropdown(true)}
                  placeholder={
                    category === 'profession' ? 'Try Registered Nurse, PA, Rad Tech...' :
                    category === 'state' ? 'Try New York, California...' :
                    category === 'city' ? 'Try Miami, Seattle...' :
                    'Try a hospital or health system...'
                  }
                  className="flex-1 rounded-2xl bg-[#F8FAFC] px-4 py-4 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                />

                <button
                  onClick={handleSearch}
                  className="rounded-2xl bg-[#4C6FFF] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#3B5BDB]"
                >
                  Search pay
                </button>
              </div>
            </div>

            {error && (
              <p className="mt-2 px-2 text-left text-xs text-red-500">
                {error}
              </p>
            )}

            {showDropdown && currentSuggestions.length > 0 && (
              <ul className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white text-left shadow-xl">
                {currentSuggestions.map((s) => (
                  <li
                    key={s}
                    onClick={() => handleSelect(s)}
                    className="cursor-pointer px-5 py-3 text-sm text-[#334155] transition hover:bg-[#F1F5F9] hover:text-[#4C6FFF]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-8 max-w-2xl border-l-2 border-[#C7D2FE] pl-5">
            <p className="text-sm leading-relaxed text-[#64748B]">
              Not sure where to start? Try searching for your profession, then explore related roles, locations, and pay insights from there.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#E2E8F0] bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.04)] md:p-8">
          <div className="border-b border-[#E2E8F0] pb-6">
            <p className="text-sm font-medium text-[#4C6FFF]">
              Work for a healthcare organization? We need you!
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#0F172A]">
              Help us reach our goal of 1,000 anonymous pay reports.
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
              Every anonymous report makes the picture clearer for the next person comparing an offer, planning a move, or wondering if their pay is fair.
            </p>
          </div>

          <div className="py-6">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-5xl font-semibold tracking-tight text-[#0F172A]">
                  {totalReports.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-[#64748B]">
                  pay reports shared
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-[#0F172A]">
                  {Math.round(progressPercent)}%
                </p>
                <p className="mt-1 text-xs text-[#94A3B8]">
                  of 1,000
                </p>
              </div>
            </div>

            <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-[#EEF2FF]">
              <div
                className="h-full rounded-full bg-[#4C6FFF]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="mt-3 text-xs leading-relaxed text-[#94A3B8]">
              {remainingReports.toLocaleString()} more reports to reach the first community goal.
            </p>
          </div>

          <div className="rounded-2xl bg-[#F8FAFC] p-5">
            <p className="text-sm font-medium text-[#0F172A]">
              Your contribution can help others...
            </p>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#64748B]">
              <p>
                 negotiate for a higher salary.
              </p>
              <p>
                decide between job offers with more confidence.
              </p>
              <p>
                plan a move to a new city or hospital system with more clarity.
              </p>
            </div>
          </div>

          <Link
            href="/submit"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#4C6FFF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3B5BDB]"
          >
            Share your pay anonymously
          </Link>

          <p className="mt-3 text-center text-xs text-[#94A3B8]">
            No name shown. No account required.
          </p>
        </div>
      </div>
    </section>
  )
}