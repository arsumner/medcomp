import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#071633] text-[#B8C4D4]">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5 md:gap-12">
          <div className="col-span-2">
            <Link
              href="/"
              className="font-serif text-3xl font-medium tracking-[-0.03em] text-white transition hover:text-[#E7FAF4]"
            >
              MedComp
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#B8C4D4]">
              Transparent, anonymous salary data for healthcare professionals
              across the United States.
            </p>

            <div className="mt-6 inline-flex rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-medium text-[#E7FAF4] backdrop-blur">
              Built for healthcare professionals.
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#7F92AA]">
              Explore
            </p>

            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link
                  href="/profession"
                  className="text-[#B8C4D4] transition hover:text-white"
                >
                  Professions
                </Link>
              </li>
              <li>
                <Link
                  href="/location"
                  className="text-[#B8C4D4] transition hover:text-white"
                >
                  Locations
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="text-[#B8C4D4] transition hover:text-white"
                >
                  Explore data
                </Link>
              </li>
              <li>
                <Link
                  href="/submit"
                  className="text-[#B8C4D4] transition hover:text-white"
                >
                  Submit salary
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#7F92AA]">
              Professions
            </p>

            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link
                  href="/profession/registered-nurse-rn"
                  className="text-[#B8C4D4] transition hover:text-white"
                >
                  Registered nurse
                </Link>
              </li>
              <li>
                <Link
                  href="/profession/nurse-practitioner-np"
                  className="text-[#B8C4D4] transition hover:text-white"
                >
                  Nurse practitioner
                </Link>
              </li>
              <li>
                <Link
                  href="/profession/physician-assistant-pa"
                  className="text-[#B8C4D4] transition hover:text-white"
                >
                  Physician assistant
                </Link>
              </li>
              <li>
                <Link
                  href="/profession/certified-registered-nurse-anesthetist-crna"
                  className="text-[#B8C4D4] transition hover:text-white"
                >
                  CRNA
                </Link>
              </li>
              <li>
                <Link
                  href="/profession/respiratory-therapist"
                  className="text-[#B8C4D4] transition hover:text-white"
                >
                  Respiratory therapist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#7F92AA]">
              Company
            </p>

            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-[#B8C4D4] transition hover:text-white"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#B8C4D4] transition hover:text-white"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[#B8C4D4] transition hover:text-white"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-[#B8C4D4] transition hover:text-white"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-[#7F92AA]">
            © {new Date().getFullYear()} MedComp. All rights reserved.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="text-xs text-[#7F92AA]">
              Anonymous salary transparency for healthcare workers.
            </p>

            <Link
              href="/submit"
              className="inline-flex w-fit items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#071633] shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-[#E7FAF4]"
            >
              Submit salary
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}