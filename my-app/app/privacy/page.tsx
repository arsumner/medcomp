import Image from 'next/image'
import Link from 'next/link'
import mascotImg from '../../src/assets/anonPill.png'


export const metadata = {
  title: 'Privacy Policy | MedComp',
  description:
    'Learn how MedComp handles anonymous healthcare salary submissions and protects user privacy.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F6F9FC] px-4 py-6 md:px-8 md:py-8">
      <section className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#DDE7EF] bg-gradient-to-br from-white via-[#FBFCFD] to-[#EEF8F6] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.055)] md:p-8">
          <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-[#DDEEFF]/50 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#E7FAF4]/70 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-[#8B99A8]">
                <Link href="/" className="transition hover:text-[#071633]">
                  Home
                </Link>
                <span>/</span>
                <span className="text-[#071633]">Privacy Policy</span>
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B99A8]">
                Privacy Policy
              </p>

              <h1 className="mt-2 max-w-3xl font-serif text-3xl font-medium leading-tight tracking-[-0.03em] text-[#071633] md:text-5xl">
                Anonymous salary transparency, built with privacy in mind.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#64748B] md:text-base">
                MedComp helps healthcare workers compare pay without requiring
                names on salary submissions. This page explains what we collect,
                how we use it, and how we protect it.
              </p>

              <p className="mt-5 text-sm font-medium text-[#94A3B8]">
                Last updated: June 2026
              </p>
            </div>

            <div className="mx-auto shrink-0 md:mx-0">
            <Image
                src={mascotImg}
                alt="MedComp mascot"
                width={200}
                height={200}
                priority
            />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-1 py-5 md:py-6">
        <div className="rounded-[1.75rem] border border-[#E1E8EF] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.04)] md:p-8">
          <div className="space-y-8 text-sm leading-7 text-[#64748B] md:text-base">
            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                What we collect
              </h2>

              <p className="mt-3">
                MedComp collects anonymous salary information submitted by users,
                including details like profession, department, hospital, city,
                state, base hourly rate, shift differentials, years of
                experience, and employment type.
              </p>

              <p className="mt-3">
                We do not ask you to submit your name with a salary report.
                Please do not include personally identifying information in
                open-text fields.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                How we use salary data
              </h2>

              <p className="mt-3">
                We use submitted information to display salary comparisons,
                calculate pay ranges and percentiles, improve the database, and
                help healthcare workers better understand compensation across
                roles, hospitals, cities, and states.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Anonymous submissions
              </h2>

              <p className="mt-3">
                Salary submissions are intended to be anonymous. MedComp does not
                publicly display a submitter’s name or contact information
                alongside salary data.
              </p>

              <p className="mt-3">
                Because some combinations of role, facility, location, and
                experience level may be specific, avoid sharing details that
                could identify you or someone else.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Analytics and site usage
              </h2>

              <p className="mt-3">
                We may use basic analytics to understand how visitors use the
                site, monitor performance, and improve pages or features. This
                may include general information like browser type, device type,
                pages visited, and usage patterns.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                What we do not sell
              </h2>

              <p className="mt-3">
                We do not sell personal information. MedComp is designed around
                anonymous pay transparency, not selling individual user
                identities or personal profiles.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Accuracy and security
              </h2>

              <p className="mt-3">
                MedComp relies on user-submitted information and cannot guarantee
                every submission is complete, current, or accurate. We take
                reasonable steps to protect submitted information, but no website
                or database can be guaranteed completely secure.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Contact and removal requests
              </h2>

              <p className="mt-3">
                If you have privacy questions or believe a submission may
                identify you, contact MedComp through the contact method provided
                on the site.
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
                Share pay data without sharing your name.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                Every submission helps healthcare workers compare compensation
                with more confidence.
              </p>
            </div>

            <Link
              href="/submit"
              className="inline-flex w-fit items-center justify-center rounded-full bg-[#071633] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#13284F]"
            >
              Submit salary
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}