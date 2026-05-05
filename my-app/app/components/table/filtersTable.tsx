'use client'

import { useState } from 'react'
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
  const [page, setPage] = useState(1)

  const professions = [
    'All',
    ...Array.from(new Set(submissions.map(s => s.role?.profession).filter(Boolean)))
  ]

  const filtered = submissions.filter(s => {
    if (professionFilter === 'All') return true
    return s.role?.profession === professionFilter
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

  function handleProfessionChange(value: string) {
    setProfessionFilter(value)
    setPage(1)
  }

  function handleSortChange(value: string) {
    setSort(value)
    setPage(1)
  }

  return (
    <div className="rounded-[2rem] border border-[#E2E8F0] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.06)] md:p-8">
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#4C6FFF]">
            Browse submissions
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
            Recent salary data
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
            Showing {paginated.length ? start + 1 : 0}–{Math.min(start + PAGE_SIZE, sorted.length)} of {sorted.length} entries
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
          {professions.length > 2 && (
            <select
              value={professionFilter}
              onChange={(e) => handleProfessionChange(e.target.value)}
              className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#334155] outline-none transition focus:border-[#4C6FFF] focus:bg-white"
            >
              {professions.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          )}

          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#334155] outline-none transition focus:border-[#4C6FFF] focus:bg-white"
          >
            <option value="newest">Most recent</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest pay</option>
            <option value="lowest">Lowest pay</option>
            <option value="exp_most">Most experience</option>
            <option value="exp_least">Least experience</option>
          </select>

          <Link
            href="/submit"
            className="inline-flex items-center justify-center rounded-xl bg-[#4C6FFF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3B5BDB]"
          >
            Add yours
          </Link>
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
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#334155] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
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
            No submissions yet
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
            Be the first to share salary data here.
          </h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#64748B]">
            {emptyMessage ?? 'Your anonymous submission can help other healthcare workers understand what fair pay looks like.'}
          </p>

          <Link
            href="/submit"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#4C6FFF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3B5BDB]"
          >
            Submit your salary
          </Link>
        </div>
      )}
    </div>
  )
}