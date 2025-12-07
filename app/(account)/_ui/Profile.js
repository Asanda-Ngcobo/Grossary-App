import { User } from "@deemlol/next-icons"
import Link from "next/link"

export default function Profile() {
    return (
        <div className="flex items-center gap-2  py-2
        cursor-pointer  text-black">
            <Link href='/account/forms/profile'>
             <p className='flex gap-2'><User/> Personal Info</p></Link>
           
        </div>
    )
}


