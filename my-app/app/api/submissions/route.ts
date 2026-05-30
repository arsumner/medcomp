import { supabase } from '@/lib/supabase'
import { submissionLimiter, getClientIp } from '@/lib/ratelimit'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const profession = searchParams.get('profession')
    const state = searchParams.get('state')
    const city = searchParams.get('city')
    const hospital = searchParams.get('hospital')
    const sort = searchParams.get('sort')

    let query = supabase.from('submission').select(`
        *, role (profession, title, license_type),
        hospital (name, city, state)`)

    if (profession) query = query.eq('role.profession', profession)
    if (city) query = query.eq('hospital.city', city)
    if (state) query = query.eq('hospital.state', state)
    if (hospital) query = query.eq('hospital.name', hospital)
    if (sort == 'asc') query = query.order('base_rate', { ascending: true })
    if (sort == 'desc') query = query.order('base_rate', { ascending: false })
    if (!sort) query = query.order('submitted_at', { ascending: false})

    const { data, error } = await query
    if (error) {
        return Response.json({ error: 'Something went wrong' }, { status: 500 })
    }
    return Response.json(data)
}

export async function POST(request: Request) {
  if (submissionLimiter) {
    const { success } = await submissionLimiter.limit(getClientIp(request))
    if (!success) {
      return Response.json({ error: 'Too many requests' }, { status: 429 })
    }
  }

  const body = await request.json()

  const validPayTypes = ['hourly_staff', 'salary', 'travel']
  const baseRate = Number(body.base_rate)
  const yearsExp = body.years_experience != null ? Number(body.years_experience) : null

  if (
    !validPayTypes.includes(body.pay_type) ||
    !Number.isFinite(baseRate) || baseRate <= 0 || baseRate > 2_000_000 ||
    typeof body.hospitalid !== 'string' || !body.hospitalid ||
    typeof body.roleid !== 'string' || !body.roleid ||
    (yearsExp !== null && (!Number.isInteger(yearsExp) || yearsExp < 0 || yearsExp > 60))
  ) {
    return Response.json({ error: 'Invalid submission data' }, { status: 400 })
  }

  const optionalRate = (val: unknown) => {
    if (val == null) return null
    const n = Number(val)
    return Number.isFinite(n) && n >= 0 && n <= 200 ? n : null
  }

  const { data, error } = await supabase.from('submission').insert([{
    pay_type: body.pay_type,
    base_rate: baseRate,
    hospitalid: body.hospitalid,
    roleid: body.roleid,
    years_experience: yearsExp,
    night_diff: optionalRate(body.night_diff),
    charge_diff: optionalRate(body.charge_diff),
    evening_diff: optionalRate(body.evening_diff),
    preceptor_pay: optionalRate(body.preceptor_pay),
    certification_pay: optionalRate(body.certification_pay),
    signon_bonus: body.signon_bonus != null ? Math.min(Math.max(Number(body.signon_bonus), 0), 500_000) || null : null,
  }]).select()

  if (error) {
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
  return Response.json(data)
}
