'use client'

import { use, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateItemPrice, getListItemById } from '@/app/_lib/actions'
import Link from 'next/link';
import { ChevronLeft } from '@deemlol/next-icons';
import { Lexend_Deca } from "next/font/google";
import Loading from './loading';

const ButtonFont = Lexend_Deca({ subsets: ["latin"], display: 'swap' });
export default function AddPricePage({ params }) {
   const unwrappedParams = use(params);
    const listId = unwrappedParams.listId;
    const itemId = unwrappedParams.itemId;
  
 
    //For activating the keyboard as  soon as the page is visited
const priceInputRef = useRef(null)



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
useEffect(() => {
  if (item && priceInputRef.current) {
    priceInputRef.current.focus()
  }
}, [item])

  if (!item) {
    return <div className="
    flex justify-center items-center"><Loading/></div>
  }

  return (
    <main>
      <form
        onSubmit={handleSubmit}
        className="py-2 px-4 rounded-md w-[90%] mt-[5%] ml-[5%] md:w-[40%] md:ml-[25%] grid grid-rows-2 gap-2 bg-[#041527] shadow-sm"
      >
         <button className="my-5 mx-[5%] bg-white rounded-full w-[50px] h-[50px] flex justify-center items-center"> 
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
  ref={priceInputRef}
  // type="number"
  step="0.01"
  name="price"
  inputMode="decimal"
  placeholder="e.g. 24,99"
  className="bg-white border-0 focus:outline-2 focus:outline-lime-400 text-black text-xl p-3 rounded-md w-full"
  value={price}
  onChange={(e) => {
    //allowing users to press the comma into keyboard but the comma changes to dot which is sql friendly
    const value = e.target.value.replace(',', '.')
    setPrice(value)
  }}
  required
/>


        <button
          type="submit"
   className={`${ButtonFont.className} bg-amber-700 min-w-[100px]
    h-[40px] rounded-[5px] text-gray-800 font-semibold hover:bg-amber-600`}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Price'}
        </button>
      </form>
    </main>
  )
}

