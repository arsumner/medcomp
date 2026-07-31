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
              Built by a nurse, for healthcare workers
            </p>

            <h1 className="mt-2 max-w-4xl font-serif text-3xl font-medium leading-tight tracking-[-0.03em] text-[#071633] md:text-5xl">
              I built the resource I wish I'd had as a new nurse.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#64748B] md:text-base">
              MedComp is a free, anonymous salary database built to help
              healthcare workers compare compensation across hospitals,
              specialties, cities, and states so they can make more informed
              career decisions.
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
                Browse salaries
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-1 py-5 md:py-6">
        <div className="rounded-[1.75rem] border border-[#E1E8EF] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.04)] md:p-8">
          <div className="space-y-10 text-sm leading-7 text-[#64748B] md:text-base">

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Why I built MedComp
              </h2>

              <p className="mt-3">
                When I graduated nursing school, I accepted my first job in
                Florida making just <strong>$26 an hour</strong>. The patient
                ratios were overwhelming, there were no union protections, and
                like many new nurses, I assumed that was just how nursing was.
              </p>

              <p className="mt-3">
                I knew I wanted something better, but figuring out where to go
                next felt impossible. Salary information was scattered across
                Reddit, Glassdoor, Facebook groups, and conversations with other
                nurses. I spent countless hours trying to piece together what
                hospitals actually paid and whether moving would be worth it.
              </p>

              <p className="mt-3">
                Eventually, I learned about opportunities in New York. A year
                later, I packed everything I owned and made the move.
              </p>

              <p className="mt-3">
                Today, I work as a PACU nurse in NYC and earn more than I ever
                imagined when I first graduated. More importantly, I finally
                feel financially secure enough to save for retirement, travel,
                and plan for my future.
              </p>

              <p className="mt-3">
                That experience completely changed how I think about salary
                transparency.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Pay transparency changes careers
              </h2>

              <p className="mt-3">
                One conversation changed mine.
              </p>

              <p className="mt-3">
                Healthcare workers spend their careers taking care of everyone
                else, but we often don't have the information we need to make
                the best decisions for ourselves. Too many people don't know if
                they're underpaid, what other hospitals offer, or whether
                relocating could dramatically improve their quality of life.
              </p>

              <p className="mt-3">
                Better information gives healthcare workers more choices.
                Whether you're negotiating a new offer, changing specialties, or
                considering a move across the country, knowing what others are
                actually making can completely change your career.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                What MedComp does
              </h2>

              <p className="mt-3">
                MedComp brings healthcare compensation into one place.
              </p>

              <p className="mt-3">
                Healthcare professionals can anonymously share salaries and
                compare pay by hospital, specialty, department, city, state,
                years of experience, and role.
              </p>

              <p className="mt-3">
                Every submission helps build a more accurate picture of what
                healthcare workers are really earning and makes the database
                more valuable for the next person searching for answers.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Built with privacy in mind
              </h2>

              <p className="mt-3">
                Talking about compensation can feel uncomfortable, especially in
                healthcare. That's why salary submissions are anonymous. The
                goal isn't to spotlight individuals—it's to build a trusted
                community resource that benefits everyone.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                This is just the beginning
              </h2>

              <p className="mt-3">
                I'm building MedComp because I believe healthcare workers
                deserve the same level of salary transparency that exists in so
                many other industries.
              </p>

              <p className="mt-3">
                Whether you're a new graduate comparing offers, an experienced
                clinician thinking about relocating, or simply wondering if
                you're being paid fairly, I hope MedComp becomes a resource you
                can rely on throughout your career.
              </p>

              <p className="mt-3 font-medium text-[#071633]">
                Thanks for helping build it.
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
                100% anonymous. Always.
              </p>

              <h2 className="mt-1 font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Help make healthcare pay more transparent.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                Every anonymous salary submission helps another healthcare
                worker make a more informed career decision.
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