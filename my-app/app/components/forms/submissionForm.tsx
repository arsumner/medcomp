'use client'
import { useState } from 'react'
import { professions } from '../../data/professions'
import { departments } from '../../data/departments'
import HospitalSearch from './../forms/hospitalSearch'

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
      <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="rounded-[2rem] border border-[#E2E8F0] bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] p-6 md:p-8">
          <p className="text-sm font-medium text-[#4C6FFF]">
            Anonymous salary submission
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F172A]">
            Share your healthcare compensation.
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
            Your submission helps other healthcare workers compare pay, prepare for negotiations, and understand what fair compensation looks like.
          </p>

          <div className="mt-5 flex flex-wrap gap-3 text-sm text-[#64748B]">
            <span className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5">
              Anonymous
            </span>
            <span className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5">
              Takes ~2 minutes
            </span>
          </div>
        </div>

        <div className={sectionClass}>
          <div>
            <p className="text-sm font-medium text-[#4C6FFF]">Step 1</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#0F172A]">
              Role information
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
              Tell us what role and department best match your work.
            </p>
          </div>

          <div>
            <label className={labelClass}>Profession</label>
            <select
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className={selectClass}
              required
            >
              <option value="">Select profession</option>
              {allProfessions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Department or unit</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className={selectClass}
              required
            >
              <option value="">Select department</option>
              {departments.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Years of experience</label>
            <p className={altLabelClass}>
              Enter total years of experience in this profession, not just years in your current role.
            </p>
            <input
              className={inputClass}
              value={years_experience}
              onChange={(e) => setYearsExperience(e.target.value)}
              placeholder="e.g. 3"
              type="number"
            />
          </div>

          <p className="text-sm leading-relaxed text-[#64748B]">
            Missing your profession or department?{' '}
            <a href="/contact" className="font-medium text-[#4C6FFF] underline underline-offset-4">
              Message us
            </a>
            .
          </p>
        </div>

        <div className={sectionClass}>
          <div>
            <p className="text-sm font-medium text-[#4C6FFF]">Step 2</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#0F172A]">
              Facility
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
              Search for your hospital, clinic, outpatient center, or other healthcare facility.
            </p>
          </div>

          <HospitalSearch
            onSelect={(hospital, city, state) => {
              setHospital(hospital)
              setCity(city)
              setState(state)
            }}
          />

          <p className="text-sm leading-relaxed text-[#64748B]">
            Can’t find your facility?{' '}
            <a href="/contact" className="font-medium text-[#4C6FFF] underline underline-offset-4">
              Message us
            </a>
            {' '}so we can add it.
          </p>
        </div>

        <div className={sectionClass}>
          <div>
            <p className="text-sm font-medium text-[#4C6FFF]">Step 3</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#0F172A]">
              Base compensation
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
              Enter your base pay before optional differentials or bonuses.
            </p>
          </div>

          <div>
            <label className={labelClass}>Pay type</label>
            <select
              value={payType}
              onChange={(e) => setPayType(e.target.value)}
              className={selectClass}
              required
            >
              <option value="hourly_staff">Hourly</option>
              <option value="salary">Salary</option>
              <option value="travel">Travel weekly</option>
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
              required
            />
          </div>
        </div>

        <div className={sectionClass}>
          <div>
            <p className="text-sm font-medium text-[#4C6FFF]">Step 4</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#0F172A]">
              Additional pay
              <span className="ml-2 text-sm font-normal text-[#94A3B8]">
                Optional
              </span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
              Add any differentials, certification pay, preceptor pay, charge pay, or sign-on bonus.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Preceptor pay</label>
              <input className={inputClass} value={preceptor_pay} onChange={(e) => setPreceptorPay(e.target.value)} placeholder="2.50" type="number" min="0" step=".01" />
            </div>

            <div>
              <label className={labelClass}>Certification pay</label>
              <input className={inputClass} value={certification_pay} onChange={(e) => setCertificationPay(e.target.value)} placeholder="1.25" type="number" min="0" step=".01" />
            </div>

            <div>
              <label className={labelClass}>Night differential</label>
              <input className={inputClass} value={night_diff} onChange={(e) => setNightDiff(e.target.value)} placeholder="2.70" type="number" min="0" step=".01" />
            </div>

            <div>
              <label className={labelClass}>Evening differential</label>
              <input className={inputClass} value={evening_diff} onChange={(e) => setEveningDiff(e.target.value)} placeholder="2.00" type="number" min="0" step=".01" />
            </div>

            <div>
              <label className={labelClass}>Charge differential</label>
              <input className={inputClass} value={charge_diff} onChange={(e) => setChargeDiff(e.target.value)} placeholder="2.50" type="number" min="0" step=".01" />
            </div>

            <div>
              <label className={labelClass}>Sign-on bonus</label>
              <input className={inputClass} value={signon_bonus} onChange={(e) => setSignonBonus(e.target.value)} placeholder="5000" type="number" min="0" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-[#4C6FFF] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#3B5BDB]"
        >
          Submit anonymously
        </button>
      </form>
    )
}