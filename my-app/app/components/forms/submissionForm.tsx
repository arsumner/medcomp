'use client'
import { useState } from 'react'
import { professions } from '../../data/professions'
import { departments } from '../../data/departments'
import { useRouter } from 'next/navigation'
import HospitalSearch from './../forms/hospitalSearch'

const inputClass =
  'w-full rounded-[1.15rem] bg-white/90 px-4 py-3.5 text-[#071A3D] ring-1 ring-[#C7D3DC] outline-none transition placeholder:text-[#475569] focus:bg-white focus:ring-2 focus:ring-[#116F6B]'

const selectClass =
  'w-full rounded-[1.15rem] bg-white/90 px-4 py-3.5 text-[#071A3D] ring-1 ring-[#C7D3DC] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#116F6B]'

const labelClass =
  'mb-2 block text-xs font-bold uppercase tracking-[0.13em] text-[#334155]'

const altLabelClass =
  'mb-2 block text-sm font-medium leading-relaxed text-[#405064]'

const sectionClass =
  'border-t border-[#C7D3DC] pt-8'

const stepClass =
  'text-xs font-bold uppercase tracking-[0.15em] text-[#0B6F6A]'

const headingClass =
  'mt-2 font-serif text-3xl font-normal tracking-[-0.04em] text-[#071A3D]'

const descriptionClass =
  'mt-2 max-w-2xl text-sm font-medium leading-7 text-[#334155]'

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
  const [placeId, setPlaceId] = useState('')
  const router = useRouter()

  const baseRateLabel =
    payType === 'salary'
      ? 'Annual Salary ($)'
      : payType === 'travel'
        ? 'Weekly Rate ($)'
        : 'Hourly Rate ($/hr)'

  const allProfessions = Object.values(professions).flat()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!profession || !department || !baseRate || !payType || !hospital || !city || !state) {
      alert('Please fill out all required fields')
      return
    }

    const hospitalResponse = await fetch(
      `/api/hospitals?place_id=${encodeURIComponent(placeId)}&name=${encodeURIComponent(hospital)}`
    )

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
        body: JSON.stringify({ name: hospital, city, state, place_id: placeId })
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
      router.push('/submit/thankyou')
    } else {
      alert('Submission failed. Please try again later.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-3xl flex-col gap-9">
      <div className="rounded-[2.5rem] bg-white/80 px-6 py-7 shadow-[0_24px_80px_rgba(7,21,47,0.10)] ring-1 ring-[#C7D3DC] backdrop-blur-md md:px-8 md:py-8">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0B6F6A]">
          Anonymous salary submission
        </p>

        <h1 className="mt-3 font-serif text-4xl font-normal leading-[1.05] tracking-[-0.05em] text-[#071A3D] md:text-5xl">
          Share your healthcare compensation.
        </h1>

        <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-[#334155]">
          Your submission helps other healthcare workers compare pay, prepare for negotiations, and understand what fair compensation looks like.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 text-sm font-bold text-[#334155]">
          <span className="rounded-full bg-[#EEF3F5] px-4 py-2 ring-1 ring-[#C7D3DC]">
            Anonymous
          </span>

          <span className="rounded-full bg-[#EEF3F5] px-4 py-2 ring-1 ring-[#C7D3DC]">
            Takes ~2 minutes
          </span>

          <span className="rounded-full bg-[#DDF5F2] px-4 py-2 text-[#064E52] ring-1 ring-[#9FD5D0]">
            No account needed
          </span>
        </div>
      </div>

      <div className={sectionClass}>
        <div className="mb-6">
          <p className={stepClass}>Step 1</p>
          <h2 className={headingClass}>Role information</h2>
          <p className={descriptionClass}>
            Tell us what role and department best match your work.
          </p>
        </div>

        <div className="grid gap-5">
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
        </div>

        <p className="mt-5 text-sm font-medium leading-relaxed text-[#405064]">
          Missing your profession or department?{' '}
          <a href="/contact" className="font-bold text-[#0B6F6A] underline underline-offset-4">
            Message us
          </a>
          .
        </p>
      </div>

      <div className={sectionClass}>
        <div className="mb-6">
          <p className={stepClass}>Step 2</p>
          <h2 className={headingClass}>Facility</h2>
          <p className={descriptionClass}>
            Search for your hospital, clinic, outpatient center, or other healthcare facility.
          </p>
        </div>

        <HospitalSearch
          onSelect={(hospital, city, state, placeId) => {
            setHospital(hospital)
            setCity(city)
            setState(state)
            setPlaceId(placeId)
          }}
        />

        <p className="mt-5 text-sm font-medium leading-relaxed text-[#405064]">
          Can’t find your facility?{' '}
          <a href="/contact" className="font-bold text-[#0B6F6A] underline underline-offset-4">
            Message us
          </a>
          {' '}so we can add it.
        </p>
      </div>

      <div className={sectionClass}>
        <div className="mb-6">
          <p className={stepClass}>Step 3</p>
          <h2 className={headingClass}>Base compensation</h2>
          <p className={descriptionClass}>
            Enter your base pay before optional differentials or bonuses.
          </p>
        </div>

        <div className="grid gap-5">
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
      </div>

      <div className={sectionClass}>
        <div className="mb-6">
          <p className={stepClass}>Step 4</p>
          <h2 className={headingClass}>
            Additional pay
            <span className="ml-2 align-middle text-sm font-bold tracking-normal text-[#475569]">
              Optional
            </span>
          </h2>
          <p className={descriptionClass}>
            Add any differentials, certification pay, preceptor pay, charge pay, or sign-on bonus.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Preceptor pay</label>
            <input
              className={inputClass}
              value={preceptor_pay}
              onChange={(e) => setPreceptorPay(e.target.value)}
              placeholder="2.50"
              type="number"
              min="0"
              step=".01"
            />
          </div>

          <div>
            <label className={labelClass}>Certification pay</label>
            <input
              className={inputClass}
              value={certification_pay}
              onChange={(e) => setCertificationPay(e.target.value)}
              placeholder="1.25"
              type="number"
              min="0"
              step=".01"
            />
          </div>

          <div>
            <label className={labelClass}>Night differential</label>
            <input
              className={inputClass}
              value={night_diff}
              onChange={(e) => setNightDiff(e.target.value)}
              placeholder="2.70"
              type="number"
              min="0"
              step=".01"
            />
          </div>

          <div>
            <label className={labelClass}>Evening differential</label>
            <input
              className={inputClass}
              value={evening_diff}
              onChange={(e) => setEveningDiff(e.target.value)}
              placeholder="2.00"
              type="number"
              min="0"
              step=".01"
            />
          </div>

          <div>
            <label className={labelClass}>Charge differential</label>
            <input
              className={inputClass}
              value={charge_diff}
              onChange={(e) => setChargeDiff(e.target.value)}
              placeholder="2.50"
              type="number"
              min="0"
              step=".01"
            />
          </div>

          <div>
            <label className={labelClass}>Sign-on bonus</label>
            <input
              className={inputClass}
              value={signon_bonus}
              onChange={(e) => setSignonBonus(e.target.value)}
              placeholder="5000"
              type="number"
              min="0"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-[#071A3D] px-6 py-4 text-base font-bold text-white shadow-[0_16px_38px_rgba(7,26,61,0.20)] transition hover:-translate-y-0.5 hover:bg-[#102A5C] focus:outline-none focus:ring-4 focus:ring-[#C9D9FF]"
      >
        Submit anonymously
      </button>
    </form>
  )
}