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
                Last updated: July 2026
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

              <p className="mt-3">
                We also automatically see basic technical information as part
                of normal website operation, like your IP address. This is
                mainly used by our rate-limiting tool to prevent spam and
                repeated automated submissions, and is not linked to or
                displayed alongside salary data.
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
                publicly display a submitter's name or contact information
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
                Cookies and analytics
              </h2>

              <p className="mt-3">
                Our hosting provider may collect basic, aggregate usage
                information, like general location, browser type, and pages
                visited, to help us understand site performance. This isn't
                used to build individual profiles of visitors.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                The tools we use
              </h2>

              <p className="mt-3">
                MedComp is a small, independently run site. We rely on a
                handful of standard third-party tools to keep it running:
                Supabase for our database, Vercel for hosting the site, and
                Upstash to help limit spam and repeated automated
                submissions. Each of these providers may process basic
                technical data, like IP addresses, as part of doing their
                job. We haven't built any custom tracking or analytics beyond
                what these tools provide by default.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Data retention
              </h2>

              <p className="mt-3">
                Submitted salary data is retained to maintain the usefulness of
                the database over time. If you would like a submission removed,
                see "Your rights and choices" below.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                What we do not sell
              </h2>

              <p className="mt-3">
                We do not sell or share personal information for
                advertising. MedComp is designed around anonymous pay
                transparency, not selling individual user identities or
                personal profiles.
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

              <p className="mt-3">
                If something happens that puts your information at risk in a
                way we're required to tell you about, we will let you know.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Your rights and choices
              </h2>

              <p className="mt-3">
                Depending on where you live, you may have rights to know
                what information we hold, or to have it corrected or
                deleted. Because MedComp does not require accounts or
                collect names, we're not able to look up or verify which
                submission belongs to a specific person. If you believe one
                of your own submissions should be corrected or removed,
                contact us with enough detail (such as approximate date,
                role, and hospital) for us to locate it, and we'll make a
                reasonable effort to do so.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Children's privacy
              </h2>

              <p className="mt-3">
                MedComp is not directed at children, and we do not knowingly
                collect information from anyone under 13 years old.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Changes to this policy
              </h2>

              <p className="mt-3">
                We may update this policy from time to time as the site
                evolves. The "Last updated" date at the top of this page will
                reflect the most recent version.
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