import { AlertCircle } from "@deemlol/next-icons"
import Link from "next/link"

export default function ReportIssueButton() {
    return (
        <div className="flex items-center gap-2  py-2
        cursor-pointer  text-black">
            <Link href='/account/forms/reports'>
             <span className='flex gap-2'><AlertCircle/> Report Issue or Suggestion</span></Link>
           
        </div>
    )
}


