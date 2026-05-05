import { supabase } from '@/lib/supabase'
import DataTable from '../../components/table/homeTable'
import { columns } from '../../components/table/columns'
import Link from 'next/link'
import CityFilters from '../../components/filters/cityFilters'

function formatCity(slug: string) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function percentile(arr: number[], p: number) {
  if (arr.length === 0) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const index = Math.ceil((p / 100) * sorted.length) - 1
  return sorted[Math.max(0, index)]
}

async function getCityData(slug: string) {
  const city = formatCity(slug)

  const { data, error } = await supabase
    .from('submission')
    .select(`
      *,
      role (profession, department),
      hospital!inner (name, city, state)
    `)
    .eq('hospital.city', city)
    .order('submitted_at', { ascending: false })

  if (error || !data) return { submissions: [], p25: 0, p75: 0, p90: 0, city, state: '', count: 0 }

  const rates = data.map(d => d.base_rate).filter(Boolean)
  const stateInfo = data[0]?.hospital?.state ?? ''

  return {
    submissions: data,
    p25: percentile(rates, 25),
    p75: percentile(rates, 75),
    p90: percentile(rates, 90),
    city,
    state: stateInfo,
    count: data.length,
  }
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { submissions, p25, p75, p90, city, state, count } = await getCityData(slug)

  return (
    <main className="min-h-screen bg-[#F9FAFB]">

      <div className="relative bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F0FDFA] rounded-full -translate-y-48 translate-x-48 opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F0FDFA] rounded-full translate-y-32 -translate-x-32 opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_#f0fdfa08_1px,_transparent_1px),linear-gradient(to_bottom,_#f0fdfa08_1px,_transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-8 py-14">
          <div className="flex items-start justify-between gap-12">
            <div>

              <div className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-5">
                <Link href="/locations" className="hover:text-[#0D9488] transition-colors">Locations</Link>
                <span>/</span>
                {state && (
                  <>
                    <Link href={`/state/${state.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-[#0D9488] transition-colors">
                      {state}
                    </Link>
                    <span>/</span>
                  </>
                )}
                <span className="text-[#374151]">{city}</span>
              </div>

              <div className="inline-flex items-center gap-2 bg-[#F0FDFA] border border-[#99F6E4] text-[#0D9488] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse" />
                Live Salary Data
              </div>

              <h1 className="text-5xl font-bold text-[#0A0F1E] tracking-tight leading-none">
                {city}
              </h1>
              {state && (
                <p className="text-lg text-[#6B7280] font-medium mt-2">{state}</p>
              )}
              <p className="text-[#9CA3AF] text-sm max-w-md leading-relaxed mt-3">
                Real compensation data from healthcare professionals in {city}.
              </p>

              <div className="flex items-center gap-3 mt-5">
                <div className="flex items-center gap-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full px-3 py-1.5 text-xs text-[#6B7280]">
                  📊 {count} submissions
                </div>
                <div className="flex items-center gap-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full px-3 py-1.5 text-xs text-[#6B7280]">
                  🔒 Anonymous data
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4 flex-shrink-0 pt-2">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white px-6 py-3.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-[#0D9488]/20 hover:shadow-[#0D9488]/40"
              >
                Submit Your Salary
                <span className="text-white/70">→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '25th Percentile', value: p25, description: 'Entry level', icon: '📈' },
            { label: '75th Percentile', value: p75, description: 'Experienced', icon: '💼' },
            { label: '90th Percentile', value: p90, description: 'Top earners', icon: '🏆' },
          ].map(({ label, value, description, icon }) => (
            <div
              key={label}
              className="relative bg-white border border-[#E5E7EB] rounded-2xl px-6 py-6 overflow-hidden group hover:border-[#0D9488]/30 hover:shadow-md transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#F0FDFA] rounded-full -translate-y-12 translate-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-widest text-[#9CA3AF] font-semibold">{label}</p>
                  <span className="text-lg">{icon}</span>
                </div>
                <div className="flex items-end gap-1">
                  <p className="text-4xl font-bold text-[#0A0F1E] tracking-tight">
                    ${value.toLocaleString()}
                  </p>
                  <span className="text-[#9CA3AF] text-sm mb-1.5">/hr</span>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] inline-block" />
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="px-8 pb-16">
        <div className="mx-auto max-w-7xl">
          <CityFilters submissions={submissions} count={count} city={city} />
        </div>
      </section>

    </main>
  )
}