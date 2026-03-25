'use client'
import SubmitButton from "./SubmitButton"
import { addCard } from "@/app/_lib/actions"

export default function AddCardClient({ toggleForm }) {

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form 
        action={async (formData) => {
          await addCard(formData)
          toggleForm()
        }}
        className="w-full max-w-md bg-[#04284B] rounded-2xl p-6 shadow-md space-y-5"
      >
        <label className="text-lg font-medium text-white">Store Name</label>
        <input
          name="name"
          type="text"
          className="w-full rounded-xl bg-gray-200 px-4 py-3 text-lg text-black"
          required
        />

        <label className="text-2xl text-white">Card Number</label>
        <input
          name="card_number"
          type="text"
          inputMode="numeric"
          className="w-full rounded-xl bg-gray-200 px-4 py-3 text-lg text-black"
          required
        />

        <SubmitButton>Add Card</SubmitButton>
      </form>
    </div>
  )
}