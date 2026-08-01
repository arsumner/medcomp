import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import LocationsClient from '../components/locations/locationsClient'
import mascotImg from '../../src/assets/imagingPill.png'

export const dynamic = 'force-dynamic'

export type SubmissionRow = {
  profession: string
  state: string
  city: string
  rate: number
  years: number
}

async function getLocationsData() {
  const { data, error } = await supabase
    .from('submission')
    .select('base_rate, years_experience, hospital (city, state), role (profession)')
    .eq('is_active', true)

  if (error || !data) {
    return {
      submissions: [] as SubmissionRow[],
      totalSubmissions: 0,
      totalStates: 0,
      totalCities: 0,
    }
  }

  const submissions: SubmissionRow[] = []
  const stateSet = new Set<string>()
  const citySet = new Set<string>()

  for (const row of data as any[]) {
    const rate = Number(row.base_rate)
    const years = Number(row.years_experience)
    const state = row.hospital?.state
    const city = row.hospital?.city
    const profession = row.role?.profession

    if (!profession || !state || !city || Number.isNaN(rate) || rate <= 0) continue

    submissions.push({ profession, state, city, rate, years: Number.isNaN(years) ? 0 : years })
    stateSet.add(state)
    citySet.add(`${city}, ${state}`)
  }

  return {
    submissions,
    totalSubmissions: submissions.length,
    totalStates: stateSet.size,
    totalCities: citySet.size,
  }
}

export default async function LocationsPage() {
  const { 
    submissions, 
    totalSubmissions, 
    totalStates, 
    totalCities 
  } = await getLocationsData()

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#071633]">
      <section className="px-6 pb-10 pt-16 md:px-8 md:pb-12 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-start gap-5">
              <Image
                src={mascotImg}
                alt="MedComp mascot"
                className="hidden h-24 w-24 shrink-0 object-contain sm:block md:h-28 md:w-28"
                priority
              />

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0F766E]">
                  Search by Location
                </p>

                <h1 className="mt-2 max-w-4xl font-serif text-4xl font-normal leading-tight tracking-[-0.03em] text-[#071633] md:text-5xl">
                  Compare healthcare pay by state and city
                </h1>

                <p className="mt-3 max-w-2xl text-base leading-7 text-[#64748B]">
                  The same role can pay very differently depending on where you work.
                  Filter by profession to see where it pays best.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-[#64748B]">
                  <span>{totalStates} states tracked</span>
                  <span className="h-1 w-1 rounded-full bg-[#94A3B8]" />
                  <span>{totalCities} cities tracked</span>
                  <span className="h-1 w-1 rounded-full bg-[#94A3B8]" />
                  <span>{totalSubmissions} anonymous submissions</span>
                </div>
              </div>
            </div>

            <Link
              href="/submit"
              className="inline-flex h-12 w-fit items-center justify-center rounded-full bg-[#071633] px-6 text-sm font-semibold text-white transition hover:bg-[#13284F]"
            >
              Share what you make
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <LocationsClient submissions={submissions} />
        </div>
      </section>
    </main>
  )
}