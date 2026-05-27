import Link from "next/link"
import SubmissionForm from '../components/forms/submissionForm'

export default async function Submit() {

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-8 py-20">
      <SubmissionForm />
    </main>
  )
}