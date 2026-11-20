import { AlertCircle, CreditCard, Edit2 } from "@deemlol/next-icons"
import Link from "next/link"

export default function EditName() {
    return (
        <div className="flex items-center gap-2  py-2
        cursor-pointer  text-black">
            <Link href='/account/forms/edit-profile'>
             <span className='flex gap-2'><Edit2/> 
             Edit Name</span></Link>
           
        </div>
    )
}


