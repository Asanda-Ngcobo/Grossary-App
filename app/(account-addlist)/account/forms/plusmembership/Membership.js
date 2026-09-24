import { AlertCircle, CreditCard } from "@deemlol/next-icons"
import Link from "next/link"

export default function Membership() {
    return (
        <div className="flex items-center gap-2  py-2
        cursor-pointer  text-black">
            <Link href='/account/forms/plusmembership'>
             <span className='flex gap-2'><CreditCard/> 
             Manage Plus Membership</span></Link>
           
        </div>
    )
}


