import { Quicksand } from "next/font/google"



const LogoFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
})

export const metadata = {
  title: "Sign Up Success | Grossary",
  description: "Grossary - a simple, all-in-one grocery app that helps you",
};

export default function Page() {
  return (
    <main className="grid items-center">
           <div className=" py-6 px-4 rounded-md w-[90%] mt-[40%]
     ml-[5%] md:w-[40%] md:ml-[30%] md:mt-[5%] text-center bg-white shadow">
      <h1 className={`${LogoFont.className} text-[20px] font-semibold mb-2`}>
       Check your inbox to confirm your email.
      </h1>

      <h2 className="text-lg mb-4">Supabase Auth have sent you a confirmation link. Click the confirmation link to verify your email address, 
        then you can sign in to access your account.</h2>

      
    </div>
    {/* <p className="flex justify-center mt-[10%] underline text-blue-600">  <Link href='/'> Go To Home Page</Link></p> */}
  
    </main>
 
  )
}
