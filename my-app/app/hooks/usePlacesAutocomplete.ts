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
        const { AutocompleteSuggestion } =
          await google.maps.importLibrary('places') as google.maps.PlacesLibrary

        const { suggestions } =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input,
            ...(type === 'hospital' && { includedPrimaryTypes: ['hospital'] }),
          })

        setSuggestions(
          suggestions
            .map((s) => {
              const placePrediction = s.placePrediction

              if (!placePrediction) return null
              
              return placePrediction.mainText?.toString() ?? null
            })
            .filter((s): s is string => s !== null)
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