import Link from "next/link"

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#EEF2FF_0%,_transparent_36%)] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center md:px-8 md:py-28">
          <p className="text-sm font-medium text-[#4C6FFF]">
            Submission received
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#0F172A] md:text-6xl">
            Thank you for helping make healthcare pay less hidden.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#64748B] md:text-lg">
            Your anonymous pay report helps another healthcare worker compare offers, plan their next move, and better understand what fair pay can look like.
          </p>

          <div className="mx-auto mt-10 max-w-xl rounded-[2rem] border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-left">
            <p className="text-sm font-semibold text-[#0F172A]">
              What your submission helps with
            </p>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#64748B]">
              <p>It helps someone know what to ask for.</p>
              <p>It makes it easier to compare hospitals, roles, and locations.</p>
              <p>It helps build the open pay database healthcare workers deserve.</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/profession"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#4C6FFF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3B5BDB] sm:w-auto"
            >
              Browse pay by role
            </Link>

            <Link
              href="/location"
              className="inline-flex w-full items-center justify-center rounded-xl border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-semibold text-[#334155] transition hover:border-[#C7D2FE] hover:text-[#4C6FFF] sm:w-auto"
            >
              Browse by location
            </Link>

            <Link
              href="/submit"
              className="inline-flex w-full items-center justify-center rounded-xl border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-semibold text-[#334155] transition hover:border-[#C7D2FE] hover:text-[#4C6FFF] sm:w-auto"
            >
              Add another report
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}