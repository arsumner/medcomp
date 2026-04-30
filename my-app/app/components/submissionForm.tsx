'use client'
import { useState } from 'react'
import { professions } from '../data/professions'
import { departments } from '../data/departments'
import HospitalSearch from './hospitalSearch'

const inputClass = "w-full bg-white text-[#111827] px-4 py-3 border border-[#E5E7EB] rounded-lg outline-none focus:border-[#0D9488] transition-colors duration-200 placeholder-[#9CA3AF]"
const selectClass = "w-full bg-white text-[#111827] px-4 py-3 border border-[#E5E7EB] rounded-lg outline-none focus:border-[#0D9488] transition-colors duration-200"
const labelClass = "block text-sm font-medium text-[#6B7280] mb-2 uppercase tracking-wider"
const altLabelClass = "text-[#6B7280] text-sm leading-relaxed mb-2 block"
const sectionClass = "bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-5 shadow-sm"

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

  const baseRateLabel = payType === 'salary' ? 'Annual Salary ($)' : payType === 'travel' ? 'Weekly Rate ($)' : 'Hourly Rate ($/hr)'
  const allProfessions = Object.values(professions).flat()


  async function handleSubmit(event:React.FormEvent) {
    event.preventDefault()
    console.log({ profession, department, baseRate, payType, hospital, city, state })

    if (!profession || !department || !baseRate || !payType || !hospital || !city || !state) {
      alert('Please fill out all required fields')
      return
    }

    const hospitalResponse = await fetch(`/api/hospitals?name=${encodeURIComponent(hospital)}`)
    const hospitalData = await hospitalResponse.json()

    let hospitalid
    if (hospitalData.length > 0) {
      hospitalid = hospitalData[0].hospitalid
    } else {
      const newHospital = await fetch('/api/hospitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: hospital, city, state })
      })
      const newHospitalData = await newHospital.json()
      hospitalid = newHospitalData[0].hospitalid

    }

    const roleResponse = await fetch(`/api/roles?profession=${encodeURIComponent(profession)}&department=${encodeURIComponent(department)}`)
    const roleData = await roleResponse.json()

    let roleid
    if (roleData.length > 0) {
      roleid = roleData[0].roleid
    } else {
      const newRole = await fetch('/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profession, department })
      })
      const newRoleData = await newRole.json()
      roleid = newRoleData[0].roleid
    } 

    const response = await fetch('/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pay_type: payType,
        base_rate: parseFloat(baseRate),
        hospitalid,
        roleid,
        years_experience: parseInt(years_experience),
        night_diff: night_diff ? parseFloat(night_diff) : null,
        certification_pay: certification_pay ? parseFloat(certification_pay) : null,
        charge_diff: charge_diff ? parseFloat(charge_diff) : null,
        evening_diff: evening_diff ? parseFloat(evening_diff) : null,
        signon_bonus: signon_bonus ? parseFloat(signon_bonus) : null,
        preceptor_pay: preceptor_pay ? parseFloat(preceptor_pay) : null
      })
    })

    if (response.ok) {
      alert('Submission successful! Thank you for contributing to our community.')
    } else {
      alert('Submission failed. Please try again later.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl mx-auto w-full">

      {/* Role */}
      <div className={sectionClass}>
        <h2 className="text-[#0A0F1E] font-semibold text-lg">Role Information</h2>
        <p className={altLabelClass}> We support all healthcare professions. If we are missing your profession or department please {""}
          <a href="/contact" style={{ color: '#3B82F6' }} className="underline">
            message us
          </a>
        {""} so we can continue to improve and expand our community.</p>
        <div>
          <label className={labelClass}>Profession</label>
          <select
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className={selectClass}
            required
          >
            <option value="">Select Profession</option>
              {allProfessions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Department or Unit</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className={selectClass}
            required
          >
            <option value="">Select Department</option>
            {departments.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Years of Experience</label>
          <label className={altLabelClass}>Note: Enter total years of experience in this profession, not years at current role.</label>
          <input
            className={inputClass}
            value={years_experience}
            onChange={(e) => setYearsExperience(e.target.value)}
            placeholder="e.g. 3"
            type="number"
          />
        </div>
      </div>

      {/* Hospital Information */}
      <div className={sectionClass}>
        <h2 className="text-[#0A0F1E] font-semibold text-lg">Search for your hospital, clinic, outpatient center, or other facility</h2>
        <div>
        <p className={altLabelClass}>
          Can't find your facility? Please{' '}
          <a href="/contact" style={{ color: '#3B82F6' }} className="underline">
            message us
          </a>
          {' '}so we can add it to the database
        </p>      
        <HospitalSearch
            onSelect={(hospital, city, state) => {
              setHospital(hospital)
              setCity(city)
              setState(state)
            }}
          />
        </div>
      </div>

      {/* Compensation */}
      <div className={sectionClass}>
        <h2 className="text-[#0A0F1E] font-semibold text-lg">Base Compensation</h2>

        <div>
          <label className={labelClass}>Pay Type</label>
          <label className={altLabelClass}>Select pay type and frequency from the drop down: salary, hourly, or weekly. Travel rates
            typically fall under weekly pay frequency.
          </label>
          <select
            value={payType}
            onChange={(e) => setPayType(e.target.value)}
            className={selectClass}
            required
          >
            <option value="hourly_staff">Hourly</option>
            <option value="salary">Salary</option>
            <option value="travel">Travel (weekly)</option>
          </select>
          </div>

        <div>
          <label className={labelClass}>{baseRateLabel}</label>
          <input
            className={inputClass}
            value={baseRate}
            onChange={(e) => setBaseRate(e.target.value)}
            placeholder={payType === 'salary' ? '85000' : payType === 'travel' ? '2800' : '48.50'}
            type="number"
            step=".01"
            min="0"
          />
        </div>
      </div>

      {/* Differentials */}
      <div className={sectionClass}>
        <h2 className="text-[#0A0F1E] font-semibold text-lg">
          Shift Differentials <span className="text-[#9CA3AF] text-sm font-normal">(optional)</span>
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Preceptor Pay</label>
            <input className={inputClass} value={preceptor_pay} onChange={(e) => setPreceptorPay(e.target.value)} placeholder="2.50" type="number" min="0" step=".01" />
          </div>
          <div>
            <label className={labelClass}>Certification Pay</label>
            <input className={inputClass} value={certification_pay} onChange={(e) => setCertificationPay(e.target.value)} placeholder="1.25" type="number" min="0" step=".01" />
          </div>
          <div>
            <label className={labelClass}>Night Differential</label>
            <input className={inputClass} value={night_diff} onChange={(e) => setNightDiff(e.target.value)} placeholder="2.70" type="number" min="0" step=".01" />
          </div>
          <div>
            <label className={labelClass}>Evening Differential</label>
            <input className={inputClass} value={evening_diff} onChange={(e) => setEveningDiff(e.target.value)} placeholder="2.00" type="number" min="0" step=".01" />
          </div>
          <div>
            <label className={labelClass}>Charge Differential</label>
            <input className={inputClass} value={charge_diff} onChange={(e) => setChargeDiff(e.target.value)} placeholder="2.50" type="number" min="0" step=".01" />
          </div>
          <div>
            <label className={labelClass}>Sign-on Bonus</label>
            <label className={altLabelClass}>Sign-on bonuses can be split in increments. Enter the total sign-on bonus offered.</label>
            <input className={inputClass} value={signon_bonus} onChange={(e) => setSignonBonus(e.target.value)} placeholder="5000" type="number" min="0" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white py-4 rounded-full font-semibold text-lg tracking-wide transition-colors duration-200">
        Submit Your Salary
      </button>
    </form>
  )
}