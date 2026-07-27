'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

export default function Navbar() {
  const [exploreOpen, setExploreOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false)
  const exploreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMobileOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">

        <Link href="/" className="text-2xl font-semibold tracking-tight text-[#0F172A]">
          MedComp
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link href="/profession" className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors">
            Search by Profession
          </Link>

          <Link href="/location" className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors">
            Search by Location
          </Link>

          <div
            ref={exploreRef}
            className="relative"
            onMouseEnter={() => setExploreOpen(true)}
            onMouseLeave={() => setExploreOpen(false)}
          >
            <button
              className="flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              Explore
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className={`transition-transform duration-200 ${exploreOpen ? 'rotate-180' : ''}`}
              >
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {exploreOpen && (
              <div className="absolute left-1/2 top-full z-50 w-[340px] -translate-x-1/2 pt-2">
                <div className="overflow-hidden rounded-[1.5rem] border border-[#E2E8F0] bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
                  <div className="px-4 pb-2 pt-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
                      COMING SOON
                    </p>
                    <p className="mt-1 text-sm text-[#64748B]">
                      Cost of living calculator, pay trends, and more coming soon.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/submit"
            className="rounded-xl bg-[#071A3D] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102A5C]"
          >
            Submit your salary
          </Link>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/submit"
            className="rounded-xl bg-[#071A3D] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102A5C]"
          >
            Submit
          </Link>

          <button
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#0F172A]"
          >
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#E2E8F0] bg-white md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            <Link
              href="/profession"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#0F172A] hover:bg-[#F1F5F9]"
            >
              Search by Profession
            </Link>

            <Link
              href="/location"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#0F172A] hover:bg-[#F1F5F9]"
            >
              Search by Location
            </Link>

            <button
              onClick={() => setMobileExploreOpen((v) => !v)}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#0F172A] hover:bg-[#F1F5F9]"
            >
              Explore
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className={`transition-transform duration-200 ${mobileExploreOpen ? 'rotate-180' : ''}`}
              >
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {mobileExploreOpen && (
              <div className="ml-3 mt-1 rounded-lg bg-[#F8FAFC] px-3 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
                  COMING SOON
                </p>
                <p className="mt-1 text-sm text-[#64748B]">
                  Cost of living calculator, pay trends, and more coming soon.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}