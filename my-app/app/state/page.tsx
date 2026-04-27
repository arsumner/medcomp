import Link from "next/link"
import { states } from "../data/states"

function toSlug(state: string) {
  return state.toLowerCase().replace(/\s+/g, "-")
}

export default async function State() {

  return (
    <main className="min-h-screen bg-[#0A0F1E]">
      <section className="px-8 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">
              Browse Salaries by State
            </h1>
            <p className="mt-2 text-[#9CA3AF] text-2xl">
              Explore salaries across the country
            </p>
        <div className="flex flex-wrap justify-center gap-4 ont-bold text-white">
          {states.map((state) => (
            <Link
              key={state}
              href={`/state/${toSlug(state)}`}
              className="font-bold text-white rounded-full border border-[#1F2937] bg-[#0D9488] px-5 py-3 text-sm 
              font-semibold text-white transition-all duration-200 hover:border-[#0D9488] hover:bg-[#111827] hover:shadow-lg hover:shadow-[#0D9488]/20">
              {state}
            </Link>
          ))}
          </div>
          </div>
        </div>
      </section>
    </main>
  )
}