'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import DataTable from './homeTable'
import { columns } from '../table/columns'

type Props = {
  submissions: any[]
  count: number
  emptyMessage?: string
}

const PAGE_SIZE = 15

export default function TableWithFilters({ submissions, count, emptyMessage }: Props) {
  const [sort, setSort] = useState('newest')
  const [professionFilter, setProfessionFilter] = useState('All')
  const [hospitalFilter, setHospitalFilter] = useState('All')
  const [stateFilter, setStateFilter] = useState('All')
  const [minExperience, setMinExperience] = useState('')
  const [maxExperience, setMaxExperience] = useState('')
  const [page, setPage] = useState(1)

  const professions = useMemo(() => {
    return [
      'All',
      ...Array.from(
        new Set(submissions.map(s => s.role?.profession).filter(Boolean))
      ).sort(),
    ]
  }, [submissions])

  const hospitals = useMemo(() => {
    return [
      'All',
      ...Array.from(
        new Set(submissions.map(s => s.hospital?.name).filter(Boolean))
      ).sort(),
    ]
  }, [submissions])

  const states = useMemo(() => {
    return [
      'All',
      ...Array.from(
        new Set(submissions.map(s => s.hospital?.state).filter(Boolean))
      ).sort(),
    ]
  }, [submissions])

  const filtered = submissions.filter(s => {
    const years = Number(s.years_experience)

    const matchesProfession =
      professionFilter === 'All' || s.role?.profession === professionFilter

    const matchesHospital =
      hospitalFilter === 'All' || s.hospital?.name === hospitalFilter

    const matchesState =
      stateFilter === 'All' || s.hospital?.state === stateFilter

    const matchesMinExperience =
      minExperience === '' || years >= Number(minExperience)

    const matchesMaxExperience =
      maxExperience === '' || years <= Number(maxExperience)

    return (
      matchesProfession &&
      matchesHospital &&
      matchesState &&
      matchesMinExperience &&
      matchesMaxExperience
    )
  })

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'highest':
        return b.base_rate - a.base_rate
      case 'lowest':
        return a.base_rate - b.base_rate
      case 'exp_most':
        return b.years_experience - a.years_experience
      case 'exp_least':
        return a.years_experience - b.years_experience
      case 'newest':
        return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
      case 'oldest':
        return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
      default:
        return 0
    }
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const paginated = sorted.slice(start, start + PAGE_SIZE)

  function resetPage() {
    setPage(1)
  }

  function clearFilters() {
    setProfessionFilter('All')
    setHospitalFilter('All')
    setStateFilter('All')
    setMinExperience('')
    setMaxExperience('')
    setSort('newest')
    setPage(1)
  }

  const hasActiveFilters =
    professionFilter !== 'All' ||
    hospitalFilter !== 'All' ||
    stateFilter !== 'All' ||
    minExperience !== '' ||
    maxExperience !== '' ||
    sort !== 'newest'

  return (
    <div className="rounded-[2rem] border border-[#E2E8F0] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.06)] md:p-8">
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#4C6FFF]">
            Browse pay reports
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
            Recent pay information
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
            Showing {paginated.length ? start + 1 : 0}–{Math.min(start + PAGE_SIZE, sorted.length)} of {sorted.length} reports
          </p>
        </div>

        <Link
          href="/submit"
          className="inline-flex w-fit items-center justify-center rounded-xl bg-[#4C6FFF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3B5BDB]"
        >
          Share your pay
        </Link>
      </div>

      <div className="mb-6 rounded-[1.5rem] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">
              Filter reports
            </p>
            <p className="mt-1 text-xs text-[#64748B]">
              Filter by what has already been submitted.
            </p>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-[#4C6FFF] hover:text-[#3B5BDB]"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          {professions.length > 2 && (
            <div className="xl:col-span-1">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-[#94A3B8]">
                Profession
              </label>
              <select
                value={professionFilter}
                onChange={(e) => {
                  setProfessionFilter(e.target.value)
                  resetPage()
                }}
                className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-medium text-[#334155] outline-none transition focus:border-[#4C6FFF]"
              >
                {professions.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          )}

          {hospitals.length > 2 && (
            <div className="xl:col-span-2">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-[#94A3B8]">
                Hospital
              </label>
              <select
                value={hospitalFilter}
                onChange={(e) => {
                  setHospitalFilter(e.target.value)
                  resetPage()
                }}
                className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-medium text-[#334155] outline-none transition focus:border-[#4C6FFF]"
              >
                {hospitals.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          )}

          {states.length > 2 && (
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-[#94A3B8]">
                State
              </label>
              <select
                value={stateFilter}
                onChange={(e) => {
                  setStateFilter(e.target.value)
                  resetPage()
                }}
                className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-medium text-[#334155] outline-none transition focus:border-[#4C6FFF]"
              >
                {states.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-[#94A3B8]">
              Min exp.
            </label>
            <input
              value={minExperience}
              onChange={(e) => {
                setMinExperience(e.target.value)
                resetPage()
              }}
              type="number"
              min="0"
              placeholder="0"
              className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-medium text-[#334155] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4C6FFF]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-[#94A3B8]">
              Max exp.
            </label>
            <input
              value={maxExperience}
              onChange={(e) => {
                setMaxExperience(e.target.value)
                resetPage()
              }}
              type="number"
              min="0"
              placeholder="20"
              className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-medium text-[#334155] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4C6FFF]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-[#94A3B8]">
              Sort
            </label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value)
                resetPage()
              }}
              className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-medium text-[#334155] outline-none transition focus:border-[#4C6FFF]"
            >
              <option value="newest">Most recent</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest pay</option>
              <option value="lowest">Lowest pay</option>
              <option value="exp_most">Most experience</option>
              <option value="exp_least">Least experience</option>
            </select>
          </div>
        </div>
      </div>

      {sorted.length > 0 ? (
        <>
          <DataTable columns={columns} data={paginated} />

          {totalPages > 1 && (
            <div className="mt-5 flex flex-col gap-3 border-t border-[#E2E8F0] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#64748B]">
                Page {page} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#334155] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#334155] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-[1.5rem] border border-[#E2E8F0] bg-[#F8FAFC] px-6 py-16 text-center">
          <p className="text-sm font-medium text-[#4C6FFF]">
            No matching reports
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
            Try changing your filters.
          </h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#64748B]">
            {emptyMessage ?? 'There are no pay reports matching those filters yet.'}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center rounded-xl border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-semibold text-[#334155] transition hover:border-[#C7D2FE] hover:text-[#4C6FFF]"
              >
                Clear filters
              </button>
            )}

            <Link
              href="/submit"
              className="inline-flex items-center justify-center rounded-xl bg-[#4C6FFF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3B5BDB]"
            >
              Share your pay
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}