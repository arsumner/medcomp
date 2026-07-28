import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#F6F9FC] px-4 py-6 md:px-8 md:py-8">
      <section className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#DDE7EF] bg-gradient-to-br from-white via-[#FBFCFD] to-[#EEF8F6] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.055)] md:p-8">
          <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-[#DDEEFF]/50 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#E7FAF4]/70 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B99A8]">
              Submission received
            </p>

            <h1 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-[-0.03em] text-[#071633] md:text-5xl">
              Thank you for helping make healthcare pay less hidden.
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#64748B] md:text-base">
              Your anonymous pay report helps another healthcare worker compare
              offers, plan their next move, and better understand what fair pay
              can look like.
            </p>

            <div className="mx-auto mt-7 max-w-xl rounded-[1.5rem] border border-[#E1E8EF] bg-white/78 p-5 text-left shadow-[0_14px_40px_rgba(15,23,42,0.04)] backdrop-blur md:p-6">
              <p className="text-sm font-semibold text-[#0F766E]">
                What your submission helps with
              </p>

              <div className="mt-4 grid gap-3 text-sm leading-6 text-[#64748B]">
                <div className="rounded-2xl bg-[#F8FAFC] px-4 py-3">
                  It helps someone know what to ask for.
                </div>

                <div className="rounded-2xl bg-[#F8FAFC] px-4 py-3">
                  It makes it easier to compare hospitals, roles, and locations.
                </div>

                <div className="rounded-2xl bg-[#F8FAFC] px-4 py-3">
                  It helps build the open pay database healthcare workers deserve.
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/profession"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#071633] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(7,22,51,0.14)] transition hover:-translate-y-0.5 hover:bg-[#13284F] sm:w-auto"
              >
                Browse pay by role
              </Link>

              <Link
                href="/locations"
                className="inline-flex w-full items-center justify-center rounded-full border border-[#DFE8F0] bg-white/80 px-5 py-2.5 text-sm font-semibold text-[#071633] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C8D8E6] sm:w-auto"
              >
                Browse by location
              </Link>

              <Link
                href="/submit"
                className="inline-flex w-full items-center justify-center rounded-full border border-[#DFE8F0] bg-white/80 px-5 py-2.5 text-sm font-semibold text-[#071633] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C8D8E6] sm:w-auto"
              >
                Add another report
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-1 py-5 md:py-6">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-[#E1E8EF] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.04)] md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#0F766E]">
                100% anonymous always
              </p>

              <h2 className="mt-1 font-serif text-2xl font-medium tracking-[-0.03em] text-[#071633]">
                Keep comparing healthcare pay with confidence.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                Explore salary reports by role, hospital, city, or state to see
                how pay compares across healthcare.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex w-fit items-center justify-center rounded-full bg-[#071633] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#13284F]"
            >
              Back home
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}