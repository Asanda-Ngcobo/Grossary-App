'use client'

import { use, useEffect, useState } from 'react'
import { Lexend_Deca } from "next/font/google";


const ButtonFont = Lexend_Deca({ subsets: ["latin"], display: 'swap' });
export default function AddPricePage({ itemId, itemName, itemBrand, itemNumber, 
    itemUnit, listId }) {

  
  

  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
   

    try {
       updateItemPrice(itemId, parseFloat(price))
    
    } catch (error) {
      alert('Failed to update price')
      console.error(error)
    } 
  }



  return (
    <main>
      <form
        onSubmit={handleSubmit}
        className="py-2 px-4 rounded-md w-[90%] mt-[5%] ml-[5%] md:w-[40%] md:ml-[25%] grid grid-rows-2 gap-2 bg-[#041527] shadow-sm"
      >
       
        <label className="text-white text-xl">Item Name</label>
        <input
          type="text"
          name="name"
          className="bg-white text-gray-400 text-xl p-3 rounded-md w-full"
          value={`${itemName} ${itemBrand}
           ${itemNumber}${itemUnit}`}
          readOnly
        />

        <label className="text-white text-xl">Item Price</label>
        <input
          type="number"
          step="0.01"
          name="price"
          className="bg-white text-black text-xl p-3 rounded-md w-full"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <button
          type="submit"
   className={`${ButtonFont.className} bg-[#A2B06D] min-w-[100px] h-[40px] rounded-[5px] text-white font-semibold hover:bg-[#6f7a46]`}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Price'}
        </button>
      </form>
    </main>
  )
}

