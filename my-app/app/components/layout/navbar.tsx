'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

export default function Navbar() {
  const [exploreOpen, setExploreOpen] = useState(false)
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

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

        <Link href="/" className="text-xl font-semibold tracking-tight text-[#0F172A]">
          MedComp
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link href="/profession" className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors">
            Professions
          </Link>

          <Link href="/locations" className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors">
            Locations
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
                      Explore
                    </p>
                    <p className="mt-1 text-sm text-[#64748B]">
                      Compare healthcare pay from different angles.
                    </p>
                  </div>

                  {[
                    {
                      href: "/explore/ranking",
                      title: "Rankings",
                      description: "Top paying hospitals, states, and cities.",
                    },
                    {
                      href: "/explore/experience",
                      title: "Experience & professions",
                      description: "Salary progression and profession insights.",
                    },
                    {
                      href: "/explore/calculator",
                      title: "Cost of living calculator",
                      description: "Compare true take-home pay after tax and COL.",
                    },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setExploreOpen(false)}
                      className="group flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition hover:bg-[#F8FAFC]"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A] group-hover:text-[#4C6FFF]">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-[#64748B]">
                          {item.description}
                        </p>
                      </div>

                      <span className="text-sm text-[#94A3B8] transition group-hover:translate-x-0.5 group-hover:text-[#4C6FFF]">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Link
          href="/submit"
          className="rounded-xl bg-[#4C6FFF] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3B5BDB]"
        >
          Submit your salary
        </Link>
      </div>
    </nav>
  )
}