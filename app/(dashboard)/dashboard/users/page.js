import { Suspense } from "react"
import UsersClient from "./usersClient"
import Loading from "./loading"

function page() {
  return (
    <Suspense fallback={<Loading/>}>
      <UsersClient/>
    </Suspense>
  )
}

export default page
