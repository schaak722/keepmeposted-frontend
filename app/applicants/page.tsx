import { Suspense } from "react"
import ApplicantsClient from "./applicants-client"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ApplicantsClient />
    </Suspense>
  )
}
