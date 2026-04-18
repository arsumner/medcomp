import { supabase } from '@/lib/supabase';

export async function GET() {
    const { data, error } = await supabase.from('Submission').select('*')
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