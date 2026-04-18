import { supabase } from '@/lib/supabase'

export async function GET() {
    const { data, error } = await supabase.from('Role').select('*')

    if (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(data)
}

export async function getRole() : Promise<any[]> {
    const { data, error } = await supabase.from('role').select()
    if (error) {
        console.error(error.message)
    }
    return data ?? []
}