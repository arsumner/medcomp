'use client'
import { useState } from 'react'
import { professions } from '../data/professions'
import { departments } from '../data/departments'
import HospitalSearch from './hospitalSearch'

export default function SubmissionForm() {
  const [profession, setProfession] = useState('')
  const [department, setDepartment] = useState('')
  const [baseRate, setBaseRate] = useState('')
  const [payType, setPayType] = useState('hourly_staff')
  const [hospital, setHospital] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [years_experience, setYearsExperience] = useState('')
  const [night_diff, setNightDiff] = useState('')
  const [certification_pay, setCertificationPay] = useState('')
  const [charge_diff, setChargeDiff] = useState('')
  const [evening_diff, setEveningDiff] = useState('')
  const [signon_bonus, setSignonBonus] = useState('')
  const [preceptor_pay, setPreceptorPay] = useState('')

  return (
    <form className="flex flex-col gap-6 max-w-2xl mx-auto">

        {/*Role */}
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

        {/* Department */}
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

        {/* Years of experience */}
        <input
          className="bg-[#111827] text-white px-4 py-3 rounded-l-full border border-[#1F2937] outline-none"
          value={years_experience}
          onChange={(e) => setYearsExperience(e.target.value)}
          placeholder="3"
        />

        {/* Base Rate */}
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
      <HospitalSearch 
        onSelect={(hospital, city, state) => {
          setHospital(hospital)
          setCity(city)
          setState(state)
        }} 
      />

      {/* Differentials */}
        <input
          className="bg-[#111827] text-white px-4 py-3 rounded-l-full border border-[#1F2937] outline-none"
          value={preceptor_pay}
          onChange={(e) => setPreceptorPay(e.target.value)}
          placeholder="2.50"
        />
        <input
          className="bg-[#111827] text-white px-4 py-3 rounded-l-full border border-[#1F2937] outline-none"
          value={certification_pay}
          onChange={(e) => setCertificationPay(e.target.value)}
          placeholder="1.25"
        />
        <input
          className="bg-[#111827] text-white px-4 py-3 rounded-l-full border border-[#1F2937] outline-none"
          value={night_diff}
          onChange={(e) => setNightDiff(e.target.value)}
          placeholder="2.70"
        />
        <input
          className="bg-[#111827] text-white px-4 py-3 rounded-l-full border border-[#1F2937] outline-none"
          value={evening_diff}
          onChange={(e) => setEveningDiff(e.target.value)}
          placeholder="2.00"
        />
        <input
          className="bg-[#111827] text-white px-4 py-3 rounded-l-full border border-[#1F2937] outline-none"
          value={charge_diff}
          onChange={(e) => setChargeDiff(e.target.value)}
          placeholder="2.50"
        /> 
        <input
          className="bg-[#111827] text-white px-4 py-3 rounded-l-full border border-[#1F2937] outline-none"
          value={signon_bonus}
          onChange={(e) => setSignonBonus(e.target.value)}
          placeholder="2.50"
        />


      <button type="submit">Submit</button>
    </form>
  )
}
