import { supabase } from '@/lib/supabase'

function toSlug(profession: string, department?: string) {
  const departmentShortcuts: Record<string, string> = {
    'PACU (Post-Anesthesia Care Unit)': 'pacu',
    'Operating Room (OR)': 'or',
    'Emergency Department (ED)': 'ed',
    'Intensive Care Unit (ICU)': 'icu',
    'Neonatal ICU (NICU)': 'nicu',
    'Pediatric ICU (PICU)': 'picu',
    'Cardiac ICU (CICU)': 'cicu',
    'Medical ICU (MICU)': 'micu',
    'Surgical ICU (SICU)': 'sicu',
    'Labor and Delivery': 'labor-and-delivery',
    'Med-Surg': 'med-surg',
    'Telemetry': 'telemetry',
    'Float Pool': 'float-pool',
    'Neuro ICU': 'neuro-icu',
  }

  const clean = (value: string) =>
    value
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/\+/g, 'plus')
      .replace(/[()]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const professionSlug = clean(profession)
  const departmentSlug = department
    ? departmentShortcuts[department] ?? clean(department)
    : ''

  return departmentSlug ? `${professionSlug}-${departmentSlug}` : professionSlug
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const profession = searchParams.get('profession')
  const department = searchParams.get('department')

  let query = supabase.from('role').select('*')

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

  const profession = body.profession
  const department = body.department
  const slug = toSlug(profession, department)

  const { data, error } = await supabase
    .from('role')
    .insert([
      {
        profession,
        department,
        license_type: body.license_type ?? null,
        slug,
      },
    ])
    .select()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data, { status: 201 })
}