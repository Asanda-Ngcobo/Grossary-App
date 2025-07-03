import { Trash2 } from "@deemlol/next-icons"
import Link from "next/link"

function DeleteAccount() {
    return (
        <div className="flex items-center gap-2  py-2
        cursor-pointer  text-white">
            <Link href='/account/forms/delete-account'> <span className='flex gap-2'><Trash2/> Delete Account</span></Link>
           
        </div>
    )
}

export default DeleteAccount
