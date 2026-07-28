import Link from 'next/link'

export const metadata = {
  title: 'About | MedComp',
  description:
    'Learn why MedComp was built to help healthcare workers compare pay more easily.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F6F9FC] px-4 py-6 md:px-8 md:py-8">
      <section className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#DDE7EF] bg-gradient-to-br from-white via-[#FBFCFD] to-[#EEF8F6] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.055)] md:p-8">
          <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-[#DDEEFF]/50 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#E7FAF4]/70 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-3 flex items-center gap-2 text-sm text-[#8B99A8]">
              <Link href="/" className="transition hover:text-[#071633]">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#071633]">About</span>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B99A8]">
              About MedComp
            </p>

            <h1 className="mt-2 max-w-4xl font-serif text-3xl font-medium leading-tight tracking-[-0.03em] text-[#071633] md:text-5xl">
              Healthcare pay should not be so hard to compare.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#64748B] md:text-base">
              MedComp is a simple, anonymous salary database for healthcare
              workers. It was built to make it easier to see what people are
              actually being paid by role, hospital, city, and state.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#071633] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(7,22,51,0.14)] transition hover:-translate-y-0.5 hover:bg-[#13284F] sm:w-auto"
              >
                Submit salary
              </Link>

              <Link
                href="/profession"
                className="inline-flex w-full items-center justify-center rounded-full border border-[#DFE8F0] bg-white/80 px-5 py-2.5 text-sm font-semibold text-[#071633] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C8D8E6] sm:w-auto"
              >
                Browse by role
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-1 py-5 md:py-6">
        <div className="rounded-[1.75rem] border border-[#E1E8EF] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.04)] md:p-8">
          <div className="space-y-8 text-sm leading-7 text-[#64748B] md:text-base">
            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Why I built it
              </h2>

              <p className="mt-3">
                I built MedComp because healthcare workers talk about pay all
                the time, but the information is usually scattered. Someone
                heard what a friend makes. A recruiter gives a range. A job post
                leaves out the details that actually matter.
              </p>

              <p className="mt-3">
                That makes it harder to know if an offer is fair, if a hospital
                pays well, or if moving roles, cities, or specialties would be
                worth it.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                What MedComp does
              </h2>

              <p className="mt-3">
                MedComp lets healthcare workers anonymously share pay
                information and compare it across roles, hospitals, cities,
                states, departments, and experience levels.
              </p>

              <p className="mt-3">
                The goal is not to make pay data complicated. The goal is to put
                useful information in one place so people can make better
                decisions.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Why anonymity matters
              </h2>

              <p className="mt-3">
                Pay can be personal. MedComp does not ask you to attach your name
                to a salary report. Every submission is meant to help someone
                else without putting the person who shared it on display.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Who it is for
              </h2>

              <p className="mt-3">
                MedComp is for nurses, techs, therapists, pharmacists, advanced
                practice providers, and other healthcare workers who want a
                clearer picture of what pay looks like.
              </p>

              <p className="mt-3">
                You can use it before applying, before negotiating, before
                moving, or just to understand how your current pay compares.
              </p>
            </section>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-1 pb-20">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-[#E1E8EF] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.04)] md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#0F766E]">
                100% anonymous always
              </p>

              <h2 className="mt-1 font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Help make healthcare pay less hidden.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                Every salary report makes the database more useful for the next
                healthcare worker trying to compare pay.
              </p>
            </div>

            <Link
              href="/submit"
              className="inline-flex w-fit items-center justify-center rounded-full bg-[#071633] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#13284F]"
            >
              Submit anonymously
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}