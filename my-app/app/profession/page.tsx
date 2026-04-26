import Link from "next/link"

const professions = [
  "Registered Nurse (RN)",
  "Licensed Practical Nurse (LPN)",
  "Licensed Vocational Nurse (LVN)",
  "Certified Nursing Assistant (CNA)",
  "Nurse Practitioner (NP)",
  "Family Nurse Practitioner (FNP)",
  "Acute Care Nurse Practitioner (ACNP)",
  "Psychiatric Mental Health Nurse Practitioner (PMHNP)",
  "Clinical Nurse Specialist (CNS)",
  "Certified Registered Nurse Anesthetist (CRNA)",
  "Certified Nurse Midwife (CNM)",
  "Physician Assistant (PA)",
  "Respiratory Therapist",
  "Respiratory Therapy Technician",
  "Physical Therapist",
  "Physical Therapist Assistant",
  "Occupational Therapist",
  "Occupational Therapy Assistant",
  "Speech Language Pathologist",
  "Radiologic Technologist",
  "CT Technologist",
  "MRI Technologist",
  "Ultrasound Technologist",
  "Nuclear Medicine Technologist",
  "Surgical Technologist",
  "Anesthesia Technician",
  "EKG Technician",
  "EEG Technician",
  "Monitor Technician",
  "Phlebotomist",
  "Patient Care Technician (PCT)",
  "Unit Clerk",
  "Medical Assistant",
  "Sterile Processing Technician",
  "Medical Laboratory Scientist",
  "Medical Laboratory Technician",
  "Pathology Assistant",
  "Blood Bank Technologist",
  "Clinical Pharmacist",
  "Hospital Pharmacist",
  "Pharmacy Technician",
  "Behavioral Health Technician",
  "Psychiatric Technician",
  "Clinical Social Worker",
  "Mental Health Counselor",
  "Substance Abuse Counselor",
  "Clinical Informatics Specialist",
  "Nursing Informatics Specialist",
  "Epic Analyst",
  "EHR Analyst",
  "Medical Coder",
  "Medical Biller",
  "Revenue Cycle Analyst",
  "Case Manager",
  "Care Coordinator",
  "Quality Improvement Specialist",
  "Infection Preventionist",
  "Healthcare Administrator",
  "Nurse Manager",
  "Clinical Director",
]



function toSlug(profession: string) {
  return profession.toLowerCase().replace(/\s+/g, "-")
}

export default async function Profession() {

  return (
    <main className="min-h-screen bg-[#0A0F1E]">
      <section className="px-8 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">
              Browse by Profession
            </h1>
            <p className="mt-2 text-[#9CA3AF] text-2xl">
              Explore salaries by license
            </p>
        <div className="flex flex-wrap justify-center gap-4 ont-bold text-white">
          {professions.map((profession) => (
            <Link
              key={profession}
              href={`/profession/${toSlug(profession)}`}
              className="font-bold text-white rounded-full border border-[#1F2937] bg-[#0D9488] px-5 py-3 text-sm 
              font-semibold text-white transition-all duration-200 hover:border-[#0D9488] hover:bg-[#111827] hover:shadow-lg hover:shadow-[#0D9488]/20">
              {profession}
            </Link>
          ))}
          </div>
          </div>
        </div>
      </section>
    </main>
  )
}