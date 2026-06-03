'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { professions } from '../../data/professions'
import TableWithFilters from '../table/filtersTable'

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

  return (
      <TableWithFilters submissions={submissions} count={count} hideFilters={['state', 'city']} />
  )
}