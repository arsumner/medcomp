import { supabase } from '@/lib/supabase'
import LocationsClient from '../components/locationsClient'
import Link from 'next/link'

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
      totalSubmissions: 0,
      totalStates: 0,
      totalCities: 0,
      highestState: null as StateData | null,
    }
  }

  const stateRates: Record<string, number[]> = {}
  const cityRates: Record<string, number[]> = {}

  data.forEach((submission: any) => {
    const state = submission.hospital?.state
    const city = submission.hospital?.city
    const rate = Number(submission.base_rate)

    if (state && rate && !Number.isNaN(rate)) {
      stateRates[state] ??= []
      stateRates[state].push(rate)
    }

    if (city && state && rate && !Number.isNaN(rate)) {
      const key = `${city}, ${state}`
      cityRates[key] ??= []
      cityRates[key].push(rate)
    }
  })

  const average = (rates: number[]) =>
    rates.reduce((total, rate) => total + rate, 0) / rates.length

  const mapData: StateData[] = Object.entries(stateRates).map(([state, rates]) => ({
    state,
    avg: average(rates),
    count: rates.length,
  }))

  const topStates = [...mapData]
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 15)
    .map(item => item.state)

  const topCities = Object.entries(cityRates)
    .sort((a, b) => average(b[1]) - average(a[1]))
    .slice(0, 15)
    .map(([city]) => city)

  const highestState =
    [...mapData].sort((a, b) => b.avg - a.avg)[0] ?? null

  return {
    topStates,
    topCities,
    mapData,
    totalSubmissions: data.length,
    totalStates: Object.keys(stateRates).length,
    totalCities: Object.keys(cityRates).length,
    highestState,
  }
}

function formatMoney(value: number) {
  if (!value || Number.isNaN(value)) return '$0.00'
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
}

export default async function LocationsPage() {
  const {
    topStates,
    topCities,
    mapData,
    totalSubmissions,
    totalStates,
    totalCities,
    highestState,
  } = await getLocationsData()

  return (
    <main className="min-h-screen bg-[#F5F4F1] text-[#071A3D]">

      <section className="px-6 pt-24 pb-16 md:px-8 md:pt-28 md:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#8D9AA7]">
              Pay varies more than you'd think
            </p>

            <h1 className="font-serif text-5xl font-normal leading-[1.02] tracking-[-0.04em] text-[#071A3D] md:text-7xl">
              Where you work matters as much as what you do.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#667085] md:text-lg">
              The same role can pay $20 more an hour in a different state — sometimes in the next city over.
              Search below to see what people are reporting near you.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              `${totalStates} states tracked`,
              `${totalCities} cities tracked`,
              `${totalSubmissions} anonymous submissions`,
              highestState ? `Highest avg: ${highestState.state} at ${formatMoney(highestState.avg)}/hr` : null,
            ].filter(Boolean).map((item) => (
              <span
                key={item as string}
                className="rounded-full border border-[#E2E8EF] bg-white px-4 py-2 text-sm font-medium text-[#64748B] shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <LocationsClient
            topStates={topStates}
            topCities={topCities}
            initialMapData={mapData}
          />
        </div>
      </section>
    </main>
  )
}