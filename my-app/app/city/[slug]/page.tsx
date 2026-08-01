import { supabase } from '@/lib/supabase'
import CityClient from '../../components/locations/cityClient'

export const dynamic = 'force-dynamic'

const cityAliases: Record<string, string[]> = {
  'New York': ['Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Manhattan'],
  'Los Angeles': ['Hollywood', 'Santa Monica', 'Venice', 'Pasadena'],
  'Chicago': ['Evanston', 'Oak Park'],
  'Houston': ['Pasadena', 'Baytown', 'Sugar Land'],
  'Philadelphia': ['Camden'],
}

const subLocalityToParent: Record<string, string> = {}
Object.entries(cityAliases).forEach(([parent, subs]) => {
  subs.forEach(sub => {subLocalityToParent[sub] = parent})
})

function formatCity(slug: string) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

async function getCityData(slug: string) {
  const city = formatCity(slug)

  const citiesToQuery = [city, ...(cityAliases[city] ?? [])]

  const { data, error } = await supabase
    .from('submission')
    .select(`
      *,
      role (profession, department),
      hospital!inner (name, city, state)
    `)
    .in('hospital.city', citiesToQuery)
    .eq('is_active', true)
    .order('submitted_at', { ascending: false })

  if (error || !data) {
    return {
      submissions: [],
      city,
      parentCity: subLocalityToParent[city] ?? null,
      state: '',
    }
  }

  const stateInfo = data[0]?.hospital?.state ?? ''

  return {
    submissions: data,
    city,
    parentCity: subLocalityToParent[city] ?? null,
    state: stateInfo,
  }
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { submissions, city, parentCity, state } = await getCityData(slug)

  return (
    <CityClient
      submissions={submissions}
      city={city}
      parentCity={parentCity}
      state={state}
      aliases={cityAliases[city] ?? null}
    />
  )
}