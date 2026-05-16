'use client'
import { useState, useEffect } from 'react'

export default function MoneySpent({ moneySpent, expand }) {
  const [formatted, setFormatted] = useState("0")

  useEffect(() => {
    setFormatted(
      new Intl.NumberFormat("en-ZA", 
        { style: "currency", currency: "ZAR" }).format(
        moneySpent || 0
      )
    )
  }, [moneySpent])

  return (
    <div 
    className="p-2 h-[10vh] w-full mx-auto justify-center items-center ">
            <p className="text-lg text-black font-bold text-left">Money Spent</p>
            {expand || <button className='text-xs
            bg-[#1EC677] text-gray-300 flex 
            justify-center items-center w-fit px-3 py-1
            rounded-2xl bg-[]'>Last 30 days</button>}
<h2 className="text-6xl md:text-6xl font-bold text-left text-black">
  {formatted}
</h2>

        
        </div>
  )
}
