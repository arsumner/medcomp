import { supabase } from '@/lib/supabase'
import StateClient from '../../components/locations/stateClient'

export const dynamic = 'force-dynamic'

function formatState(slug: string) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

async function getStateData(slug: string) {
  const state = formatState(slug)

  const { data, error } = await supabase
    .from('submission')
    .select(`
      *,
      role (profession, department),
      hospital!inner (name, city, state)
    `)
    .eq('hospital.state', state)
    .eq('is_active', true)
    .order('submitted_at', { ascending: false })

  if (error || !data) {
    return { submissions: [], state }
  }

  return { submissions: data, state }
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { submissions, state } = await getStateData(slug)

  return <StateClient submissions={submissions} state={state} />
}