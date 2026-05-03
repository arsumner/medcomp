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

      <section className="bg-[#0A0F1E] px-8 py-16">
        <div className="relative bg-[#0A0F1E] px-8 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0D948820_0%,_transparent_70%)] pointer-events-none" />
          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="inline-flex items-center gap-2 bg-[#0D9488]/10 border border-[#0D9488]/30 text-[#0D9488] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse" />
              Salary Transparency
            </div>
            <h1 className="text-5xl font-bold text-white tracking-tight mb-4">
              Browse by Profession
            </h1>
            <p className="text-[#9CA3AF] text-lg max-w-lg leading-relaxed">
              Select your profession to explore real compensation data and trends across the U.S.
            </p>
          </div>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="mx-auto max-w-5xl flex flex-col gap-6">
          {Object.entries(professions).map(([group, members]) => (
            <div key={group} className="flex rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB]">

              <div className="w-48 flex-shrink-0 bg-[#F3F4F6] flex items-center justify-center px-6 py-8">
                <h2 className="text-[#0A0F1E] font-semibold text-sm text-center leading-snug">
                  {formatGroupName(group)}
                </h2>
              </div>

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