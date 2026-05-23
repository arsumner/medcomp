import Link from 'next/link'
import Image from 'next/image'
import mascotImg from '../../src/assets/orPill.png'
 
export default function FeatureWalkthrough() {
  return (
    <section className="bg-[#FBFAF7] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl space-y-32">
 
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-serif text-[13px] italic text-[#9AA7B5] mb-4">
          how it works
        </p>
        <h2 className="font-serif text-5xl font-normal leading-[1.05] tracking-[-0.03em] text-[#071A3D] md:text-6xl">
          Everything you need to know about what you should be earning.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-[#667085]">
          Simple salary insight for nurses and healthcare workers, built around real reports from people doing the work.
        </p>
      </div>
 
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
 
        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute inset-0 rounded-[2.5rem] bg-[#EAF7F6] blur-3xl" />
 
          <div className="relative rounded-[2.25rem] border border-[#E8ECEF] bg-white/90 p-6 shadow-[0_28px_90px_rgba(29,45,57,0.08)]">
            <div className="mb-6 flex items-start justify-between gap-6 border-b border-[#EEF2F3] pb-5">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#98A2B3]">
                  Profession search
                </p>
                <p className="mt-2 font-serif text-[24px] font-normal leading-tight tracking-[-0.02em] text-[#071A3D]">
                  Registered Nurse
                </p>
              </div>
              <div className="rounded-full bg-[#F1F8F7] px-3 py-1 text-[11px] font-medium text-[#178C85]">
                248 reports
              </div>
            </div>
 
            <div className="grid gap-3">
              {[
                {
                  role: 'RN · PACU',
                  hospital: 'NYP Brooklyn · 4 years',
                  pay: '$63.97/hr',
                  note: 'Charge differential reported',
                },
                {
                  role: 'RN · Med-Surg',
                  hospital: 'Providence Alaska · 13 years',
                  pay: '$66.48/hr',
                  note: 'Night differential reported',
                },
                {
                  role: 'RN · ICU',
                  hospital: 'UCSF Medical Center · 6 years',
                  pay: '$82.10/hr',
                  note: 'Weekend differential reported',
                },
              ].map((card) => (
                <div
                  key={card.role}
                  className="rounded-[1.5rem] border border-[#EDF1F2] bg-[#FCFCFA] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[13px] font-medium text-[#101828]">{card.role}</p>
                      <p className="mt-1 text-[11px] text-[#98A2B3]">{card.hospital}</p>
                    </div>
                    <p className="text-[18px] font-semibold tracking-[-0.01em] text-[#071A3D]">
                      {card.pay}
                    </p>
                  </div>
 
                  <p className="mt-3 text-[11px] leading-relaxed text-[#667085]">
                    {card.note}
                  </p>
                </div>
              ))}
            </div>
 
            <Image
              src={mascotImg}
              alt="MedComp mascot"
              width={150}
              height={150}
              className="absolute -bottom-8 -right-6 select-none object-contain drop-shadow-xl"
            />
          </div>
        </div>
 
        <div className="mx-auto max-w-xl text-center lg:text-left">
          <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#178C85]">
            Step 1 — Search by profession
          </p>
          <h3 className="font-serif text-5xl font-normal leading-[1.08] tracking-[-0.03em] text-[#071A3D]">
            Find pay reports for your exact role.
          </h3>
          <p className="mt-8 text-[18px] leading-relaxed text-[#667085]">
            Look up real pay reports by profession, specialty, and experience level so you can get a clearer sense of what nurses in similar roles are earning.
          </p>
          <Link
            href="/profession"
            className="mt-8 inline-flex items-center rounded-full bg-[#071A3D] px-5 py-3 text-[13px] font-medium text-white transition hover:bg-[#102A5C]"
          >
            Search by profession →
          </Link>
        </div>
 
      </div>
 
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
 
        <div className="mx-auto max-w-xl text-center lg:text-left">
          <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#178C85]">
            Step 2 — Search by location
          </p>
          <h3 className="font-serif text-5xl font-normal leading-[1.08] tracking-[-0.03em] text-[#071A3D]">
            See how pay changes by state and city.
          </h3>
          <p className="mt-8 text-[18px] leading-relaxed text-[#667085]">
            Compare pay across different locations before you apply, accept an offer, or make a move.
          </p>
          <Link
            href="/location"
            className="mt-8 inline-flex items-center rounded-full bg-[#071A3D] px-5 py-3 text-[13px] font-medium text-white transition hover:bg-[#102A5C]"
          >
            Search by location →
          </Link>
        </div>
 
        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute inset-0 rounded-[2.5rem] bg-[#F1F4FA] blur-3xl" />
 
          <div className="relative rounded-[2.25rem] border border-[#E8ECEF] bg-white/90 p-6 shadow-[0_28px_90px_rgba(29,45,57,0.08)]">
            <div className="mb-6 border-b border-[#EEF2F3] pb-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#98A2B3]">
                Location comparison
              </p>
              <p className="mt-2 font-serif text-[24px] font-normal leading-tight tracking-[-0.02em] text-[#071A3D]">
                Average RN pay
              </p>
            </div>
 
            <div className="space-y-4">
              {[
                { state: 'New York', avg: '$74/hr', tone: 'bg-[#EAF7F6]' },
                { state: 'California', avg: '$81/hr', tone: 'bg-[#E8F1FA]' },
                { state: 'Washington', avg: '$69/hr', tone: 'bg-[#F3F0EA]' },
                { state: 'Texas', avg: '$54/hr', tone: 'bg-[#F7F3F0]' },
              ].map((item) => (
                <div
                  key={item.state}
                  className="flex items-center justify-between rounded-[1.5rem] border border-[#EDF1F2] bg-[#FCFCFA] px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full ${item.tone}`} />
                    <p className="text-[13px] font-medium text-[#101828]">{item.state}</p>
                  </div>
                  <p className="text-[17px] font-semibold tracking-[-0.01em] text-[#071A3D]">
                    {item.avg}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
 
      </div>
 
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
 
        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute inset-0 rounded-[2.5rem] bg-[#EAF7F6] blur-3xl" />
 
          <div className="relative rounded-[2.25rem] border border-[#E8ECEF] bg-white/90 p-6 shadow-[0_28px_90px_rgba(29,45,57,0.08)]">
            <div className="mb-6 border-b border-[#EEF2F3] pb-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#98A2B3]">
                Anonymous report
              </p>
              <p className="mt-2 font-serif text-[24px] font-normal leading-tight tracking-[-0.02em] text-[#071A3D]">
                Share your salary
              </p>
            </div>
 
            <div className="space-y-3">
              {[
                { label: 'Profession', value: 'Registered Nurse (RN)' },
                { label: 'Specialty', value: 'PACU' },
                { label: 'Base pay', value: '$63.97/hr' },
                { label: 'Differential', value: 'Charge +$7/hr' },
              ].map((field) => (
                <div
                  key={field.label}
                  className="rounded-[1.5rem] border border-[#EDF1F2] bg-[#FCFCFA] px-4 py-3.5"
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#98A2B3]">
                    {field.label}
                  </p>
                  <p className="mt-1 text-[14px] font-medium text-[#101828]">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
 
            <div className="mt-5 rounded-[1.5rem] bg-[#071A3D] px-4 py-4 text-white">
              <p className="text-[13px] font-medium">Submit anonymously</p>
              <p className="mt-1 text-[11px] text-white/70">No name · No account required</p>
            </div>
          </div>
        </div>
 
        <div className="mx-auto max-w-xl text-center lg:text-left">
          <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#178C85]">
            Step 3 — Share anonymously
          </p>
          <h3 className="font-serif text-5xl font-normal leading-[1.08] tracking-[-0.03em] text-[#071A3D]">
            Add yours in under two minutes.
          </h3>
          <p className="mt-8 text-[18px] leading-relaxed text-[#667085]">
            No name. No account. Just your role, pay, and hospital. Every report helps another healthcare worker understand their worth.
          </p>
          <Link
            href="/submit"
            className="mt-8 inline-flex items-center rounded-full bg-[#071A3D] px-5 py-3 text-[13px] font-medium text-white transition hover:bg-[#102A5C]"
          >
            Share your salary →
          </Link>
        </div>
 
      </div>
 
      </div>
    </section>
  )
}