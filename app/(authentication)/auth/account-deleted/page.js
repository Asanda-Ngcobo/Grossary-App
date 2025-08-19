import { Quicksand } from "next/font/google"
import Link from "next/link"

const LogoFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
})

// Calculate the date 30 days from today
const deletionDate = new Date()
deletionDate.setDate(deletionDate.getDate() + 30)
const formattedDate = deletionDate.toLocaleDateString('en-ZA', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export default function Page() {
  return (
    <main className="grid items-center">
           <div className="py-6 px-4 rounded-md w-[90%] mt-[5%]
     ml-[5%] md:w-[40%] md:ml-[30%] text-center bg-white shadow">
      <h1 className={`${LogoFont.className} text-[20px] font-semibold mb-2`}>
        Account Deleted
      </h1>

      <h2 className="text-lg mb-4">We’re sorry to see you go.</h2>

      <section className="space-y-4 text-[16px] text-gray-800">
        <p className="text-lg font-semibold">Your account has been deactivated.</p>
        <p>
          Your data will be retained until <span className="font-bold">{formattedDate}</span>.
        </p>
        <p>
          You can reactivate your account and restore your data any time before this date.
        </p>
        <p>
          After that, your data will be <span className="font-bold text-red-600">permanently deleted</span> and cannot be recovered.
        </p>
      </section>
    </div>
    <p className="flex justify-center mt-[10%] underline text-blue-600">  <Link href='/'> Go To Home Page</Link></p>
  
    </main>
 
  )
}
