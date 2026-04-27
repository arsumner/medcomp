'use client'
import { useState } from 'react'
import { professions } from '../data/professions'
import { departments } from '../data/departments'
import { states } from '../data/states'

export default function SubmissionForm() {
  const [profession, setProfession] = useState('')
  const [department, setDepartment] = useState('')
  const [baseRate, setBaseRate] = useState('')
  const [payType, setPayType] = useState('hourly_staff')
  const [state, setState] = useState('')

  return (
    <form className="flex flex-col gap-6 max-w-2xl mx-auto">

      <div> 
        <select 
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="bg-[#111827] text-white px-4 py-3 rounded-l-full border border-[#1F2937] outline-none"
        >
          <option value="">Select Profession</option>
            {professions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
      </div>
      
      <div>
          <select 
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="bg-[#111827] text-white px-4 py-3 rounded-l-full border border-[#1F2937] outline-none"
        >
          <option value="">Select Department</option>
            {departments.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
      </div>

        <input
          className="bg-[#111827] text-white px-4 py-3 rounded-l-full border border-[#1F2937] outline-none"
          value={baseRate}
          onChange={(e) => setBaseRate(e.target.value)}
          placeholder="$40"
        />
        <select 
          value={payType}
          onChange={(e) => setPayType(e.target.value)}
          className="bg-[#111827] text-white px-4 py-3 rounded-l-full border border-[#1F2937] outline-none"
        >
          <option value="hourly_staff">Hourly</option>
          <option value="salary">Salary</option>
          <option value="travel">Travel (weekly)</option>
        </select>

      
      {/* Hospital Information */}
      
      <div>
          <select 
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="bg-[#111827] text-white px-4 py-3 rounded-l-full border border-[#1F2937] outline-none"
        >
          <option value="">Select a State</option>
            {states.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
      </div>
      
      

      <button type="submit">Submit</button>
    </form>
  )
}
