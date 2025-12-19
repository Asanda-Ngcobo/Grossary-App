'use client'

import {  useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateItemPrice, getListItemById } from '@/app/_lib/actions'
import Link from 'next/link';
import { ChevronLeft } from '@deemlol/next-icons';
import { Lexend_Deca } from "next/font/google";
import SpinnerMini from '@/app/(website)/_components/SpinnerMini';

const ButtonFont = Lexend_Deca({ subsets: ["latin"], display: 'swap' });

export default function AddPriceForm({ itemId, listId }) {

  
  const router = useRouter()
  const [price, setPrice] = useState('')
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch item details when component mounts
  useEffect(() => {
    const fetchItem = async () => {
      const fetchedItem = await getListItemById(itemId)
      setItem(fetchedItem)
    }

    fetchItem()
  }, [itemId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateItemPrice(itemId, parseFloat(price))
      router.push(`/account/forms/${listId}`)
    } catch (error) {
      alert('Failed to update price')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
     <form
        onSubmit={handleSubmit}
        className="py-2 px-4 rounded-md w-[90%] mt-[5%] ml-[5%] md:w-[40%] md:ml-[25%] grid grid-rows-2 gap-2 bg-[#041527] shadow-sm"
      >
         <button className="my-5 mx-[5%] bg-white active:bg-gray-600 rounded-full w-[50px] h-[50px] flex justify-center items-center"> 
                    <Link href={`/account/forms/${listId}`}><ChevronLeft color="black" size={40}/></Link> </button>
        <label className="text-white text-xl">Item Name</label>
        <input
          type="text"
          name="name"
          className="bg-white text-gray-400 text-xl p-3 rounded-md w-full"
          value={`${item.item_name} ${item.item_brand} ${item.item_volume_mass}${item.item_unit}`}
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
          placeholder='e.g. 29.99'
        />

        <button
          type="submit"
   className={`${ButtonFont.className}
    bg-amber-700 min-w-[100px] h-[40px]
     rounded-[5px] text-white font-semibold
      hover:bg-amber-600
      flex justify-center items-center`}
          disabled={loading}
        >
          {loading ? <SpinnerMini/> : 'Save Price'}
        </button>
      </form>
  );
}
