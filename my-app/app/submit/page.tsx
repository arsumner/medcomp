import Link from "next/link"
import SubmissionForm from '../components/forms/submissionForm'

export default async function Submit() {

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-8 py-20">
      <h1 className="text-[#0A0F1E] text-3xl font-bold text-center mb-10">
        Submit Your Salary
      </h1>
      <div className="max-w-2xl mx-auto mb-10 px-5 py-4 border border-[#E5E7EB] rounded-2xl bg-white shadow-sm text-center">
        <p className="text-[#6B7280] text-m leading-relaxed">
          We need your help to grow our database. Submissions are anonymous and take less than two minutes to complete. The more submissions we receive
          the more accurate our data becomes, helping everyone to find and negotiate better pay.
        </p>
      </div>
      <SubmissionForm />
    </main>
  )
}