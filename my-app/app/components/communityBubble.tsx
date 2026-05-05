import Link from 'next/link'

export default function CommunityBubble() {
  return (
    <div className="flex-shrink-0 max-w-sm w-full">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_#0f172a06_1px,_transparent_1px),linear-gradient(to_bottom,_#0f172a06_1px,_transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10">
          <p className="text-sm font-semibold text-slate-950 mb-1">
            Help build salary transparency
          </p>

          <p className="text-sm leading-relaxed text-slate-600 mb-5">
            Share your pay anonymously so other healthcare professionals can make more informed career decisions.
          </p>

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1 text-xs text-slate-500">
              <span>Anonymous</span>
              <span>Takes about 2 minutes</span>
            </div>

            <Link
              href="/submit"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Submit salary
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}