import Link from 'next/link'

export const metadata = {
  title: 'Terms of Use | MedComp',
  description:
    'Read the terms for using MedComp, an anonymous healthcare salary comparison site.',
}

export default function TermsPage() {
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
              <span className="text-[#071633]">Terms of Use</span>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B99A8]">
              Terms of Use
            </p>

            <h1 className="mt-2 max-w-4xl font-serif text-3xl font-medium leading-tight tracking-[-0.03em] text-[#071633] md:text-5xl">
              A few ground rules for using MedComp.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#64748B] md:text-base">
              MedComp is built to help healthcare workers compare pay more
              easily. By using the site, browsing salary data, or submitting a
              report, you agree to use it responsibly.
            </p>

            <p className="mt-5 text-sm font-medium text-[#94A3B8]">
              Last updated: July 2026
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-1 py-5 md:py-6">
        <div className="rounded-[1.75rem] border border-[#E1E8EF] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.04)] md:p-8">
          <div className="space-y-8 text-sm leading-7 text-[#64748B] md:text-base">
            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                1. What MedComp is
              </h2>

              <p className="mt-3">
                MedComp is an anonymous healthcare salary comparison site. It
                lets users submit and view compensation information across
                healthcare roles, hospitals, cities, states, departments, and
                experience levels.
              </p>

              <p className="mt-3">
                The information on MedComp is for general informational purposes
                only. It is not legal, financial, career, tax, payroll, or
                employment advice.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                2. Eligibility
              </h2>

              <p className="mt-3">
                MedComp is not directed at children, and you must be at least
                13 years old to use the site. By using MedComp, you confirm
                that you meet this requirement and that you are legally
                permitted to use the site in your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                3. User-submitted salary data
              </h2>

              <p className="mt-3">
                Salary data on MedComp comes from user submissions. We do our
                best to make the site useful, but we cannot guarantee that every
                submission is accurate, complete, current, or representative of
                every workplace or role.
              </p>

              <p className="mt-3">
                You should use MedComp as a helpful reference point, not as the
                only source for making career, negotiation, relocation, or
                financial decisions.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                4. Submitting information
              </h2>

              <p className="mt-3">
                When you submit information to MedComp, you agree that the
                information is accurate to the best of your knowledge and that
                you have the right to share it.
              </p>

              <p className="mt-3">
                Please do not submit names, employee IDs, patient information,
                private workplace documents, confidential employer information,
                or anything that could identify another person.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                5. Ownership and license to submitted content
              </h2>

              <p className="mt-3">
                You retain any rights you may have in the information you
                submit. By submitting a report to MedComp, you grant MedComp a
                worldwide, royalty-free, non-exclusive license to use, display,
                reproduce, aggregate, and analyze that information, in whole or
                in part, for the purpose of operating and improving the site.
              </p>

              <p className="mt-3">
                Aside from user submissions, the MedComp name, site design, and
                underlying software belong to MedComp and may not be copied,
                scraped in bulk, or reused without permission.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                6. Feedback
              </h2>

              <p className="mt-3">
                If you send us feedback, suggestions, or ideas about MedComp,
                you agree that we may use them freely, without any obligation
                to credit or compensate you.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                7. Anonymous use
              </h2>

              <p className="mt-3">
                MedComp is designed around anonymous salary sharing. Even so,
                some combinations of role, hospital, location, shift, and
                experience may be specific. Avoid submitting details that could
                reasonably identify you or someone else.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                8. Prohibited conduct
              </h2>

              <p className="mt-3">
                In addition to the rules elsewhere in these terms, you agree
                not to:
              </p>

              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                <li>impersonate any person or organization, or misrepresent your affiliation with one;</li>
                <li>submit content that is unlawful, defamatory, harassing, or infringes someone else's rights;</li>
                <li>attempt to access non-public areas of the site, other users' data, or MedComp's systems without authorization;</li>
                <li>interfere with the site's security features, including rate limits or abuse-prevention measures;</li>
                <li>use MedComp in any way that violates applicable law.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                9. Responsible use
              </h2>

              <p className="mt-3">
                You agree not to misuse MedComp, submit false or misleading
                information, attempt to disrupt the site, scrape or copy large
                portions of the database without permission, or use the site in
                a way that harms other users.
              </p>

              <p className="mt-3">
                You also agree not to use bots, scripts, or other automated
                tools to submit reports or access the site in a way that
                circumvents normal usage limits or abuse-prevention measures.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                10. Content removal and copyright complaints
              </h2>

              <p className="mt-3">
                We may edit, remove, or decline to display submissions that seem
                inaccurate, abusive, duplicative, identifying, spammy, or outside
                the purpose of the site.
              </p>

              <p className="mt-3">
                If you believe a submission includes identifying information,
                infringes your intellectual property rights, or should be
                reviewed for any other reason, contact MedComp through the
                contact method provided on the site with enough detail for us
                to locate and evaluate it.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                11. No guarantee of availability
              </h2>

              <p className="mt-3">
                MedComp may change, pause, remove, or update parts of the site at
                any time. We cannot guarantee that the site will always be
                available, error-free, or unchanged.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                12. Termination and restricting access
              </h2>

              <p className="mt-3">
                We may limit, throttle, suspend, or block access to MedComp,
                including by IP address or other technical means, for anyone
                we reasonably believe is abusing the site, submitting spam or
                false information, or violating these terms. We may do this
                without prior notice.
              </p>

              <p className="mt-3">
                Sections of these terms that by their nature should survive
                termination of your access — including ownership of
                submitted content, limitation of liability, indemnification,
                and governing law — will continue to apply.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                13. Third-party links
              </h2>

              <p className="mt-3">
                MedComp may link to third-party websites or resources. We are
                not responsible for the content, accuracy, or practices of
                any third-party site, and linking to it does not mean we
                endorse it.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                14. Disclaimer of warranties and limitation of liability
              </h2>

              <p className="mt-3">
                MedComp is provided "as is" and "as available," without
                warranties of any kind, whether express or implied, including
                warranties of accuracy, reliability, or fitness for a
                particular purpose.
              </p>

              <p className="mt-3">
                To the fullest extent allowed by law, MedComp and its
                operators are not responsible for decisions, losses,
                disputes, or damages that may result from using or relying on
                information from the site, including indirect, incidental,
                or consequential damages.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                15. Indemnification
              </h2>

              <p className="mt-3">
                You agree to indemnify and hold MedComp and its operators
                harmless from any claims, losses, or damages, including
                reasonable legal fees, arising out of your use of the site,
                the content you submit, or your violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                16. Dispute resolution
              </h2>

              <p className="mt-3">
                If a dispute arises between you and MedComp, we encourage you
                to contact us first so we can try to resolve it informally.
                If a dispute cannot be resolved informally, both you and
                MedComp agree that any claim will be brought on an individual
                basis only, and not as part of a class, consolidated, or
                representative action, to the fullest extent permitted by
                law.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                17. Governing law
              </h2>

              <p className="mt-3">
                These terms are governed by the laws of the United States and
                the state in which MedComp operates, without regard to
                conflict-of-law principles. If any part of these terms is
                found unenforceable, the remaining terms will stay in effect,
                and our failure to enforce any part of these terms is not a
                waiver of our right to do so later.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                18. Changes to these terms
              </h2>

              <p className="mt-3">
                We may update these terms from time to time. If we do, we will
                update the "Last updated" date on this page. Continued use of
                MedComp means you accept the updated terms.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                19. Contact
              </h2>

              <p className="mt-3">
                If you have questions about these terms, contact MedComp through
                the contact method provided on the site.
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
                Built for transparent pay comparisons
              </p>

              <h2 className="mt-1 font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Use the data as a starting point.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                MedComp can help you compare pay, but it should not replace your
                own judgment, official employer details, or professional advice.
              </p>
            </div>

            <Link
              href="/privacy"
              className="inline-flex w-fit items-center justify-center rounded-full bg-[#071633] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#13284F]"
            >
              View privacy policy
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}