import { supabase } from '../../../lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const profession = searchParams.get('profession')
    const department = searchParams.get('department')

    let query = supabase.from('Role').select('*')

    if (profession) {
        query = query.eq('profession', profession)
    }

    if (department) {
        query = query.eq('department', department)
    }

    const { data, error } = await query

    if (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(data)
}

export async function POST(request: Request) {
    const body = await request.json()
    const { data, error } = await supabase.from('Role').insert([
        { profession: body.profession, department: body.department }
    ]).select()

    if (error) {
        return Response.json( {error: error.message}, {status: 500})
    }
    return Response.json(data, { status: 201})
}