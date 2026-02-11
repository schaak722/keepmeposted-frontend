import { Suspense } from "react"
import JobsClient from "./jobs-client"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <JobsClient />
    </Suspense>
  )
}
