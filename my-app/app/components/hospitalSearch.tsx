'use client'
import { useState, useEffect, useRef } from 'react'

type HospitalSearchProps = {
  onSelect: (hospital: string, city: string, state: string) => void
}

export default function HospitalSearch({ onSelect }: HospitalSearchProps) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompleteSuggestion[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Fetch suggestions as user types
  useEffect(() => {
    if (!input || input.length < 2) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      const { AutocompleteSuggestion } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary
      const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input,
        includedPrimaryTypes: ['hospital'],
      })
      setSuggestions(suggestions)
      setOpen(true)
    }

    const timer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timer)
  }, [input])

  const handleSelect = async (suggestion: google.maps.places.AutocompleteSuggestion) => {
    const placePrediction = suggestion.placePrediction
    const place = placePrediction.toPlace()
    await place.fetchFields({ fields: ['displayName', 'addressComponents'] })

    const components = place.addressComponents ?? []
    const city = components.find(c => c.types.includes('locality'))?.longText ?? ''
    const state = components.find(c => c.types.includes('administrative_area_level_1'))?.longText ?? ''
    const hospital = place.displayName ?? ''

    setInput(hospital)
    setSuggestions([])
    setOpen(false)
    onSelect(hospital, city, state)
  }

  return (
    <div ref={ref} className="relative">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search hospital..."
        className="w-full bg-[#111827] text-white px-4 py-3 border border-[#1F2937] outline-none rounded-lg"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-[#111827] border border-[#1F2937] rounded-lg mt-1">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSelect(s)}
              className="px-4 py-2 text-white hover:bg-[#1F2937] cursor-pointer"
            >
              <strong>{s.placePrediction.mainText.toString()}</strong>
              <span className="text-[#9CA3AF] ml-2 text-sm">{s.placePrediction.secondaryText?.toString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}