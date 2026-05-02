import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url)
    const name = searchParams.get('name')
    let query = supabase.from('hospital').select()
    if (name) {
        query = query.eq('name', name)
    }
    const { data, error } = await query

    if (error) {
        return Response.json({ error: error.message}, { status: 500})
    }

    return Response.json(data)
}


export async function POST(request: Request) {
    const body = await request.json()
    const { data, error } = await supabase.from('hospital').insert([
        { name: body.name, city: body.city, state: body.state }
    ]).select()

    if (error) {
        return Response.json( {error: error.message}, {status: 500})
    }
    return Response.json(data, { status: 201})
}