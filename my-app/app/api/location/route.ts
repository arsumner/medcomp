import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('submission')
    .select(`
      base_rate,
      hospital (city, state)
    `)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const stateMap: Record<string, number[]> = {}
  const cityMap: Record<string, number[]> = {}

  data.forEach((submission: any) => {
    const state = submission.hospital?.state
    const city = submission.hospital?.city
    const rate = submission.base_rate

    if (state && rate) {
      if (!stateMap[state]) stateMap[state] = []
      stateMap[state].push(rate)
    }

    if (city && state && rate) {
      const key = `${city}, ${state}`
      if (!cityMap[key]) cityMap[key] = []
      cityMap[key].push(rate)
    }
  })

  const avgRate = (rates: number[]) =>
    rates.reduce((a, b) => a + b, 0) / rates.length

  const topStates = Object.entries(stateMap)
    .map(([state, rates]) => ({ state, avg: avgRate(rates) }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 15)
    .map(({ state }) => state)

  const topCities = Object.entries(cityMap)
    .map(([city, rates]) => ({ city, avg: avgRate(rates) }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 15)
    .map(({ city }) => city)

  return Response.json({ topStates, topCities })
}