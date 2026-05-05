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
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#EEF2FF_0%,_transparent_36%)] pointer-events-none" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-14 md:px-8 md:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-xs font-medium text-[#475569]">
              Healthcare salary transparency
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#0F172A] md:text-6xl">
              Browse healthcare salaries by profession.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#64748B] md:text-lg">
              Explore anonymous compensation data across nursing, allied health, pharmacy, lab, imaging, healthcare IT, and more.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#64748B]">
              <span className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2">
                {totalProfessions} professions tracked
              </span>
              <span className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2">
                Anonymous submissions
              </span>
              <span className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2">
                Healthcare-specific data
              </span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E2E8F0] bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-medium text-[#4C6FFF]">
              Start with your role
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
              Find pay data that actually matches your work.
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
              Choose a profession below to compare real salary submissions by location, hospital, experience, and pay type.
            </p>

            <div className="mt-5 grid gap-3 text-sm text-[#475569]">
              <div className="rounded-2xl bg-white px-4 py-3">
                Compare roles across specialties
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                See anonymous pay submissions
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                Understand ranges before negotiating
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-8 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-[#0F172A]">
              Profession categories
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
              Select a category, then choose the role that best matches your work.
            </p>
          </div>

          <div className="grid gap-4">
            {Object.entries(professions).map(([group, members]) => (
              <div
                key={group}
                className="rounded-[1.5rem] border border-[#E2E8F0] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.04)] md:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                  <div className="lg:w-64 lg:flex-shrink-0">
                    <p className="text-sm font-semibold tracking-tight text-[#0F172A]">
                      {formatGroupName(group)}
                    </p>
                    <p className="mt-1 text-sm text-[#64748B]">
                      {(members as string[]).length} roles
                    </p>
                  </div>

                  <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {(members as string[]).map((profession) => (
                      <Link
                        key={profession}
                        href={`/profession/${toSlug(profession)}`}
                        className="group rounded-xl border border-transparent bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#334155] transition hover:border-[#C7D2FE] hover:bg-[#EEF2FF] hover:text-[#3B5BDB]"
                      >
                        <span className="flex items-center justify-between gap-3">
                          {profession}
                          <span className="text-[#94A3B8] transition group-hover:text-[#4C6FFF]">
                            →
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}