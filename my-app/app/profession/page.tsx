import Link from "next/link"

const professions = [
  "Registered Nurse", "Nurse Practicioner", "Physicians Assistant", "Respiratory Therapist", "CRNA", "Nurse Tech"
]

function toSlug(profession: string) {
  return profession.toLowerCase().replace(/\s+/g, "-")
}

export default async function Profession() {

  return (
    <main className="min-h-screen bg-[#0A0F1E]">
      <section className="px-8 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">
              Browse by Profession
            </h1>
            <p className="mt-2 text-[#9CA3AF] text-2xl">
              Explore salaries by license
            </p>
        <div className="flex flex-wrap justify-center gap-4 ont-bold text-white">
          {professions.map((profession) => (
            <Link
              key={profession}
              href={`/profession/${toSlug(profession)}`}
              className="font-bold text-white rounded-full border border-[#1F2937] bg-[#0D9488] px-5 py-3 text-sm 
              font-semibold text-white transition-all duration-200 hover:border-[#0D9488] hover:bg-[#111827] hover:shadow-lg hover:shadow-[#0D9488]/20">
              {profession}
            </Link>
          ))}
          </div>
          </div>
        </div>
      </section>
    </main>
  )
}