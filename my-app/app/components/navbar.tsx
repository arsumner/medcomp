import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="w-full bg-[#0A0F1E] border-b border-[#1F2937] px-8 py-4                  
      flex items-center justify-between">

      <span className="text-white text-xl font-bold tracking-widest uppercase
        bg-gradient-to-r from-[#0D9488] to-white bg-clip-text text-transparent">
        MedComp
      </span>
      

      <div className="flex items-center gap-8">

        <Link href="/profession" className="text-[#9CA3AF] hover:text-[#0D9488] 
          transition-colors duration-200 text-sm font-medium tracking-wide uppercase">
          Professions
        </Link>

        <Link href="/state" className="text-[#9CA3AF] hover:text-[#0D9488] 
          transition-colors duration-200 text-sm font-medium tracking-wide uppercase">
          Search by State
        </Link>

        <Link href="/explore" className="text-[#9CA3AF] hover:text-[#0D9488] transition-colors duration-200
          text-sm font-medium tracking-wide uppercase">
          Explore
        </Link>

      </div>


      <Link href="/submit" className="bg-[#0D9488] hover:bg-[#0F766E] text-white 
        px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200 tracking-wide">
        Submit Your Salary
      </Link>
    </nav>
  )
}
