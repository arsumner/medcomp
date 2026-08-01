import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { professions } from "../data/professions"
import mascotImg from "../../src/assets/advancedPracticePill.png"

function toSlug(profession: string) {
  return profession.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "")
}

function toAnchor(key: string) {
  return key.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "")
}

function formatGroupName(key: string) {
  return key.replace(/([A-Z])/g, " $1").trim()
}

function median(values: number[]) {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function annualize(hourly: number) {
  return hourly * 2080
}

function formatCompact(value: number) {
  if (!value) return null
  return `$${Math.round(value / 1000).toLocaleString()}k`
}

async function getMedianPayByProfession() {
  const { data, error } = await supabase
    .from("submission")
    .select("base_rate, role (profession)")
    .eq("is_active", true)

  if (error || !data) return {}

  const rateMap = new Map<string, number[]>()

  for (const row of data as any[]) {
    const profession = row.role?.profession
    const rate = Number(row.base_rate)
    if (!profession || Number.isNaN(rate) || rate <= 0) continue

    if (!rateMap.has(profession)) rateMap.set(profession, [])
    rateMap.get(profession)!.push(rate)
  }

  const medians: Record<string, number | null> = {}
  for (const [profession, rates] of rateMap.entries()) {
    medians[profession] = annualize(median(rates))
  }

  return medians
}

export default async function Profession() {
  const totalProfessions = Object.values(professions).flat().length
  const medianPay = await getMedianPayByProfession()

  return (
    <main className="min-h-screen bg-[#F6F9FC] text-[#071633]">
      <section className="px-6 pb-16 pt-16 md:px-8 md:pb-20 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-start gap-5">
              <Image
                src={mascotImg}
                alt="MedComp mascot"
                className="hidden h-24 w-24 shrink-0 object-contain sm:block md:h-28 md:w-28"
                priority
              />

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0F766E]">
                  Search by Profession
                </p>

                <h1 className="mt-2 font-serif text-3xl font-normal tracking-[-0.03em] text-[#071633] sm:text-4xl md:text-5xl">
                  Pick your role to compare
                </h1>

                <p className="mt-3 max-w-2xl text-base leading-7 text-[#64748B]">
                  Don&apos;t see an exact match? Some hospitals have different names for roles,
                  so choose the role closest to your job description.
                </p>
              </div>
            </div>

            <Link
              href="/submit"
              className="inline-flex h-12 w-fit items-center justify-center rounded-full bg-[#071633] px-6 text-sm font-semibold text-white transition hover:bg-[#13284F]"
            >
              Share what you make
            </Link>
          </div>

          <p className="mt-6 text-sm text-[#64748B]">
            {totalProfessions} roles across {Object.keys(professions).length} specialty areas.
            Median pay is calculated from real, active submissions.
          </p>

          <div className="mt-8 grid gap-8 sm:mt-10 sm:gap-10 lg:grid-cols-[220px_1fr]">
            <nav className="hidden lg:block">
              <div className="sticky top-24 space-y-1">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
                  Jump to
                </p>
                {Object.keys(professions).map((group) => (
                  <a
                    key={group}
                    href={`#${toAnchor(group)}`}
                    className="block rounded-md px-2 py-1.5 text-sm font-medium text-[#64748B] transition hover:bg-white hover:text-[#071633]"
                  >
                    {formatGroupName(group)}
                  </a>
                ))}
              </div>
            </nav>

            <div className="space-y-10 sm:space-y-14">
              {Object.entries(professions).map(([group, members]) => (
                <div key={group} id={toAnchor(group)} className="scroll-mt-24">
                  <div className="flex items-baseline justify-between gap-4 border-b-2 border-[#071633] pb-3">
                    <h2 className="font-serif text-2xl font-medium tracking-[-0.02em] text-[#071633] sm:text-3xl">
                      {formatGroupName(group)}
                    </h2>
                    <span className="shrink-0 text-sm text-[#94A3B8]">
                      {(members as string[]).length} roles
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between px-1 pt-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
                      Role
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#94A3B8]">
                      Median Pay
                    </span>
                  </div>

                  <div className="mt-1 divide-y divide-[#E1E8EF]">
                    {(members as string[]).map((profession) => {
                      const yearly = medianPay[profession]
                      const compact = yearly ? formatCompact(yearly) : null

                      return (
                        <Link
                          key={profession}
                          href={`/profession/${toSlug(profession)}`}
                          className="group flex flex-nowrap items-center justify-between gap-4 px-1 py-4 transition hover:bg-white"
                        >
                          <span className="min-w-0 flex-1 truncate text-base font-medium text-[#071633]">
                            {profession}
                          </span>

                          <span className="flex shrink-0 items-center gap-3 whitespace-nowrap">
                            <span className="font-mono text-base tabular-nums text-[#64748B]">
                              {compact ?? "No data"}
                            </span>
                            <span className="text-[#94A3B8] transition group-hover:translate-x-0.5 group-hover:text-[#071633]">
                              →
                            </span>
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 border-t border-[#E1E8EF] pt-10 text-center">
            <h3 className="font-serif text-2xl font-normal tracking-[-0.03em] text-[#071633] sm:text-3xl md:text-4xl">
              Don&apos;t see your salary in here yet?
            </h3>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#64748B]">
              Every submission makes this more useful for everyone. It takes under two minutes,
              nothing identifies you, and you don&apos;t need an account.
            </p>

            <Link
              href="/submit"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#071633] px-8 text-sm font-semibold text-white transition hover:bg-[#13284F]"
            >
              Add your salary anonymously
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}