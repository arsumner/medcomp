import { supabase } from '@/lib/supabase'
import DataTable from '../../components/table/homeTable'
import { columns } from '../../components/table/columns'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function formatHospital(slug: string) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function percentile(arr: number[], p: number) {
  if (arr.length === 0) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const index = Math.ceil((p / 100) * sorted.length) - 1
  return sorted[Math.max(0, index)]
}

async function getHospitalData(slug: string) {
  const hospitalName = formatHospital(slug)

  const { data, error } = await supabase
    .from('submission')
    .select(`
      *,
      role (profession, department),
      hospital!inner (name, city, state)
    `)
    .ilike('hospital.name', `%${hospitalName}%`)
    .order('submitted_at', { ascending: false })

  if (error || !data) return { submissions: [], p25: 0, p75: 0, p90: 0, hospital: hospitalName, count: 0 }

  const rates = data.map(d => d.base_rate).filter(Boolean)
  const hospitalInfo = data[0]?.hospital
  return {
    submissions: data,
    p25: percentile(rates, 25),
    p75: percentile(rates, 75),
    p90: percentile(rates, 90),
    hospital: hospitalInfo?.name ?? hospitalName,
    city: hospitalInfo?.city ?? '',
    state: hospitalInfo?.state ?? '',
    count: data.length,
  }
}

export default async function HospitalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { submissions, p25, p75, p90, hospital, city, state, count } = await getHospitalData(slug)

  return (
    <main className="min-h-screen bg-[#F9FAFB]">

      <div className="relative bg-[#0A0F1E] px-8 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0D948820_0%,_transparent_70%)] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-7xl">

          <div className="inline-flex items-center gap-2 bg-[#0D9488]/10 border border-[#0D9488]/30 text-[#0D9488] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse" />
            Salary Data
          </div>

          <div className="flex items-start justify-between gap-12 mb-12">
            <div>
              <h1 className="text-5xl font-bold text-white tracking-tight mb-2">
                {hospital}
              </h1>
              {city && state && (
                <p className="text-[#4B5563] text-base mb-4">{city}, {state}</p>
              )}
              <p className="text-[#9CA3AF] text-lg max-w-lg leading-relaxed">
                Real compensation data from healthcare professionals at this facility.
              </p>
            </div>
            <div className="flex flex-col items-end gap-3 flex-shrink-0 ml-8 pt-2">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-200"
              >
                Submit Your Salary →
              </Link>
              <span className="text-[#4B5563] text-sm">{count} submissions</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px bg-white/5 rounded-t-2xl overflow-hidden">
            {[
              { label: '25th Percentile', value: p25, description: 'Entry level' },
              { label: '75th Percentile', value: p75, description: 'Experienced' },
              { label: '90th Percentile', value: p90, description: 'Top earners' },
            ].map(({ label, value, description }) => (
              <div key={label} className="bg-[#0A0F1E] px-8 py-10 flex flex-col gap-2 border-t border-white/5">
                <p className="text-xs uppercase tracking-widest text-[#374151] font-semibold">{label}</p>
                <div className="flex items-end gap-1.5 mt-1">
                  <p className="text-5xl font-bold text-white tracking-tight">
                    ${value.toLocaleString()}
                  </p>
                  <span className="text-[#374151] text-base mb-1.5">/hr</span>
                </div>
                <p className="text-xs text-[#374151]">{description}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      <section className="px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#0A0F1E]">Recent Submissions</h2>
            <span className="text-sm text-[#9CA3AF]">{count} total</span>
          </div>
          {submissions.length > 0 ? (
            <DataTable columns={columns} data={submissions} />
          ) : (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-16 text-center shadow-sm">
              <p className="text-[#9CA3AF] text-base mb-4">No submissions yet for this hospital.</p>
              <Link
                href="/submit"
                className="inline-block bg-[#0D9488] hover:bg-[#0F766E] text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors duration-200"
              >
                Be the first to submit →
              </Link>
            </div>
          )}
        </div>
      </section>

    </main>
  )
}