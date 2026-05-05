import { supabase } from '@/lib/supabase'
import LocationsClient from '../components/locationsClient'

export const dynamic = 'force-dynamic'

type StateData = {
  state: string
  avg: number
  count: number
}

async function getLocationsData() {
  const { data, error } = await supabase
    .from('submission')
    .select('base_rate, hospital (city, state)')

  if (error || !data) {
    return {
      topStates: [],
      topCities: [],
      mapData: [] as StateData[],
    }
  }

  const stateRates: Record<string, number[]> = {}
  const cityRates: Record<string, number[]> = {}

  data.forEach((submission: any) => {
    const state = submission.hospital?.state
    const city = submission.hospital?.city
    const rate = submission.base_rate

    if (state && rate) {
      stateRates[state] ??= []
      stateRates[state].push(rate)
    }

    if (city && state && rate) {
      const key = `${city}, ${state}`
      cityRates[key] ??= []
      cityRates[key].push(rate)
    }
  })

  const average = (rates: number[]) =>
    rates.reduce((total, rate) => total + rate, 0) / rates.length

  const topStates = Object.entries(stateRates)
    .sort((a, b) => average(b[1]) - average(a[1]))
    .slice(0, 15)
    .map(([state]) => state)

  const topCities = Object.entries(cityRates)
    .sort((a, b) => average(b[1]) - average(a[1]))
    .slice(0, 15)
    .map(([city]) => city)

  const mapData: StateData[] = Object.entries(stateRates).map(([state, rates]) => ({
    state,
    avg: average(rates),
    count: rates.length,
  }))

  return {
    topStates,
    topCities,
    mapData,
  }
}

export default async function LocationsPage() {
  const { topStates, topCities, mapData } = await getLocationsData()

  return (
    <LocationsClient
      topStates={topStates}
      topCities={topCities}
      initialMapData={mapData}
    />
  )
}