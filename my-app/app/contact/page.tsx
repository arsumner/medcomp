export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#EEF2FF_0%,_transparent_36%)] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-14 md:px-8 md:py-16">
          <div className="mb-5 inline-flex items-center rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-xs font-medium text-[#475569]">
            Get in touch
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-[#0F172A] md:text-6xl">
            Contact MedComp
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#64748B] md:text-lg">
            Have a question, suggestion, or issue to report? We’d love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-16">
        <div className="grid max-w-5xl gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2rem] border border-[#E2E8F0] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] md:p-8">
            <p className="text-sm font-medium text-[#4C6FFF]">
              How we can help
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
              Send feedback, report issues, or suggest what to add next.
            </h2>

            <div className="mt-8 grid gap-4">
              {[
                {
                  title: 'Missing profession or department',
                  description: 'Let us know what role, specialty, or department should be added.',
                },
                {
                  title: 'Report a bug or bad data',
                  description: 'Help us keep salary information accurate, useful, and easy to understand.',
                },
                {
                  title: 'Feature suggestions',
                  description: 'Share ideas that would make MedComp more helpful for healthcare workers.',
                },
                {
                  title: 'Partnerships',
                  description: 'Interested in working with MedComp? Reach out and tell us what you have in mind.',
                },
              ].map(({ title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4"
                >
                  <p className="text-sm font-semibold text-[#0F172A]">
                    {title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#64748B]">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-[#E2E8F0] bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] md:p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#4C6FFF]/10 blur-2xl" />

            <div className="relative z-10">
              <p className="text-sm font-medium text-[#4C6FFF]">
                Email support
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
                Send us a message.
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
                We typically respond within 24–48 hours. Include as much detail as possible so we can help faster.
              </p>

              <a
                href="mailto:medcompsupport@gmail.com"
                className="mt-8 flex items-center justify-between rounded-2xl border border-[#E2E8F0] bg-white px-5 py-4 transition hover:border-[#C7D2FE] hover:bg-white"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#94A3B8]">
                    Email
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#0F172A]">
                    medcompsupport@gmail.com
                  </p>
                </div>

                <span className="text-[#94A3B8]">→</span>
              </a>

              <div className="mt-8 rounded-2xl bg-white/70 p-4">
                <p className="text-sm leading-relaxed text-[#64748B]">
                  Built by a PACU nurse. We read every message and use feedback to shape what gets built next.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}