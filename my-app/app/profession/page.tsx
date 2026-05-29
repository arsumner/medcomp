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
    <main className="min-h-screen bg-[#F5F4F1] text-[#071A3D]">

      <section className="px-6 pt-24 pb-16 md:px-8 md:pt-28 md:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#8D9AA7]">
              Search by profession
            </p>

            <h1 className="font-serif text-5xl font-normal leading-[1.05] tracking-[-0.04em] text-[#071A3D] md:text-7xl">
              What is everyone else making?
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#667085] md:text-lg">
              We got tired of not knowing. So we built a place where healthcare workers
              can share what they actually earn — anonymously, honestly, and without
              anyone trying to sell you something.
            </p>

            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-[#8D9AA7]">
              Pick your role below and see what people are reporting.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {[
                `${totalProfessions} professions`,
                'No account needed',
                '100% anonymous',
                'No ads, no recruiters',
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#E2E8EF] bg-white px-4 py-2 text-sm font-medium text-[#64748B] shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#178C85]">
                Profession directory
              </p>
              <h2 className="mt-2 font-serif text-4xl font-normal tracking-[-0.03em] text-[#071A3D] md:text-5xl">
                Pick your role.
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#667085]">
                Don't see an exact match? Choose the closest one — titles vary by hospital
                but the pay data will still be useful.
              </p>
            </div>

            <Link
              href="/submit"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#071A3D] px-6 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(7,26,61,0.18)] transition hover:-translate-y-0.5 hover:bg-[#102A5C]"
            >
              Share what you make
            </Link>
          </div>

          <div className="grid gap-5">
            {Object.entries(professions).map(([group, members]) => (
              <section
                key={group}
                className="overflow-hidden rounded-[2rem] border border-[#E2E8EF] bg-white shadow-[0_18px_60px_rgba(7,17,38,0.05)]"
              >
                <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
                  <div className="border-b border-[#EEF2F5] bg-[#F8F7F4] p-6 lg:border-b-0 lg:border-r">
                    <h3 className="font-serif text-3xl font-normal leading-tight tracking-[-0.03em] text-[#071A3D]">
                      {formatGroupName(group)}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#8D9AA7]">
                      {(members as string[]).length} roles
                    </p>
                  </div>

                  <div className="p-4 md:p-5">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      {(members as string[]).map((profession) => (
                        <Link
                          key={profession}
                          href={`/profession/${toSlug(profession)}`}
                          className="group flex min-h-[58px] items-center justify-between gap-4 rounded-2xl border border-transparent bg-[#F8F7F4] px-4 py-3 text-sm font-semibold text-[#253449] transition hover:border-[#D7E1E7] hover:bg-white hover:shadow-[0_12px_30px_rgba(7,17,38,0.06)]"
                        >
                          <span className="leading-5">{profession}</span>
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D7E1E7] bg-white text-[#8D9AA7] transition group-hover:border-[#071A3D] group-hover:bg-[#071A3D] group-hover:text-white">
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

          <div className="mt-12 rounded-[2rem] border border-[#E2E8EF] bg-white p-8 text-center shadow-[0_18px_60px_rgba(7,17,38,0.05)] md:p-12">
            <h3 className="font-serif text-3xl font-normal tracking-[-0.03em] text-[#071A3D] md:text-4xl">
              Don't see your salary in here yet?
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#667085]">
              Every submission makes this more useful for everyone. It takes under two minutes,
              nothing identifies you, and you don't need an account.
            </p>
            <Link
              href="/submit"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#071A3D] px-8 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(7,26,61,0.18)] transition hover:-translate-y-0.5 hover:bg-[#102A5C]"
            >
              Add your salary anonymously
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}