import { Quicksand } from "next/font/google"
import Link from "next/link"

const LogoFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
})

export default function Page() {
  return (
    <main className="grid items-center">
           <div className=" py-6 px-4 rounded-md w-[90%] mt-[40%]
     ml-[5%] md:w-[40%] md:ml-[30%] md:mt-[5%] text-center bg-white shadow">
      <h1 className={`${LogoFont.className} text-[20px] font-semibold mb-2`}>
       Check your inbox to confirm your email.
      </h1>

      <h2 className="text-lg mb-4">We’ve sent you a confirmation link — once you verify your email address, 
        you’ll be able to sign in and access your account.</h2>

      
    </div>
    {/* <p className="flex justify-center mt-[10%] underline text-blue-600">  <Link href='/'> Go To Home Page</Link></p> */}
  
    </main>
 
  )
}
