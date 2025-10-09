'use client'

import { ChevronLeft } from "@deemlol/next-icons"
import Link from "next/link"
import { Lexend_Deca, Quicksand } from "next/font/google"
import { useState, useTransition } from "react"
import DeleteAccountForm from "./DeleteAccountForm"
import AccountModal from "@/app/(account)/_ui/AccountModal"
import { useRouter } from "next/navigation"
import { handleDeleteAccount } from "@/app/_lib/actions"

const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
})
const LogoFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
})

const reasons = [
  "It didn’t save me time or money",
  "I don’t shop with a list anymore",
  "I found another app I prefer",
  "I didn’t find it useful",
  "Too many bugs or issues",
  "Too complicated to use",
  "Not enough features",
  "I was just testing it",
  "Other",
]

function DeleteAccountClient() {
  const [reason, setReason] = useState('')
  const [otherReason, setOtherReason] = useState('')
 
  const [isOpenModal, setIsOpenModal] = useState(false)
   const [isPending, startTransition] = useTransition()

    const router = useRouter()

  const submit = () => {
    const feedback = reason === 'Other' ? otherReason : reason

    startTransition(async () => {
      try {
        await handleDeleteAccount(feedback)
        router.push('/auth/account-deleted')
      } catch (err) {
        alert('Something went wrong.')
      }
    })
  }
  return (
    <main>
    

      <section className="flex gap-20 mx-[5%] my-5">
        <div className="bg-white active:bg-gray-600 rounded-full w-[50px] h-[50px] flex justify-center items-center"> 
          <Link href='/account/profile'><ChevronLeft color="black" size={40} /></Link>
        </div>
        <h1 className={`${LogoFont.className} text-[18px] font-semibold`}>Delete Account</h1>
      </section>

      <h2 className="text-xl font-bold text-center">Why are you deleting your account?</h2>

      <div className="py-2 px-4 rounded-md w-[90%] mt-[5%] ml-[5%] md:w-[40%] md:ml-[25%] bg-[#04284B] shadow-sm">
        <form className="text-lg py-5 text-white">
          {reasons.map((r, i) => (
            <label key={i} className="block cursor-pointer py-3">
              <input
                type="radio"
                name="reason"
                value={r}
                checked={reason === r}
                onChange={() => setReason(r)}
                className="mr-2"
              />
              {r}
            </label>
          ))}

          {reason === 'Other' && (
            <textarea
              className="w-full border p-2 mt-2 text-black"
              rows={3}
              placeholder="Please tell us more..."
              onChange={(e) => setOtherReason(e.target.value)}
              value={otherReason}
            />
          )}
        </form>
      </div>

      {reason && (
        <button className={`${ButtonFont.className} bg-[#A2B06D]
          w-[60%] mx-[20%] mt-10
          lg:w-[60%] lg:ml-[20%]
          h-[50px] rounded-[10px]
          text-white font-semibold
          hover:bg-[#6f7a46]`} onClick={()=> setIsOpenModal((show)=> !show)}>
          Continue
        </button>
      )}
      {isOpenModal && <AccountModal onClose={()=> setIsOpenModal(false)}>
        <DeleteAccountForm 
        onDelete={submit}
        isPending={isPending}
        /></AccountModal> }
    </main>
  )
}

export default DeleteAccountClient
