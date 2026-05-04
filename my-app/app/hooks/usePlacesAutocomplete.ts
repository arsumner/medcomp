import { useState, useEffect } from 'react'

export function usePlacesAutocomplete(input: string, type: 'hospital' | 'city') {
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (!input || input.length < 2) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      try {
        const { AutocompleteSuggestion } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary
        const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          includedPrimaryTypes: type === 'hospital' ? ['hospital'] : ['locality'],
        })
        setSuggestions(suggestions.map(s => s.placePrediction.mainText.toString()))
      } catch {
        setSuggestions([])
      }
    }

    const timer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timer)
  }, [input, type])

  return suggestions
}