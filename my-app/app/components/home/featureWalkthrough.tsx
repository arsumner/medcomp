import Link from 'next/link'
import Image from 'next/image'
import mascotImg from '../../../src/assets/orPill.png'
import mascotImg2 from '../../../src/assets/heroPill.png'

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
    title: 'Share yours. Help others in your community',
    body: 'No name. No account. Just your role, your pay, and your hospital. Every submission makes this more useful for the next nurse, PT, or rad tech trying to figure out if they\'re being underpaid.',
    href: '/submit',
    cta: 'Share your salary anonymously →',
    align: 'left',
    visual: 'submit',
  },
]

function ProfessionVisual() {
  return (
    <div className="relative rounded-[1.75rem] border border-[#E8ECEF] bg-white/90 p-5 shadow-[0_28px_90px_rgba(29,45,57,0.08)] sm:rounded-[2.25rem] sm:p-8">
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-[#EEF2F3] pb-5 sm:mb-6 sm:gap-6 sm:pb-6">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#98A2B3] sm:text-[11px]">
            Compare Registered Nurse (RN) Salaries
          </p>
          <p className="mt-2 font-serif text-[21px] font-normal leading-tight tracking-[-0.02em] text-[#071A3D] sm:text-[26px]">
            Registered Nurse
          </p>
        </div>
        <div className="shrink-0 rounded-full bg-[#F1F8F7] px-2.5 py-1 text-[10px] font-medium text-[#178C85] sm:px-3 sm:py-1.5 sm:text-[11px]">
          248 reports
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {[
          { role: 'RN · PACU', hospital: 'NYP Brooklyn · 4 years', pay: '$63.97/hr', note: 'Charge differential reported' },
          { role: 'RN · Med-Surg', hospital: 'Providence Alaska · 13 years', pay: '$66.48/hr', note: 'Night differential reported' },
          { role: 'RN · ICU', hospital: 'UCSF Medical Center · 6 years', pay: '$82.10/hr', note: 'Weekend differential reported' },
        ].map((card, index) => (
          <div
            key={card.role}
            className="rounded-[1.25rem] border border-[#EDF1F2] bg-[#FCFCFA] p-4 sm:rounded-[1.5rem] sm:p-5"
            style={{ transform: `translateX(${index * 6}px)` }}
          >
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-[12px] font-semibold text-[#101828] sm:text-[13px]">{card.role}</p>
                <p className="mt-1 text-[10px] text-[#98A2B3] sm:text-[11px]">{card.hospital}</p>
              </div>
              <p className="whitespace-nowrap text-[16px] font-semibold tracking-[-0.01em] text-[#071A3D] sm:text-[18px]">{card.pay}</p>
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-[#667085] sm:mt-3 sm:text-[11px]">{card.note}</p>
          </div>
        ))}
      </div>

      <Image
        src={mascotImg}
        alt="MedComp mascot"
        width={140}
        height={140}
        className="pointer-events-none absolute -bottom-12 -right-10 hidden select-none object-contain drop-shadow-xl sm:block"
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
    <div className="relative overflow-hidden rounded-[1.75rem] border border-[#D7E1E7] bg-white p-5 shadow-[0_30px_90px_rgba(7,26,61,0.12)] sm:rounded-[2.25rem] sm:p-8">
      <div className="mb-5 sm:mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8D9AA7] sm:text-[11px]">Compare salaries in Alaska</p>
        <p className="mt-2 font-serif text-[22px] font-normal leading-tight tracking-[-0.03em] text-[#071A3D] sm:text-[28px]">Rankings for Alaska RN pay</p>
      </div>

      <div className="rounded-[1.4rem] border border-[#E8EEF1] bg-[#F8FBFB] p-4 sm:rounded-[1.85rem] sm:p-6">
        <div className="mb-4 flex items-center justify-between sm:mb-5">
          <p className="text-[11px] font-semibold text-[#344054] sm:text-[12px]">Hourly range</p>
          <p className="text-[10px] font-medium text-[#98A2B3] sm:text-[11px]">$40–$70/hr</p>
        </div>

        <div className="relative px-1 pb-3 pt-8 sm:pb-4 sm:pt-10">
          <div className="absolute left-1 right-1 top-9 h-px bg-[#DCE6EA] sm:top-[44px]" />
          <div className="relative h-2 rounded-full bg-[#E8EEF1]">
            <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-[#BFE8E3] via-[#C9D9F6] to-[#E8DDC5]" />
          </div>

          {percentiles.map((item) => (
            <div key={item.percentile} className={`absolute top-3 -translate-x-1/2 sm:top-4 ${item.position}`}>
              <div className="flex flex-col items-center">
                <div className={`h-4 w-4 rounded-full border-[3px] border-white sm:h-5 sm:w-5 sm:border-[4px] ${item.dot} shadow-[0_6px_16px_rgba(7,26,61,0.16)]`} />
                <div className="mt-1.5 h-4 w-px bg-[#DCE6EA] sm:mt-2 sm:h-5" />
                <p className={`mt-1 text-[9px] font-bold sm:text-[10px] ${item.text}`}>{item.percentile}</p>
              </div>
            </div>
          ))}

          <div className="mt-3 flex justify-between text-[9px] font-medium text-[#A0AAB5] sm:mt-4 sm:text-[10px]">
            <span>$40</span><span>$55</span><span>$70</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-4">
        {percentiles.map((item) => (
          <div key={item.percentile} className="rounded-[1rem] border border-[#E5ECEF] bg-white p-2.5 text-center shadow-[0_14px_34px_rgba(29,45,57,0.06)] sm:rounded-[1.5rem] sm:p-5">
            <p className={`text-[10px] font-bold sm:text-[11px] ${item.text}`}>{item.percentile}</p>
            <p className="mt-1 text-[14px] font-semibold tracking-[-0.04em] text-[#071A3D] sm:mt-2 sm:text-[20px]">{item.pay}</p>
            <p className="mt-1 text-[9px] font-medium text-[#8D9AA7] sm:text-[11px]">{item.annual}</p>
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
    <div className="relative overflow-hidden rounded-[1.75rem] border border-[#D7E1E7] bg-white p-5 shadow-[0_30px_90px_rgba(7,26,61,0.12)] sm:rounded-[2.25rem] sm:p-8">
      <div className="mb-5 sm:mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8D9AA7] sm:text-[11px]">Anonymous report</p>
        <p className="mt-2 font-serif text-[22px] font-normal leading-tight tracking-[-0.03em] text-[#071A3D] sm:text-[28px]">Share your salary</p>
      </div>

      <div className="rounded-[1.4rem] border border-[#E8EEF1] bg-[#F8FBFB] p-4 sm:rounded-[1.85rem] sm:p-6">
        <div className="mb-4 rounded-[1.25rem] bg-[#071A3D] px-5 py-5 text-white shadow-[0_18px_40px_rgba(7,26,61,0.18)] sm:mb-5 sm:rounded-[1.5rem] sm:px-6 sm:py-6">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/55 sm:text-[10px]">Base pay</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-2 sm:flex-nowrap sm:gap-4">
            <p className="text-[28px] font-semibold leading-none tracking-[-0.05em] sm:text-[36px]">$93/hr</p>
            <p className="mb-1 text-[11px] font-medium text-white/60 sm:text-[12px]">Evenings +$4/hr</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2.5 sm:mt-4 sm:gap-3">
          {fields.map((field) => (
            <div key={field.label} className="flex items-center justify-between rounded-[1.1rem] border border-[#E5ECEF] bg-white px-4 py-3 sm:rounded-[1.35rem] sm:px-5 sm:py-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#98A2B3] sm:text-[10px]">{field.label}</p>
              <p className="text-[13px] font-semibold text-[#101828] sm:text-[14px]">{field.value}</p>
            </div>
          ))}
        </div>
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
    <section className="bg-[#F5F4F1] px-4 pt-8 pb-20 sm:px-6 sm:pt-10 sm:pb-32 md:px-10 md:pt-24 md:pb-40">
      <div className="mx-auto max-w-7xl">

        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <p className="mb-3 font-serif text-[13px] italic text-[#9AA7B5] sm:mb-4">how it works</p>
              <h2 className="font-serif text-3xl font-normal leading-[1.1] tracking-[-0.03em] text-[#071A3D] sm:text-4xl md:text-5xl lg:text-6xl">
                Pay transparency shouldn't be taboo.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#667085] sm:mt-6 sm:text-[17px]">
                Here's what you can do with MedComp.
              </p>
            </div>

            <div className="hidden shrink-0 sm:block sm:w-40 lg:w-auto">
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

        <div className="mt-16 space-y-16 sm:mt-32 sm:space-y-32 lg:space-y-40">
          {steps.map((step) => {
            const visualFirst = step.align === 'left'

            return (
              <div
                key={step.eyebrow}
                className="grid grid-cols-1 items-center gap-8 sm:gap-16 lg:grid-cols-2 lg:gap-32"
              >
                <div className={`relative mx-auto w-full max-w-[580px] ${visualFirst ? 'lg:order-1' : 'lg:order-2'}`}>
                  <StepVisual type={step.visual} />
                </div>

                <div className={`mx-auto max-w-lg text-center lg:text-left ${visualFirst ? 'lg:order-2' : 'lg:order-1'}`}>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#178C85] sm:mb-5 sm:text-[12px]">
                    {step.eyebrow}
                  </p>
                  <h3 className="font-serif text-2xl font-normal leading-[1.15] tracking-[-0.03em] text-[#071A3D] sm:text-4xl md:text-5xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-[#667085] sm:mt-6 sm:text-[17px]">{step.body}</p>
                  <Link
                    href={step.href}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#071A3D] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#102A5C] sm:mt-8 sm:px-6 sm:py-3.5"
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