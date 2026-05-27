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

function formatPay(rate: number, type: string) {
  if (!rate) return '—'

  if (type === 'salary') return `$${rate.toLocaleString()}/yr`
  if (type === 'travel') return `$${rate.toLocaleString()}/wk`

  return `$${rate.toLocaleString()}/hr`
}

function getSubmittedLabel(submittedAt: string) {
  const date = new Date(submittedAt)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  if (diffMonths < 12) return `${diffMonths}mo ago`

  return `${diffYears}y ago`
}

function getDiffs(row: any) {
  return [
    { label: 'Night', value: row.night_diff },
    { label: 'Evening', value: row.evening_diff },
    { label: 'Charge', value: row.charge_diff },
    { label: 'Preceptor', value: row.preceptor_pay },
    { label: 'Cert', value: row.certification_pay },
  ].filter((d) => d.value)
}

function MobileReportCard({ report }: { report: any }) {
  const diffs = getDiffs(report)
  const cityState = [report.hospital?.city, report.hospital?.state]
    .filter(Boolean)
    .join(', ')

  return (
    <article className="rounded-[1.35rem] border border-[#D8E5E8] bg-white p-4 shadow-[0_12px_30px_rgba(7,17,38,0.045)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold leading-5 text-[#071126]">
            {report.role?.profession}
          </p>
          <p className="mt-0.5 text-xs leading-4 text-[#728391]">
            {report.role?.department || 'Department not listed'}
          </p>
        </div>

        <p className="shrink-0 font-serif text-2xl font-medium tracking-[-0.04em] text-[#071126]">
          {formatPay(report.base_rate, report.pay_type)}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#EDF3F4] pt-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#90A0AD]">
            Hospital
          </p>
          <p className="mt-1 text-sm font-medium leading-5 text-[#253449]">
            {report.hospital?.name || 'Not listed'}
          </p>
          <p className="mt-0.5 text-xs text-[#728391]">{cityState || '—'}</p>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#90A0AD]">
            Experience
          </p>
          <p className="mt-1 text-sm font-medium text-[#253449]">
            {report.years_experience ?? 0} years
          </p>

          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#90A0AD]">
            Added
          </p>
          <p className="mt-1 text-sm font-medium text-[#253449]">
            {getSubmittedLabel(report.submitted_at)}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-[#EDF3F4] pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#90A0AD]">
          Differentials
        </p>

        {diffs.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {diffs.map((d) => (
              <span
                key={d.label}
                className="inline-flex items-center rounded-full border border-[#C9DDE2] bg-[#F4FAFA] px-2.5 py-1 text-xs font-semibold text-[#405263]"
              >
                {d.label} +${d.value}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-1 text-sm text-[#728391]">None reported</p>
        )}
      </div>
    </article>
  )
}

export default function TableWithFilters({
  submissions,
  count,
  emptyMessage,
}: Props) {
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
        new Set(submissions.map((s) => s.role?.profession).filter(Boolean))
      ).sort(),
    ]
  }, [submissions])

  const hospitals = useMemo(() => {
    return [
      'All',
      ...Array.from(
        new Set(submissions.map((s) => s.hospital?.name).filter(Boolean))
      ).sort(),
    ]
  }, [submissions])

  const states = useMemo(() => {
    return [
      'All',
      ...Array.from(
        new Set(submissions.map((s) => s.hospital?.state).filter(Boolean))
      ).sort(),
    ]
  }, [submissions])

  const filtered = submissions.filter((s) => {
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
        return (
          new Date(b.submitted_at).getTime() -
          new Date(a.submitted_at).getTime()
        )
      case 'oldest':
        return (
          new Date(a.submitted_at).getTime() -
          new Date(b.submitted_at).getTime()
        )
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
    <div className="overflow-hidden rounded-[2rem] border border-[#C5D8DE] bg-white shadow-[0_24px_70px_rgba(7,17,38,0.07)]">
      <div className="border-b border-[#D9E6E9] bg-[linear-gradient(135deg,#FFFFFF_0%,#F3FAFA_100%)] px-4 py-5 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C9DDE2] bg-white px-3 py-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#256D83]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#526879]">
                Updated live
              </span>
            </div>

            <h2 className="mt-3 font-serif text-3xl font-medium tracking-[-0.04em] text-[#071126] md:text-4xl">
              Compare reported pay.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-2xl border border-[#D4E4E8] bg-white px-4 py-2 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#90A0AD]">
                Showing
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[#071126]">
                {paginated.length ? start + 1 : 0}–
                {Math.min(start + PAGE_SIZE, sorted.length)} of {sorted.length}
              </p>
            </div>

            <Link
              href="/submit"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#06183A] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(6,24,58,0.16)] transition hover:-translate-y-0.5 hover:bg-[#0A214C]"
            >
              Add your pay
            </Link>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#BFD3DA] bg-[#EEF7F7] px-3 py-1.5 text-xs font-semibold text-[#405263]">
              Filtered view
            </span>

            {professionFilter !== 'All' && (
              <span className="rounded-full border border-[#D8E5E8] bg-white px-3 py-1.5 text-xs font-medium text-[#5F7182]">
                Role: {professionFilter}
              </span>
            )}

            {hospitalFilter !== 'All' && (
              <span className="rounded-full border border-[#D8E5E8] bg-white px-3 py-1.5 text-xs font-medium text-[#5F7182]">
                Workplace: {hospitalFilter}
              </span>
            )}

            {stateFilter !== 'All' && (
              <span className="rounded-full border border-[#D8E5E8] bg-white px-3 py-1.5 text-xs font-medium text-[#5F7182]">
                State: {stateFilter}
              </span>
            )}

            {minExperience !== '' && (
              <span className="rounded-full border border-[#D8E5E8] bg-white px-3 py-1.5 text-xs font-medium text-[#5F7182]">
                Min exp: {minExperience}
              </span>
            )}

            {maxExperience !== '' && (
              <span className="rounded-full border border-[#D8E5E8] bg-white px-3 py-1.5 text-xs font-medium text-[#5F7182]">
                Max exp: {maxExperience}
              </span>
            )}

            {sort !== 'newest' && (
              <span className="rounded-full border border-[#D8E5E8] bg-white px-3 py-1.5 text-xs font-medium text-[#5F7182]">
                Sorted
              </span>
            )}

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-full border border-[#C5D8DE] bg-white px-3 py-1.5 text-xs font-semibold text-[#071126] shadow-sm transition hover:bg-[#F6FAFA]"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="border-b border-[#D9E6E9] bg-[#F6FAFA] px-4 py-4 md:px-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#071126]">
              Narrow your search
            </p>
            <p className="mt-1 text-xs leading-5 text-[#657686]">
              Filter by role, experience level, and submission date.
            </p>
        </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="hidden text-sm font-semibold text-[#256D83] transition hover:text-[#071126] sm:inline"
            >
              Reset filters
            </button>
          )}
        </div>

        <div className="rounded-[1.5rem] border border-[#D4E4E8] bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_10px_28px_rgba(7,17,38,0.035)]">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {professions.length > 2 && (
              <div className="lg:col-span-1">
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6F8290]">
                  Role
                </label>
                <select
                  value={professionFilter}
                  onChange={(e) => {
                    setProfessionFilter(e.target.value)
                    resetPage()
                  }}
                  className="h-10 w-full rounded-xl border border-[#BFD3DA] bg-[#FBFDFD] px-3 text-sm font-semibold text-[#071126] outline-none transition focus:border-[#06183A] focus:bg-white focus:ring-2 focus:ring-[#06183A]/10"
                >
                  {professions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {hospitals.length > 2 && (
              <div className="lg:col-span-2">
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6F8290]">
                  Workplace
                </label>
                <select
                  value={hospitalFilter}
                  onChange={(e) => {
                    setHospitalFilter(e.target.value)
                    resetPage()
                  }}
                  className="h-10 w-full rounded-xl border border-[#BFD3DA] bg-[#FBFDFD] px-3 text-sm font-semibold text-[#071126] outline-none transition focus:border-[#06183A] focus:bg-white focus:ring-2 focus:ring-[#06183A]/10"
                >
                  {hospitals.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {states.length > 2 && (
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6F8290]">
                  State
                </label>
                <select
                  value={stateFilter}
                  onChange={(e) => {
                    setStateFilter(e.target.value)
                    resetPage()
                  }}
                  className="h-10 w-full rounded-xl border border-[#BFD3DA] bg-[#FBFDFD] px-3 text-sm font-semibold text-[#071126] outline-none transition focus:border-[#06183A] focus:bg-white focus:ring-2 focus:ring-[#06183A]/10"
                >
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6F8290]">
                Min exp
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
                className="h-10 w-full rounded-xl border border-[#BFD3DA] bg-[#FBFDFD] px-3 text-sm font-semibold text-[#071126] outline-none transition placeholder:text-[#8FA0AA] focus:border-[#06183A] focus:bg-white focus:ring-2 focus:ring-[#06183A]/10"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6F8290]">
                Max exp
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
                className="h-10 w-full rounded-xl border border-[#BFD3DA] bg-[#FBFDFD] px-3 text-sm font-semibold text-[#071126] outline-none transition placeholder:text-[#8FA0AA] focus:border-[#06183A] focus:bg-white focus:ring-2 focus:ring-[#06183A]/10"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6F8290]">
                Sort by
              </label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value)
                  resetPage()
                }}
                className="h-10 w-full rounded-xl border border-[#BFD3DA] bg-[#FBFDFD] px-3 text-sm font-semibold text-[#071126] outline-none transition focus:border-[#06183A] focus:bg-white focus:ring-2 focus:ring-[#06183A]/10"
              >
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
          <div className="hidden md:block">
            <DataTable columns={columns} data={paginated} />
          </div>

          <div className="grid gap-3 bg-[#F5FAF9] p-3 md:hidden">
            {paginated.map((report) => (
              <MobileReportCard key={report.submissionid} report={report} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col gap-3 border-t border-[#D9E6E9] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
              <p className="text-sm font-medium text-[#5F7182]">
                Page {page} of {totalPages}
              </p>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="h-10 rounded-xl border border-[#BFD3DA] bg-white px-4 text-sm font-semibold text-[#405263] transition hover:bg-[#F8FCFB] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className="h-10 rounded-xl border border-[#BFD3DA] bg-white px-4 text-sm font-semibold text-[#405263] transition hover:bg-[#F8FCFB] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-[#F5FAF9] px-4 py-12 text-center md:px-6">
          <p className="text-sm font-semibold text-[#256D83]">
            No salaries reported yet
          </p>

          <h3 className="mt-2 font-serif text-3xl font-medium tracking-[-0.035em] text-[#071126]">
            Be the first to contribute to this portion of the community.
          </h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#667788]">
            {emptyMessage ??
              'Remove a workplace, state, or experience filter to see more reports. There may not be enough submissions in this exact slice yet.'}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#BFD3DA] bg-white px-5 text-sm font-semibold text-[#405263] transition hover:bg-[#F8FCFB]"
              >
                Reset filters
              </button>
            )}

            <Link
              href="/submit"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#06183A] px-5 text-sm font-semibold text-white transition hover:bg-[#0A214C]"
            >
              Add your pay
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}