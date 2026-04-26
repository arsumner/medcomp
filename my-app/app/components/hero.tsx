'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Hero() {
  const [category, setCategory] = useState('state')
  const [query, setQuery] = useState('')
  const router = useRouter()
  
  function handleSearch() {
    if (!query) {
      return(
        router.push(`/${category}/${query.toLowerCase().replace(/\s+/g, '-')}`)
      )
    }
  }


  return (
    <div className="w-full min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center px-8">
      <h1 className="text-white text-5xl font-bold text-center max-w-2xl leading-tight">
        Know Your Worth.
      </h1>
      <p className="text-[#9CA3AF] text-xl text-center mt-4 max-w-xl">
        See what other healthcare workers are making in your area and beyond.
      </p>

      <div className="flex mt-10 w-full max-w-2xl">
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-[#111827] text-white px-4 py-3 rounded-l-full border border-[#1F2937] outline-none"
        >
          <option value="profession">Profession</option>
          <option value="hospital">Hospital</option>
          <option value="city">City</option>
          <option value="state">State</option>
        </select>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="flex-1 bg-[#111827] text-white px-4 py-3 border-t border-b border-[#1F2937] outline-none"
        />

        <button
          onClick={handleSearch}
          className="bg-[#0D9488] hover:bg-[#0F766E] text-white px-6 py-3 rounded-r-full font-semibold transition-colors duration-200"
        >
          Search
        </button>
      </div>
    </div>
  )
}