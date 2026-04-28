import Link from "next/link"
import { professions } from "../data/professions"

function toSlug(profession: string) {
  return profession.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "")
}

function formatGroupName(key: string) {
  return key.replace(/([A-Z])/g, " $1").trim()
}

export default async function Profession() {
  return (
    <main className="min-h-screen bg-[#F9FAFB]">

      {/* Header */}
      <section className="bg-[#0A0F1E] px-8 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-widest text-[#0D9488] font-semibold mb-3">
            Salary Transparency
          </p>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
            Browse by Profession
          </h1>
          <p className="text-[#9CA3AF] text-base max-w-lg">
            Select your profession to explore salary data and compensation trends across the U.S.
          </p>
        </div>
      </section>

      {/* Groups */}
      <section className="px-8 py-16">
        <div className="mx-auto max-w-5xl flex flex-col gap-6">
          {Object.entries(professions).map(([group, members]) => (
            <div key={group} className="flex rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB]">

              {/* Left — Group Label */}
              <div className="w-48 flex-shrink-0 bg-[#F3F4F6] flex items-center justify-center px-6 py-8">
                <h2 className="text-[#0A0F1E] font-semibold text-sm text-center leading-snug">
                  {formatGroupName(group)}
                </h2>
              </div>

              {/* Right — Profession Links */}
              <div className="flex-1 bg-white px-8 py-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                  {(members as string[]).map((profession) => (
                    <Link
                      key={profession}
                      href={`/profession/${toSlug(profession)}`}
                      className="text-[#374151] text-sm hover:text-[#0D9488] transition-colors duration-200"
                    >
                      {profession}
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

    </main>
  )
}