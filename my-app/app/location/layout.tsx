import type { ReactNode } from 'react'

export default function LocationsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export const dynamic = 'force-dynamic'