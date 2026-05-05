import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-auto">
      <div className="mx-auto max-w-7xl px-8 py-16">

        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">

          <div className="col-span-2">
            <p className="text-white text-lg font-semibold mb-3">
              MedComp
            </p>
            <p className="text-sm leading-relaxed max-w-sm">
              Transparent, anonymous salary data for healthcare professionals across the United States.
            </p>
          </div>

          <div>
            <p className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
              Explore
            </p>
            <ul className="flex flex-col gap-3">
              <li><Link href="/profession" className="hover:text-white transition">Professions</Link></li>
              <li><Link href="/location" className="hover:text-white transition">Locations</Link></li>
              <li><Link href="/explore" className="hover:text-white transition">Explore data</Link></li>
              <li><Link href="/submit" className="hover:text-white transition">Submit salary</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
              Professions
            </p>
            <ul className="flex flex-col gap-3">
              <li><Link href="/profession/registered-nurse-rn" className="hover:text-white transition">Registered nurse</Link></li>
              <li><Link href="/profession/nurse-practitioner-np" className="hover:text-white transition">Nurse practitioner</Link></li>
              <li><Link href="/profession/physician-assistant-pa" className="hover:text-white transition">Physician assistant</Link></li>
              <li><Link href="/profession/certified-registered-nurse-anesthetist-crna" className="hover:text-white transition">CRNA</Link></li>
              <li><Link href="/profession/respiratory-therapist" className="hover:text-white transition">Respiratory therapist</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
              Company
            </p>
            <ul className="flex flex-col gap-3">
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} MedComp. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Built for healthcare professionals.
          </p>
        </div>

      </div>
    </footer>
  )
}