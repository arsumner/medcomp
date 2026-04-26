import Link from "next/link"

const cities = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
  "Austin, TX",
  "Jacksonville, FL",
  "Fort Worth, TX",
  "Columbus, OH",
  "Charlotte, NC",
  "San Francisco, CA",
  "Indianapolis, IN",
  "Seattle, WA",
  "Denver, CO",
  "Washington, DC",
  "Boston, MA",
  "El Paso, TX",
  "Nashville, TN",
  "Detroit, MI",
  "Oklahoma City, OK",
  "Portland, OR",
  "Las Vegas, NV",
  "Memphis, TN",
  "Louisville, KY",
  "Baltimore, MD",
  "Milwaukee, WI",
  "Albuquerque, NM",
  "Tucson, AZ",
  "Fresno, CA",
  "Sacramento, CA",
  "Kansas City, MO",
  "Atlanta, GA",
  "Miami, FL",
  "Orlando, FL",
  "Tampa, FL",
  "Virginia Beach, VA",
  "Minneapolis, MN",
  "New Orleans, LA",
  "Cleveland, OH",
  "Anaheim, CA",
  "Honolulu, HI",
  "Raleigh, NC",
  "Pittsburgh, PA",
  "Cincinnati, OH",
  "St. Louis, MO",
  "Salt Lake City, UT",
  "Boise, ID",
  "Madison, WI",
  "Buffalo, NY",
  "Jersey City, NJ",
  "Newark, NJ",
  "Richmond, VA",
  "Charleston, SC",
  "Savannah, GA",
  "Anchorage, AK",
]

function toSlug(city: string) {
  return city.toLowerCase().replace(/\s+/g, "-")
}

export default async function City() {

  return (
    <main className="min-h-screen bg-[#0A0F1E]">
      <section className="px-8 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">
              Browse Salaries by City
            </h1>
            <p className="mt-2 text-[#9CA3AF] text-2xl">
              Explore salaries across the country
            </p>
        <div className="flex flex-wrap justify-center gap-4 ont-bold text-white">
          {cities.map((city) => (
            <Link
              key={city}
              href={`/city/${toSlug(city)}`}
              className="font-bold text-white rounded-full border border-[#1F2937] bg-[#0D9488] px-5 py-3 text-sm 
              font-semibold text-white transition-all duration-200 hover:border-[#0D9488] hover:bg-[#111827] hover:shadow-lg hover:shadow-[#0D9488]/20">
              {city}
            </Link>
          ))}
          </div>
          </div>
        </div>
      </section>
    </main>
  )
}
