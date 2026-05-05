'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { states } from '../../data/states'
import { professions } from '../../data/professions'
import { usePlacesAutocomplete } from '../../hooks/usePlacesAutocomplete'

const allProfessions = Object.values(professions).flat()

function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')
}

export default function Hero() {
  const [category, setCategory] = useState('profession')
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLDivElement>(null)

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
      return
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch()
  }

  const currentSuggestions = getSuggestions()

    return (
    <section className="relative overflow-hidden bg-[#F8FAFC] px-6 py-16 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#EEF2FF_0%,_transparent_38%),radial-gradient(circle_at_bottom_right,_#F1F5F9_0%,_transparent_34%)] pointer-events-none" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-xs font-medium text-[#475569] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#4C6FFF]" />
            Real salary data from your 
          </div>

          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-[#0F172A] md:text-6xl">
            Compare real healthcare salaries, anonymously.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#64748B]">
            Search pay data from nurses, allied health professionals, and care teams across hospitals, cities, states, and specialties.
          </p>

          <div ref={inputRef} className="relative z-20 mt-9 w-full max-w-3xl">
            <div className="rounded-[1.75rem] border border-[#E2E8F0] bg-white p-3 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
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
                    category === 'profession' ? 'Search Registered Nurse, PA, Rad Tech...' :
                    category === 'state' ? 'Search New York, California...' :
                    category === 'city' ? 'Search Miami, Seattle...' :
                    'Search a hospital or health system...'
                  }
                  className="flex-1 rounded-2xl bg-[#F8FAFC] px-4 py-4 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                />

                <button
                  onClick={handleSearch}
                  className="rounded-2xl bg-[#4C6FFF] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#3B5BDB]"
                >
                  View salaries
                </button>
              </div>
            </div>

            {error && (
              <p className="mt-2 px-2 text-left text-xs text-red-500">{error}</p>
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

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#64748B]">
            <span className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2">
              Anonymous submissions
            </span>
            <span className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2">
              Healthcare-specific roles
            </span>
            <span className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2">
              No login required to search
            </span>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#E2E8F0] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#0F172A]">
              How people are using this
            </h3>
            <p className="mt-1 text-sm text-[#64748B]">
              Real questions healthcare workers are asking every day
            </p>
          </div>

          <div className="space-y-4">
            
            <div className="rounded-2xl bg-[#F8FAFC] p-4">
              <p className="text-sm font-medium text-[#0F172A]">
                Am I being underpaid for my role?
              </p>
              <p className="mt-1 text-xs text-[#64748B]">
                Compare your pay against others with similar experience
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8FAFC] p-4">
              <p className="text-sm font-medium text-[#0F172A]">
                What are nurses earning at other hospitals nearby?
              </p>
              <p className="mt-1 text-xs text-[#64748B]">
                See location-based salary differences across systems
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8FAFC] p-4">
              <p className="text-sm font-medium text-[#0F172A]">
                What should I ask for in my next offer?
              </p>
              <p className="mt-1 text-xs text-[#64748B]">
                Use real data to guide negotiation conversations
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8FAFC] p-4">
              <p className="text-sm font-medium text-[#0F172A]">
                Is switching hospitals or traveling worth it?
              </p>
              <p className="mt-1 text-xs text-[#64748B]">
                Understand how pay changes across roles and locations
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}