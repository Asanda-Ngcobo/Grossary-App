import { ShieldOff, User } from "@deemlol/next-icons"
import Link from "next/link"

export default function Privacy() {
    return (
        <div className="flex items-center gap-2  py-2
        cursor-pointer  text-black">
            <Link href='/privacy-policy'>
             <span className='flex gap-2'><ShieldOff/> Privacy</span></Link>
           
        </div>
    )
}


