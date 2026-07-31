'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [copied, setCopied] = useState(false)
  const email = 'medcompsupport@gmail.com'

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const contactReasons = [
    {
      title: 'Missing profession or department',
      description:
        'Let us know what role, specialty, or department should be added.',
    },
    {
      title: 'Report a bug or bad data',
      description:
        'Help us keep salary information accurate, useful, and easy to understand.',
    },
    {
      title: 'Feature suggestions',
      description:
        'Share ideas that would make MedComp more helpful for healthcare workers.',
    },
    {
      title: 'Partnerships',
      description:
        'Interested in working with MedComp? Reach out and tell us what you have in mind.',
    },
  ]

  return (
    <main className="min-h-screen bg-[#F6F9FC] px-4 py-6 md:px-8 md:py-8">
      <section className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#DDE7EF] bg-gradient-to-br from-white via-[#FBFCFD] to-[#EEF8F6] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.055)] md:p-7">
          <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-[#DDEEFF]/50 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#E7FAF4]/70 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B99A8]">
              Get in touch
            </p>

            <h1 className="mt-2 max-w-4xl font-serif text-3xl font-medium leading-tight tracking-[-0.03em] text-[#071633] md:text-5xl">
              Contact MedComp
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B] md:text-base">
              Have a question, suggestion, or issue to report? Send it over.
              Feedback helps shape what gets built next.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-1 py-5 md:py-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[1.75rem] border border-[#E1E8EF] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.04)] md:p-6">
            <p className="text-sm font-semibold text-[#0F766E]">
              How we can help
            </p>

            <h2 className="mt-1 max-w-2xl font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
              Send feedback, report issues, or suggest what to add next.
            </h2>

            <div className="mt-5 grid gap-3">
              {contactReasons.map(({ title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-[#E1E8EF] bg-[#F8FAFC] px-4 py-3"
                >
                  <p className="text-sm font-semibold text-[#071633]">
                    {title}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#64748B]">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] border border-[#E1E8EF] bg-gradient-to-br from-white via-[#FBFCFD] to-[#EEF8F6] p-5 shadow-[0_12px_36px_rgba(15,23,42,0.04)] md:p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#E7FAF4]/80 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-0 h-48 w-48 rounded-full bg-[#DDEEFF]/50 blur-3xl" />

            <div className="relative z-10">
              <p className="text-sm font-semibold text-[#0F766E]">
                Email support
              </p>

              <h2 className="mt-1 font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Send us a message.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#64748B]">
                We typically respond within 24–48 hours. Include as much detail
                as possible so we can help faster.
              </p>

              <div className="mt-6 flex items-center gap-2 rounded-2xl border border-[#DFE8F0] bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
                <a
                  href={`mailto:${email}`}
                  className="flex-1 transition hover:opacity-70"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">
                    Email
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#071633]">
                    {email}
                  </p>
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 rounded-full border border-[#DFE8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#071633] transition hover:bg-[#F8FAFC]"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-[#E1E8EF] bg-white/70 p-4">
                <p className="text-sm leading-6 text-[#64748B]">
                  Built by a PACU nurse. Every message is read and used to make
                  MedComp more useful for healthcare workers.
                </p>
              </div>

              <a
                href={`mailto:${email}`}
                className="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-[#071633] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(7,22,51,0.14)] transition hover:-translate-y-0.5 hover:bg-[#13284F]"
              >
                Email MedComp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}