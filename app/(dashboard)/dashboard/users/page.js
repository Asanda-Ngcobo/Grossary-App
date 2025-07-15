import { Suspense } from "react"
import UsersClient from "./usersClient"

function page() {
  return (
    <Suspense>
      <UsersClient/>
    </Suspense>
  )
}

export default page
