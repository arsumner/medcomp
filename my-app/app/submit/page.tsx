import Link from "next/link"
import SubmissionForm from '../components/submissionForm'

export default async function Submit() {

  return (
    <main className="min-h-screen bg-[#0A0F1E] px-8 py-20">
      <h1 className="text-white text-3xl font-bold text-center mb-10">
        Submit Your Salary
      </h1>
      <SubmissionForm />
    </main>
  )
}