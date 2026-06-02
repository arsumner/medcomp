import { supabase } from '@/lib/supabase'
import { writeLimiter, getClientIp } from '@/lib/ratelimit'

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url)
    const place_id = searchParams.get('place_id')
    const name = searchParams.get('name')

    if (place_id) {
        const { data, error } = await supabase.from('hospital').select().eq('place_id', place_id)
        if (!error && data && data.length > 0) {
            return Response.json(data)
        }
    }

    if (name) {
        const { data, error } = await supabase.from('hospital').select().ilike('name', name)
        if (error) {
            return Response.json({ error: 'Something went wrong' }, { status: 500 })
        }
        return Response.json(data ?? [])
    }

    const { data, error } = await supabase.from('hospital').select()
    if (error) {
        return Response.json({ error: 'Something went wrong' }, { status: 500 })
    }
    return Response.json(data)
}



export async function POST(request: Request) {
  if (writeLimiter) {
    const { success } = await writeLimiter.limit(getClientIp(request))
    if (!success) {
      return Response.json({ error: 'Too many requests' }, { status: 429 })
    }
  }

  const body = await request.json()

  if (
    typeof body.name !== 'string' || !body.name.trim() || body.name.length > 200 ||
    typeof body.city !== 'string' || !body.city.trim() || body.city.length > 100 ||
    typeof body.state !== 'string' || !body.state.trim() || body.state.length > 100
  ) {
    return Response.json({ error: 'Invalid hospital data' }, { status: 400 })
  }

  const { data, error } = await supabase.from('hospital').insert([{
    name: body.name.trim(),
    city: body.city.trim(),
    state: body.state.trim(),
    place_id: typeof body.place_id === 'string' ? body.place_id.trim() || null: null
  }]).select()

  if (error) {
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
  return Response.json(data, { status: 201 })
}
