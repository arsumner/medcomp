import Link from "next/link"
import { professions } from "../data/professions"

function toSlug(profession: string) {
  return profession.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "")
}

function formatGroupName(key: string) {
  return key.replace(/([A-Z])/g, " $1").trim()
}

export default async function Profession() {
  const totalProfessions = Object.values(professions).flat().length

  return (
    <main className="min-h-screen bg-[#F6FBFA] text-[#071126]">
      <section className="relative overflow-hidden border-b border-[#DDE8EA] bg-[linear-gradient(115deg,#F7FBFA_0%,#F4FAF8_42%,#EAF5FA_100%)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-12%] top-[-18%] h-[420px] w-[420px] rounded-full bg-[#DDEFEA]/70 blur-3xl" />
          <div className="absolute right-[-10%] top-[8%] h-[420px] w-[420px] rounded-full bg-[#DCECF8]/80 blur-3xl" />
          <div className="absolute bottom-[-28%] left-[30%] h-[360px] w-[520px] rounded-full bg-white/80 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#5F7182]">
              Healthcare salary transparency
            </p>

            <h1 className="font-serif text-5xl font-medium leading-[0.95] tracking-[-0.04em] text-[#071126] md:text-7xl">
              Browse healthcare salaries by profession.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#5F6F7F] md:text-lg">
              Start with your role, then compare anonymous pay reports by
              location, hospital, experience, and differentials.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-5xl rounded-[2rem] border border-[#D5E2E6] bg-white/82 p-3 shadow-[0_24px_80px_rgba(7,17,38,0.08)] backdrop-blur">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[1.4rem] bg-[#F7FBFA] px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A99A7]">
                  Step one
                </p>
                <p className="mt-2 font-serif text-2xl leading-tight text-[#071126]">
                  Choose your role
                </p>
                <p className="mt-2 text-sm leading-6 text-[#667788]">
                  Find the profession that best matches your day-to-day work.
                </p>
              </div>

              <div className="rounded-[1.4rem] bg-[#F2F8F8] px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A99A7]">
                  Step two
                </p>
                <p className="mt-2 font-serif text-2xl leading-tight text-[#071126]">
                  Compare the context
                </p>
                <p className="mt-2 text-sm leading-6 text-[#667788]">
                  Look at location, hospital system, experience, and pay type.
                </p>
              </div>

              <div className="rounded-[1.4rem] bg-[#EEF6FA] px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A99A7]">
                  Step three
                </p>
                <p className="mt-2 font-serif text-2xl leading-tight text-[#071126]">
                  Know your range
                </p>
                <p className="mt-2 text-sm leading-6 text-[#667788]">
                  Use real submissions to understand what similar roles report.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-[#637384]">
            <span>{totalProfessions} professions tracked</span>
            <span className="hidden h-1 w-1 rounded-full bg-[#A7B6C1] sm:block" />
            <span>Anonymous reports</span>
            <span className="hidden h-1 w-1 rounded-full bg-[#A7B6C1] sm:block" />
            <span>No account needed to browse</span>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#346C83]">
                Profession directory
              </p>
              <h2 className="mt-2 font-serif text-4xl font-medium tracking-[-0.03em] text-[#071126] md:text-5xl">
                Find your category.
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#667788]">
                Select a category, then choose the role that best fits your
                title or specialty.
              </p>
            </div>

            <Link
              href="/submit"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#06183A] px-6 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(6,24,58,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0A214C]"
            >
              Submit your salary
            </Link>
          </div>

          <div className="grid gap-5">
            {Object.entries(professions).map(([group, members]) => (
              <section
                key={group}
                className="overflow-hidden rounded-[2rem] border border-[#D9E5E8] bg-white/88 shadow-[0_18px_60px_rgba(7,17,38,0.055)]"
              >
                <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
                  <div className="border-b border-[#E3ECEF] bg-[linear-gradient(145deg,#F8FCFB_0%,#EFF7F7_100%)] p-6 lg:border-b-0 lg:border-r">

                    <h3 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-[-0.03em] text-[#071126]">
                      {formatGroupName(group)}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#687887]">
                      {(members as string[]).length} roles available
                    </p>
                  </div>

                  <div className="p-4 md:p-5">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      {(members as string[]).map((profession) => (
                        <Link
                          key={profession}
                          href={`/profession/${toSlug(profession)}`}
                          className="group flex min-h-[58px] items-center justify-between gap-4 rounded-2xl border border-transparent bg-[#F8FBFB] px-4 py-3 text-sm font-semibold text-[#253449] transition hover:border-[#BFD4DA] hover:bg-white hover:shadow-[0_12px_30px_rgba(7,17,38,0.07)]"
                        >
                          <span className="leading-5">{profession}</span>

                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D4E2E6] bg-white text-[#5A7280] transition group-hover:border-[#06183A] group-hover:bg-[#06183A] group-hover:text-white">
                            →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}