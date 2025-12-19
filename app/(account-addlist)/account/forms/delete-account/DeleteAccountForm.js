'use client'
import SpinnerMini from "@/app/(website)/_components/SpinnerMini"
import { AlertTriangle } from "@deemlol/next-icons"
import { Lexend_Deca } from "next/font/google";
import Link from "next/link";


const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

function DeleteAccountForm({onDelete, isPending}) {
       
     
    return (
        <div className=" w-[90%] mx-auto mt-[50%] min-h-[40%] md:mt-[20%] md:w-[50%]
     md-[25%]
      bg-[#04284B] text-white rounded-2xl z-10  shadow-2xl p-6">
        <div className="flex justify-center">  <AlertTriangle color="red" width={50} height={50} className="text-center "/></div>
          
            <h1 className="text-xl text-center font-extrabold">Are You Sure?</h1>
            <h3 className="text-sm text-gray-500 text-center">You want to permanently delete your account.</h3>
            <p className="text-sm text-center font-extralight">If you continue with your account deletion, you will lose all your data including 
                  <span className="font-bold"> lists, 
                 average money spent, average groceries price increase over time, etc.</span></p>
                   {/* Buttons */}
  <div className={`${ButtonFont.className} 
  flex justify-between gap-6 mt-11 mx-4 `}>
    <button
     onClick={onDelete}
      className="min-h-10 w-auto px-2 rounded-lg cursor-pointer
       border bg-transparent
       text-gray-400 border-[#041527]  font-semibold 
       hover:opacity-70 transition-all
       active:bg-[#A2B06D]"
    >
      {isPending ? 'Deleting...' : 'Delete Account'}
    </button>
    <button
     
      className="min-h-10 w-auto px-2 active:bg-gray-600  bg-amber-700
        cursor-pointer  rounded-lg text-[#04284B]
      font-semibold hover:bg-amber-600 transition-colors"
    >
        <Link href='/account/profile'>  Keep Account</Link>
    
    </button>
    
  </div>
        </div>
    )
}

export default DeleteAccountForm
