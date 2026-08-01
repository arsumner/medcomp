'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import DataTable from './homeTable'
import { columns } from '../table/columns'

type Props = {
  submissions: any[]
  count: number
  emptyMessage?: string
  hideFilters?: ('state' | 'hospital' | 'profession' | 'city')[]
}

const PAGE_SIZE = 15

export default function TableWithFilters({
  submissions,
  count,
  emptyMessage,
  hideFilters = [],
}: Props) {
  const [sort, setSort] = useState('newest')
  const [professionFilter, setProfessionFilter] = useState('All')
  const [stateFilter, setStateFilter] = useState('All')
  const [cityFilter, setCityFilter] = useState('All')
  const [hospitalFilter, setHospitalFilter] = useState('All')
  const [minExperience, setMinExperience] = useState('')
  const [maxExperience, setMaxExperience] = useState('')
  const [page, setPage] = useState(1)

  const showState = !hideFilters.includes('state')
  const showCity = !hideFilters.includes('city')
  const showHospital = !hideFilters.includes('hospital')
  const showProfession = !hideFilters.includes('profession')

  const states = useMemo(() => {
    return [
      'All',
      ...Array.from(new Set(submissions.map((s) => s.hospital?.state).filter(Boolean))).sort(),
    ]
  }, [submissions])

  const cities = useMemo(() => {
    const source = stateFilter === 'All'
      ? submissions
      : submissions.filter((s) => s.hospital?.state === stateFilter)
    return [
      'All',
      ...Array.from(new Set(source.map((s) => s.hospital?.city).filter(Boolean))).sort(),
    ]
  }, [submissions, stateFilter])

  const hospitals = useMemo(() => {
    let source = submissions
    if (stateFilter !== 'All') source = source.filter((s) => s.hospital?.state === stateFilter)
    if (cityFilter !== 'All') source = source.filter((s) => s.hospital?.city === cityFilter)
    return [
      'All',
      ...Array.from(new Set(source.map((s) => s.hospital?.name).filter(Boolean))).sort(),
    ]
  }, [submissions, stateFilter, cityFilter])

  const professions = useMemo(() => {
    return [
      'All',
      ...Array.from(new Set(submissions.map((s) => s.role?.profession).filter(Boolean))).sort(),
    ]
  }, [submissions])

  const filtered = submissions.filter((s) => {
    const years = Number(s.years_experience)
    const matchesProfession = professionFilter === 'All' || s.role?.profession === professionFilter
    const matchesState = stateFilter === 'All' || s.hospital?.state === stateFilter
    const matchesCity = cityFilter === 'All' || s.hospital?.city === cityFilter
    const matchesHospital = hospitalFilter === 'All' || s.hospital?.name === hospitalFilter
    const matchesMinExperience = minExperience === '' || years >= Number(minExperience)
    const matchesMaxExperience = maxExperience === '' || years <= Number(maxExperience)
    return matchesProfession && matchesState && matchesCity && matchesHospital && matchesMinExperience && matchesMaxExperience
  })

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'highest': return b.base_rate - a.base_rate
      case 'lowest': return a.base_rate - b.base_rate
      case 'exp_most': return b.years_experience - a.years_experience
      case 'exp_least': return a.years_experience - b.years_experience
      case 'newest': return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
      case 'oldest': return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
      default: return 0
    }
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const paginated = sorted.slice(start, start + PAGE_SIZE)

  function resetPage() { setPage(1) }

  function clearFilters() {
    setProfessionFilter('All')
    setStateFilter('All')
    setCityFilter('All')
    setHospitalFilter('All')
    setMinExperience('')
    setMaxExperience('')
    setSort('newest')
    setPage(1)
  }

  const hasActiveFilters =
    professionFilter !== 'All' ||
    stateFilter !== 'All' ||
    cityFilter !== 'All' ||
    hospitalFilter !== 'All' ||
    minExperience !== '' ||
    maxExperience !== '' ||
    sort !== 'newest'

  const cityGate = showState ? stateFilter !== 'All' : true
  const hospitalGate = showState ? stateFilter !== 'All' : true

  return (
    <div className="overflow-hidden rounded-lg border border-[#E1E8EF] bg-white">
      <div className="border-b border-[#E1E8EF] bg-[#FAFBFD] px-4 py-5 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-medium tracking-[-0.03em] text-[#071633] md:text-4xl">
              Salaries submitted by our healthcare community
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-md border border-[#E1E8EF] bg-white px-4 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">Showing</p>
              <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-[#071633]">
                {paginated.length ? start + 1 : 0}–{Math.min(start + PAGE_SIZE, sorted.length)} of {sorted.length}
              </p>
            </div>
            <Link href="/submit" className="inline-flex h-11 items-center justify-center rounded-md bg-[#071633] px-5 text-sm font-semibold text-white transition hover:bg-[#13284F]">
              Add your pay
            </Link>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-[#BFE0DB] bg-[#EEF7F5] px-2.5 py-1 text-xs font-semibold text-[#0F766E]">Filtered view</span>
            {professionFilter !== 'All' && <span className="rounded-md border border-[#E1E8EF] bg-white px-2.5 py-1 text-xs font-medium text-[#64748B]">Role: {professionFilter}</span>}
            {stateFilter !== 'All' && <span className="rounded-md border border-[#E1E8EF] bg-white px-2.5 py-1 text-xs font-medium text-[#64748B]">State: {stateFilter}</span>}
            {cityFilter !== 'All' && <span className="rounded-md border border-[#E1E8EF] bg-white px-2.5 py-1 text-xs font-medium text-[#64748B]">City: {cityFilter}</span>}
            {hospitalFilter !== 'All' && <span className="rounded-md border border-[#E1E8EF] bg-white px-2.5 py-1 text-xs font-medium text-[#64748B]">Hospital: {hospitalFilter}</span>}
            {minExperience !== '' && <span className="rounded-md border border-[#E1E8EF] bg-white px-2.5 py-1 text-xs font-medium text-[#64748B]">Min exp: {minExperience}</span>}
            {maxExperience !== '' && <span className="rounded-md border border-[#E1E8EF] bg-white px-2.5 py-1 text-xs font-medium text-[#64748B]">Max exp: {maxExperience}</span>}
            {sort !== 'newest' && <span className="rounded-md border border-[#E1E8EF] bg-white px-2.5 py-1 text-xs font-medium text-[#64748B]">Sorted</span>}
            <button type="button" onClick={clearFilters} className="rounded-md border border-[#E1E8EF] bg-white px-2.5 py-1 text-xs font-semibold text-[#071633] transition hover:bg-[#FAFBFD]">
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="border-b border-[#E1E8EF] bg-[#FAFBFD] px-4 py-4 md:px-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#071633]">Don't see your city, state, facility or role? Be the first to contribute!</p>
            <p className="mt-1 text-xs leading-5 text-[#64748B]">
              {showState
                ? 'Filter by state first, then city and workplace will update automatically.'
                : 'Filter by role, city, or experience level.'}
            </p>
          </div>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="hidden text-sm font-semibold text-[#0F766E] transition hover:text-[#071633] sm:inline">
              Reset filters
            </button>
          )}
        </div>

        <div className="rounded-md border border-[#E1E8EF] bg-white p-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">

            {showState && (
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">State</label>
                <select value={stateFilter}
                  onChange={(e) => { setStateFilter(e.target.value); setCityFilter('All'); setHospitalFilter('All'); resetPage() }}
                  className="h-10 w-full rounded-md border border-[#E1E8EF] bg-[#FAFBFD] px-3 text-sm font-semibold text-[#071633] outline-none transition focus:border-[#071633] focus:bg-white focus:ring-2 focus:ring-[#071633]/10">
                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            {showCity && cityGate && cities.length > 1 && (
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">City</label>
                <select value={cityFilter}
                  onChange={(e) => { setCityFilter(e.target.value); setHospitalFilter('All'); resetPage() }}
                  className="h-10 w-full rounded-md border border-[#E1E8EF] bg-[#FAFBFD] px-3 text-sm font-semibold text-[#071633] outline-none transition focus:border-[#071633] focus:bg-white focus:ring-2 focus:ring-[#071633]/10">
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            {showHospital && hospitalGate && hospitals.length > 1 && (
              <div className="lg:col-span-2">
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">Hospital</label>
                <select value={hospitalFilter}
                  onChange={(e) => { setHospitalFilter(e.target.value); resetPage() }}
                  className="h-10 w-full rounded-md border border-[#E1E8EF] bg-[#FAFBFD] px-3 text-sm font-semibold text-[#071633] outline-none transition focus:border-[#071633] focus:bg-white focus:ring-2 focus:ring-[#071633]/10">
                  {hospitals.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            )}

            {showProfession && professions.length > 1 && (
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">Role</label>
                <select value={professionFilter}
                  onChange={(e) => { setProfessionFilter(e.target.value); resetPage() }}
                  className="h-10 w-full rounded-md border border-[#E1E8EF] bg-[#FAFBFD] px-3 text-sm font-semibold text-[#071633] outline-none transition focus:border-[#071633] focus:bg-white focus:ring-2 focus:ring-[#071633]/10">
                  {professions.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">Min exp</label>
              <input value={minExperience} onChange={(e) => { setMinExperience(e.target.value); resetPage() }}
                type="number" min="0" placeholder="0"
                className="h-10 w-full rounded-md border border-[#E1E8EF] bg-[#FAFBFD] px-3 text-sm font-semibold text-[#071633] outline-none transition placeholder:text-[#94A3B8] focus:border-[#071633] focus:bg-white focus:ring-2 focus:ring-[#071633]/10" />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">Max exp</label>
              <input value={maxExperience} onChange={(e) => { setMaxExperience(e.target.value); resetPage() }}
                type="number" min="0" placeholder="20"
                className="h-10 w-full rounded-md border border-[#E1E8EF] bg-[#FAFBFD] px-3 text-sm font-semibold text-[#071633] outline-none transition placeholder:text-[#94A3B8] focus:border-[#071633] focus:bg-white focus:ring-2 focus:ring-[#071633]/10" />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">Sort by</label>
              <select value={sort} onChange={(e) => { setSort(e.target.value); resetPage() }}
                className="h-10 w-full rounded-md border border-[#E1E8EF] bg-[#FAFBFD] px-3 text-sm font-semibold text-[#071633] outline-none transition focus:border-[#071633] focus:bg-white focus:ring-2 focus:ring-[#071633]/10">
                <option value="newest">Newest reports</option>
                <option value="oldest">Oldest reports</option>
                <option value="highest">Highest base pay</option>
                <option value="lowest">Lowest base pay</option>
                <option value="exp_most">Most experience</option>
                <option value="exp_least">Least experience</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {sorted.length > 0 ? (
        <>
          <DataTable columns={columns} data={paginated} />

          {totalPages > 1 && (
            <div className="flex flex-col gap-3 border-t border-[#E1E8EF] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
              <p className="text-sm font-medium text-[#64748B]">Page {page} of {totalPages}</p>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                <button type="button" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}
                  className="h-10 rounded-md border border-[#E1E8EF] bg-white px-4 text-sm font-semibold text-[#334155] transition hover:bg-[#FAFBFD] disabled:cursor-not-allowed disabled:opacity-40">
                  Previous
                </button>
                <button type="button" onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}
                  className="h-10 rounded-md border border-[#E1E8EF] bg-white px-4 text-sm font-semibold text-[#334155] transition hover:bg-[#FAFBFD] disabled:cursor-not-allowed disabled:opacity-40">
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-[#FAFBFD] px-4 py-12 text-center md:px-6">
          <p className="text-sm font-semibold text-[#0F766E]">No salaries reported yet</p>
          <h3 className="mt-2 font-serif text-3xl font-medium tracking-[-0.035em] text-[#071633]">
            Be the first to contribute to this portion of the community.
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#64748B]">
            {emptyMessage ?? 'Remove a workplace, state, or experience filter to see more reports. There may not be enough submissions in this exact slice yet.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {hasActiveFilters && (
              <button type="button" onClick={clearFilters} className="inline-flex h-11 items-center justify-center rounded-md border border-[#E1E8EF] bg-white px-5 text-sm font-semibold text-[#334155] transition hover:bg-[#FAFBFD]">
                Reset filters
              </button>
            )}
            <Link href="/submit" className="inline-flex h-11 items-center justify-center rounded-md bg-[#071633] px-5 text-sm font-semibold text-white transition hover:bg-[#13284F]">
              Add your pay
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}