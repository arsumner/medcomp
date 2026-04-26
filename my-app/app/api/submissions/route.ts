import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const profession = searchParams.get('profession')
    const state = searchParams.get('state')
    const city = searchParams.get('city')
    const hospital = searchParams.get('hospital')
    const sort = searchParams.get('sort')

    let query = supabase.from('Submission').select(`
        *, Role (profession, title, license_type),
        Hospital (name, city, state)`)

    if (profession) query = query.eq('Role.profession', profession)
    if (city) query = query.eq('Hospital.city', city)
    if (state) query = query.eq('Hospital.state', state)
    if (hospital) query = query.eq('Hospital.name', hospital)
    if (sort == 'asc') query = query.order('base_rate', { ascending: true })
    if (sort == 'desc') query = query.order('base_rate', { ascending: false })
    if (!sort) query = query.order('submitted_at', { ascending: false})

    const { data, error } = await query
    if (error) {
        return Response.json( {error: error.message}, { status: 500 })
    }
    return Response.json(data)
}

export async function POST(request: Request) {
    const body = await request.json()
    const { data, error } = await supabase.from('Submission').insert([
        {
        pay_type: body.pay_type, night_diff: body.night_diff, charge_diff: body.charge_diff, 
        evening_diff: body.evening_diff, preceptor_pay: body.preceptor_pay, certification_pay: body.certification_pay,
        signon_bonus: body.signon_bonus, years_experience: body.years_experience, base_rate: body.base_rate,
        hospitalid: body.hospitalid, roleid: body.roleid
        }
    ]).select()
    
    if (error) {
        return Response.json( {error: error.message}, {status: 500})
    }
    return Response.json(data)
} 