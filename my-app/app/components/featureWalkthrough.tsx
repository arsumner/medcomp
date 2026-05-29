import Link from 'next/link'
import Image from 'next/image'
import mascotImg from '../../src/assets/orPill.png'
import mascotImg2 from '../../src/assets/heroPill.png'

const steps = [
  {
    eyebrow: 'Search by profession',
    title: 'See what people in your role are actually making.',
    body: 'Not a salary range from a job posting. Real numbers from real people doing the same job, filtered by experience, location, and hospital so you can actually compare.',
    href: '/profession',
    cta: 'Search for your profession →',
    align: 'left',
    visual: 'profession',
  },
  {
    eyebrow: 'Search by location',
    title: 'Find out if your market is paying you fairly.',
    body: 'Pay varies a lot by state and city, sometimes by $20+ an hour for the same role. Look up what hospitals near you are reporting before you accept an offer or sign a contract.',
    href: '/location',
    cta: 'Search by location →',
    align: 'right',
    visual: 'location',
  },
  {
    eyebrow: 'Help us grow our database',
    title: 'Share yours. It helps more people than you know.',
    body: 'No name. No account. Just your role, your pay, and your hospital. Every submission makes this more useful for the next nurse, PT, or rad tech trying to figure out if they\'re being underpaid.',
    href: '/submit',
    cta: 'Share your salary anonymously →',
    align: 'left',
    visual: 'submit',
  },
]

function ProfessionVisual() {
  return (
    <div className="relative rounded-[2.25rem] border border-[#E8ECEF] bg-white/90 p-8 shadow-[0_28px_90px_rgba(29,45,57,0.08)]">
      <div className="mb-6 flex items-start justify-between gap-6 border-b border-[#EEF2F3] pb-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#98A2B3]">
            Compare Registered Nurse (RN) Salaries
          </p>
          <p className="mt-2 font-serif text-[26px] font-normal leading-tight tracking-[-0.02em] text-[#071A3D]">
            Registered Nurse
          </p>
        </div>
        <div className="rounded-full bg-[#F1F8F7] px-3 py-1.5 text-[11px] font-medium text-[#178C85]">
          248 reports
        </div>
      </div>

      <div className="grid gap-4">
        {[
          { role: 'RN · PACU', hospital: 'NYP Brooklyn · 4 years', pay: '$63.97/hr', note: 'Charge differential reported' },
          { role: 'RN · Med-Surg', hospital: 'Providence Alaska · 13 years', pay: '$66.48/hr', note: 'Night differential reported' },
          { role: 'RN · ICU', hospital: 'UCSF Medical Center · 6 years', pay: '$82.10/hr', note: 'Weekend differential reported' },
        ].map((card, index) => (
          <div
            key={card.role}
            className="rounded-[1.5rem] border border-[#EDF1F2] bg-[#FCFCFA] p-5"
            style={{ transform: `translateX(${index * 10}px)` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold text-[#101828]">{card.role}</p>
                <p className="mt-1 text-[11px] text-[#98A2B3]">{card.hospital}</p>
              </div>
              <p className="text-[18px] font-semibold tracking-[-0.01em] text-[#071A3D]">{card.pay}</p>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-[#667085]">{card.note}</p>
          </div>
        ))}
      </div>

      <Image
        src={mascotImg}
        alt="MedComp mascot"
        width={140}
        height={140}
        className="absolute -bottom-12 -right-10 select-none object-contain drop-shadow-xl"
      />
    </div>
  )
}

function LocationVisual() {
  const percentiles = [
    { percentile: '25th', pay: '$43.50/hr', annual: '$90k/yr', position: 'left-[24%]', dot: 'bg-[#BFE8E3]', text: 'text-[#087A7B]' },
    { percentile: '75th', pay: '$62.50/hr', annual: '$130k/yr', position: 'left-[72%]', dot: 'bg-[#C9D9F6]', text: 'text-[#315AA6]' },
    { percentile: '90th', pay: '$66.00/hr', annual: '$137k/yr', position: 'left-[88%]', dot: 'bg-[#E8DDC5]', text: 'text-[#806126]' },
  ]

  return (
    <div className="relative overflow-hidden rounded-[2.25rem] border border-[#D7E1E7] bg-white p-8 shadow-[0_30px_90px_rgba(7,26,61,0.12)]">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8D9AA7]">Compare salaries in Alaska</p>
        <p className="mt-2 font-serif text-[28px] font-normal leading-tight tracking-[-0.03em] text-[#071A3D]">Rankings for Alaska RN pay</p>
      </div>

      <div className="rounded-[1.85rem] border border-[#E8EEF1] bg-[#F8FBFB] p-6">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[12px] font-semibold text-[#344054]">Hourly range</p>
          <p className="text-[11px] font-medium text-[#98A2B3]">$40–$70/hr</p>
        </div>

        <div className="relative px-1 pt-10 pb-4">
          <div className="absolute left-1 right-1 top-[44px] h-px bg-[#DCE6EA]" />
          <div className="relative h-2 rounded-full bg-[#E8EEF1]">
            <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-[#BFE8E3] via-[#C9D9F6] to-[#E8DDC5]" />
          </div>

          {percentiles.map((item) => (
            <div key={item.percentile} className={`absolute top-4 -translate-x-1/2 ${item.position}`}>
              <div className="flex flex-col items-center">
                <div className={`h-5 w-5 rounded-full border-[4px] border-white ${item.dot} shadow-[0_6px_16px_rgba(7,26,61,0.16)]`} />
                <div className="mt-2 h-5 w-px bg-[#DCE6EA]" />
                <p className={`mt-1 text-[10px] font-bold ${item.text}`}>{item.percentile}</p>
              </div>
            </div>
          ))}

          <div className="mt-4 flex justify-between text-[10px] font-medium text-[#A0AAB5]">
            <span>$40</span><span>$55</span><span>$70</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        {percentiles.map((item) => (
          <div key={item.percentile} className="rounded-[1.5rem] border border-[#E5ECEF] bg-white p-5 text-center shadow-[0_14px_34px_rgba(29,45,57,0.06)]">
            <p className={`text-[11px] font-bold ${item.text}`}>{item.percentile}</p>
            <p className="mt-2 text-[20px] font-semibold tracking-[-0.04em] text-[#071A3D]">{item.pay}</p>
            <p className="mt-1 text-[11px] font-medium text-[#8D9AA7]">{item.annual}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SubmitVisual() {
  const fields = [
    { label: 'Role', value: 'Nurse Practitioner' },
    { label: 'Specialty', value: 'Neurology' },
    { label: 'Location', value: 'Anchorage, AK' },
  ]

  return (
    <div className="relative overflow-hidden rounded-[2.25rem] border border-[#D7E1E7] bg-white p-8 shadow-[0_30px_90px_rgba(7,26,61,0.12)]">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8D9AA7]">Anonymous report</p>
        <p className="mt-2 font-serif text-[28px] font-normal leading-tight tracking-[-0.03em] text-[#071A3D]">Share your salary</p>
      </div>

      <div className="rounded-[1.85rem] border border-[#E8EEF1] bg-[#F8FBFB] p-6">
        <div className="mb-5 rounded-[1.5rem] bg-[#071A3D] px-6 py-6 text-white shadow-[0_18px_40px_rgba(7,26,61,0.18)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">Base pay</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <p className="text-[36px] font-semibold leading-none tracking-[-0.05em]">$93/hr</p>
            <p className="mb-1 text-[12px] font-medium text-white/60">Evenings +$4/hr</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {fields.map((field) => (
            <div key={field.label} className="flex items-center justify-between rounded-[1.35rem] border border-[#E5ECEF] bg-white px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#98A2B3]">{field.label}</p>
              <p className="text-[14px] font-semibold text-[#101828]">{field.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-[1.5rem] border border-[#E5ECEF] bg-white px-5 py-5">
        <p className="text-[20px] font-semibold text-[#071A3D]">Submit anonymously</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#071A3D] text-white">→</div>
      </div>
    </div>
  )
}

function StepVisual({ type }: { type: string }) {
  if (type === 'profession') return <ProfessionVisual />
  if (type === 'location') return <LocationVisual />
  return <SubmitVisual />
}

export default function FeatureWalkthrough() {
  return (
    <section className="bg-[#F5F4F1] px-6 pt-10 pb-32 md:px-10 md:pt-24 md:pb-40">
      <div className="mx-auto max-w-7xl">

        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl text-center lg:text-left">
              <p className="mb-4 font-serif text-[13px] italic text-[#9AA7B5]">how it works</p>
              <h2 className="font-serif text-5xl font-normal leading-[1.05] tracking-[-0.03em] text-[#071A3D] md:text-6xl">
                Pay transparency shouldn't require a union rep or a friend in HR.
              </h2>
              <p className="mt-6 text-[17px] leading-relaxed text-[#667085]">
                Here's what you can do with MedComp.
              </p>
            </div>

            <div className="hidden shrink-0 lg:block">
              <Image
                src={mascotImg2}
                alt="MedComp mascot"
                width={600}
                height={600}
                className="drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        <div className="mt-32 space-y-32 lg:space-y-40">
          {steps.map((step, index) => {
            const visualFirst = step.align === 'left'

            return (
              <div
                key={step.eyebrow}
                className="relative grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-32"
              >
                <div className="absolute -top-10 left-0 flex h-8 w-8 items-center justify-center rounded-full border border-[#D7E4E6] bg-[#F5F4F1] text-[12px] font-semibold text-[#178C85] shadow-sm lg:left-1/2 lg:-translate-x-1/2">
                  {index + 1}
                </div>

                <div className={`relative mx-auto w-full max-w-[580px] ${visualFirst ? 'lg:order-1' : 'lg:order-2'}`}>
                  <StepVisual type={step.visual} />
                </div>

                <div className={`mx-auto max-w-lg text-center lg:text-left ${visualFirst ? 'lg:order-2' : 'lg:order-1'}`}>
                  <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#178C85]">
                    {step.eyebrow}
                  </p>
                  <h3 className="font-serif text-4xl font-normal leading-[1.1] tracking-[-0.03em] text-[#071A3D] md:text-5xl">
                    {step.title}
                  </h3>
                  <p className="mt-6 text-[17px] leading-relaxed text-[#667085]">{step.body}</p>
                  <Link
                    href={step.href}
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#071A3D] px-6 py-3.5 text-[13px] font-semibold text-white transition hover:bg-[#102A5C]"
                  >
                    {step.cta}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}