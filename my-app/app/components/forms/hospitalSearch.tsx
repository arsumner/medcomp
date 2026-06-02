'use client'
import { useState, useEffect, useRef } from 'react'

type HospitalSearchProps = {
  onSelect: (hospital: string, city: string, state: string, placeId: string) => void
}

export default function HospitalSearch({ onSelect }: HospitalSearchProps) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompleteSuggestion[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

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

  const handleSelect = async ( suggestion: google.maps.places.AutocompleteSuggestion ) => {
  const placePrediction = suggestion.placePrediction

  if (!placePrediction) {
    console.error('No place prediction found for this suggestion.')
    return
  }

  const place = placePrediction.toPlace()

  await place.fetchFields({ fields: ['displayName', 'addressComponents', 'id'] })


  const components = place.addressComponents ?? []

  const city =
    components.find(c => c.types.includes('locality'))?.longText ??
    components.find(c => c.types.includes('sublocality'))?.longText ??
    components.find(c => c.types.includes('neighborhood'))?.longText ??
    components.find(c => c.types.includes('administrative_area_level_2'))?.longText ??
    ''

  const state =
    components.find(c => c.types.includes('administrative_area_level_1'))?.longText ?? ''

  const hospital =
    place.displayName ?? placePrediction.text?.toString() ?? ''

  const placeId = place.id ?? ''

  setInput(hospital)
  setSuggestions([])
  setOpen(false)
  onSelect(hospital, city, state, placeId)
}

  return (
    <div ref={ref} className="relative">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search hospital..."
        className="w-full bg-white text-[#111827] px-4 py-3 border border-[#E5E7EB] rounded-lg outline-none focus:border-[#0D9488] transition-colors duration-200 placeholder-[#9CA3AF]"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-lg border border-[#1F2937] bg-[#111827]">
          {suggestions.map((s, i) => {
            const placePrediction = s.placePrediction

            if (!placePrediction) return null

            return (
              <li
                key={i}
                onClick={() => handleSelect(s)}
                className="cursor-pointer px-4 py-2 text-white hover:bg-[#1F2937]"
              >
                <strong>{placePrediction.mainText?.toString() ?? 'Unknown place'}</strong>
                <span className="ml-2 text-sm text-[#9CA3AF]">
                  {placePrediction.secondaryText?.toString() ?? ''}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}