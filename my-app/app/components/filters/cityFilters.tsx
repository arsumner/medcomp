'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { professions } from '../../data/professions'
import DataTable from '../table/homeTable'
import { columns } from '../table/columns'

const allProfessions = ['All Professions', ...Object.values(professions).flat()]

function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-')
}

type Submission = any

type Props = {
  submissions: Submission[]
  count: number
  city: string
}

export default function CityFilters({ submissions, count, city }: Props) {
  const [profession, setProfession] = useState('All Professions')
  const [cityQuery, setCityQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = submissions.filter(s => {
    if (profession === 'All Professions') return true
    return s.role?.profession === profession
  })

  function handleCitySearch() {
    if (!cityQuery.trim()) return
    router.push(`/city/${toSlug(cityQuery)}`)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-[#0A0F1E]">Recent Submissions</h2>
          <p className="text-sm text-[#9CA3AF] mt-1">{filtered.length} of {count} entries</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="bg-white border border-[#E5E7EB] text-[#374151] px-4 py-2 rounded-full outline-none focus:border-[#0D9488] transition-colors text-sm shadow-sm"
          >
            {allProfessions.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <div ref={inputRef} className="relative">
            <div className="flex rounded-full overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
              <input
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCitySearch()}
                placeholder="Search another city..."
                className="px-4 py-2 text-sm text-[#374151] outline-none placeholder-[#9CA3AF] w-48"
              />
              <button
                onClick={handleCitySearch}
                className="bg-[#0D9488] hover:bg-[#0F766E] text-white px-4 py-2 text-sm font-medium transition-colors duration-200"
              >
                Go →
              </button>
            </div>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <DataTable columns={columns} data={filtered} />
      ) : (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-16 text-center shadow-sm">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-[#0A0F1E] font-semibold text-lg mb-2">No results found</p>
          <p className="text-[#9CA3AF] text-sm">Try a different profession filter.</p>
        </div>
      )}
    </>
  )
}