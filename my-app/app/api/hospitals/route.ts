import { supabase } from '@/lib/supabase';

export async function GET() {
    const { data, error } = await supabase.from('Hospital').select()

    if (error) {
        return Response.json({ error: error.message}, { status: 500})
    }

    return Response.json(data)
}


export async function POST(request: Request) {
    const body = await request.json()
    const { data, error } = await supabase.from('Hospital').insert([
        { name: body.name, city: body.city, state: body.state }
    ]).select()

    if (error) {
        return Response.json( {error: error.message}, {status: 500})
    }
    return Response.json(data, { status: 201})
}