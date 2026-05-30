import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import LocationsClient from '../components/locationsClient'
import mascotImg from '../../src/assets/imagingPill.png'

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
      <section className="px-6 pb-10 pt-20 md:px-8 md:pb-12 md:pt-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-start gap-4 md:gap-5">
              <div className="hidden shrink-0 sm:block">
                <div className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] border border-[#E2E8EF] bg-white shadow-[0_14px_36px_rgba(7,17,38,0.06)] md:h-28 md:w-28">
                  <Image
                    src={mascotImg}
                    alt="MedComp mascot"
                    className="h-20 w-20 object-contain md:h-24 md:w-24"
                    priority
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 sm:hidden">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#E2E8EF] bg-white shadow-[0_10px_24px_rgba(7,17,38,0.05)]">
                    <Image
                      src={mascotImg}
                      alt="MedComp mascot"
                      className="h-12 w-12 object-contain"
                      priority
                    />
                  </div>

                  <p className="text-lg font-semibold text-[#178C85]">
                    Search by Location
                  </p>
                </div>

                <p className="hidden text-lg font-semibold text-[#178C85] sm:block">
                  Search by Location
                </p>

                <h1 className="mt-2 max-w-4xl font-serif text-4xl font-normal leading-tight tracking-[-0.03em] text-[#071A3D] md:text-5xl">
                  Compare healthcare pay by state and city
                </h1>

                <p className="mt-3 max-w-2xl text-base leading-7 text-[#667085]">
                  The same role can pay very differently depending on where you work.
                  Browse location-based salary reports to see what healthcare workers
                  are sharing across the country.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-semibold text-[#667085]">
                  <span className="rounded-full border border-[#D7E1E7] bg-white px-4 py-2">
                    {totalStates} states tracked
                  </span>

                  <span className="rounded-full border border-[#D7E1E7] bg-white px-4 py-2">
                    {totalCities} cities tracked
                  </span>

                  <span className="rounded-full border border-[#D7E1E7] bg-white px-4 py-2">
                    {totalSubmissions} anonymous submissions
                  </span>

                  {highestState && (
                    <span className="rounded-full border border-[#D7E1E7] bg-white px-4 py-2">
                      Highest avg: {highestState.state} at {formatMoney(highestState.avg)}/hr
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Link
              href="/submit"
              className="inline-flex h-12 w-fit items-center justify-center rounded-full bg-[#071A3D] px-6 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(7,26,61,0.18)] transition hover:-translate-y-0.5 hover:bg-[#102A5C]"
            >
              Share what you make
            </Link>
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