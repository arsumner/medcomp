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
    <main className="min-h-screen bg-[#F6FBFA] text-[#071126]">
      <section className="relative overflow-hidden border-b border-[#DDE8EA] bg-[linear-gradient(115deg,#F7FBFA_0%,#F4FAF8_42%,#EAF5FA_100%)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-12%] top-[-18%] h-[420px] w-[420px] rounded-full bg-[#DDEFEA]/70 blur-3xl" />
          <div className="absolute right-[-10%] top-[8%] h-[420px] w-[420px] rounded-full bg-[#DCECF8]/80 blur-3xl" />
          <div className="absolute bottom-[-28%] left-[30%] h-[360px] w-[520px] rounded-full bg-white/80 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#5F7182]">
              Browse by location
            </p>

            <h1 className="font-serif text-5xl font-medium leading-[0.95] tracking-[-0.04em] text-[#071126] md:text-7xl">
              Location matters.
            </h1>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-m text-[#637384]">
            <span>{totalStates} states tracked</span>
            <span className="hidden h-1 w-1 rounded-full bg-[#A7B6C1] sm:block" />
            <span>{totalCities} cities tracked</span>
            <span className="hidden h-1 w-1 rounded-full bg-[#A7B6C1] sm:block" />
            <span>{totalSubmissions} anonymous submissions</span>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-visible rounded-[2rem] border border-[#D9E5E8] bg-white/88 p-5 shadow-[0_18px_60px_rgba(7,17,38,0.055)] md:p-6">
            <LocationsClient
              topStates={topStates}
              topCities={topCities}
              initialMapData={mapData}
            />
          </div>

          {highestState && (
            <div className="mt-6 rounded-[2rem] border border-[#D9E5E8] bg-white/72 p-5 text-sm text-[#637384] shadow-[0_14px_42px_rgba(7,17,38,0.04)] md:p-6">
              <span className="font-semibold text-[#071126]">
                Current highest reported state average:
              </span>{' '}
              {highestState.state} at {formatMoney(highestState.avg)}/hr.
            </div>
          )}
        </div>
      </section>
    </main>
  )
}