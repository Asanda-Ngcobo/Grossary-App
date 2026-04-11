'use client'

import { createList } from "@/app/_lib/actions"
import SubmitButton from "./SubmitButton"

export default function AddListForm() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        action={createList}
        className="
          w-full max-w-md
          bg-[#e7eeea]
          rounded-2xl
          p-6
          shadow-md
          space-y-5
        "
      >
        <div className="space-y-2">
          <label
            htmlFor="list_name"
            className="text-lg font-medium text-black"
          >
            List Name
          </label>
          <input
            id="list_name"
            name="list_name"
            type="text"
            
            required
            className="
              w-full
              bg-[#e7eeea]
              px-4 py-3
              text-2xl
              font-extrabold
              text-black
              border-b
              outline-none
              
            "
          />
        </div>

        {/* <div className="space-y-2">
          <label
            htmlFor="list_budget"
            className="text-lg font-medium text-white"
          >
            Budget (R)
          </label>
          <input
            id="list_budget"
            name="list_budget"
            type="number"
            inputMode="numeric"
            placeholder="e.g. 1000"
            required
            className="
              w-full
              rounded-xl
              bg-gray-200
              px-4 py-3
              text-lg
              text-black
              outline-none
              focus:ring-2 focus:ring-lime-400
            "
          />
        </div> */}

        <SubmitButton>Create List</SubmitButton>
      </form>
    </div>
  )
}
