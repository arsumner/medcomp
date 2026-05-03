'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { states } from '../data/states'
import { professions } from '../data/professions'

const allProfessions = Object.values(professions).flat()

function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')
}

function usePlacesAutocomplete(input: string, type: 'hospital' | 'city') {
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (!input || input.length < 2) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      try {
        const { AutocompleteSuggestion } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary
        const result = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          includedPrimaryTypes: type === 'hospital' ? ['hospital'] : ['locality'],
        })
        setSuggestions(
          result.suggestions.map(s => s.placePrediction.mainText.toString())
        )
      } catch {
        setSuggestions([])
      }
    }

    const timer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timer)
  }, [input, type])

  return suggestions
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
    <div className="relative w-full overflow-hidden bg-[#0A0F1E] px-8 py-24 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0D948820_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 mb-6 inline-flex items-center gap-2 bg-[#0D9488]/10 border border-[#0D9488]/30 text-[#0D9488] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse" />
        Healthcare Salary Transparency
      </div>

      <h1 className="relative z-10 text-white text-5xl md:text-6xl font-bold text-center max-w-3xl leading-tight tracking-tight">
        Know Your Worth.
      </h1>

      <p className="relative z-10 text-[#9CA3AF] text-lg text-center mt-5 max-w-lg leading-relaxed">
        Real compensation data from healthcare professionals across the U.S., anonymous, accurate, and up to date.
      </p>

      <div ref={inputRef} className="relative z-20 mt-10 w-full max-w-2xl">
        <div className="flex rounded-2xl overflow-hidden border border-[#1F2937] bg-[#111827] shadow-2xl">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              setQuery('')
              setError('')
              setShowDropdown(false)
            }}
            className="bg-transparent text-[#9CA3AF] px-5 py-4 border-r border-[#1F2937] outline-none text-sm font-medium"
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
              category === 'profession' ? 'e.g. Registered Nurse (RN)...' :
              category === 'state' ? 'e.g. New York...' :
              category === 'city' ? 'e.g. Miami...' :
              'e.g. Jackson Health System...'
            }
            className="flex-1 bg-transparent text-white px-5 py-4 outline-none text-sm placeholder-[#4B5563]"
          />

          <button
            onClick={handleSearch}
            className="bg-[#0D9488] hover:bg-[#0F766E] text-white px-8 py-4 font-semibold text-sm tracking-wide transition-colors duration-200"
          >
            Search
          </button>
        </div>

        {error && (
          <p className="mt-2 text-red-400 text-xs px-2">{error}</p>
        )}

        {showDropdown && currentSuggestions.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-xl">
            {currentSuggestions.map((s) => (
              <li
                key={s}
                onClick={() => handleSelect(s)}
                className="px-5 py-3 text-sm text-[#374151] hover:bg-[#F0FDFA] hover:text-[#0D9488] cursor-pointer transition-colors duration-150 flex items-center gap-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

    <div className="relative z-0 flex gap-8 mt-10 text-xs text-[#4B5563] font-medium uppercase tracking-wider">        <span>Real Salary Data</span>
        <span className="text-[#1F2937]">·</span>
        <span>Anonymous Submissions</span>
        <span className="text-[#1F2937]">·</span>
        <span>Updated in Real Time</span>
      </div>
    </div>
  )
}