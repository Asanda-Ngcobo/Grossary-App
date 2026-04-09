'use client'
import { useState, useEffect } from 'react'

export default function MoneySpent({ moneySpent }) {
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
    className="p-2 h-[15vh] w-full mx-auto justify-center items-center ">
            <p className="text-lg text-gray-900 font-bold text-left">Money Spent</p>
<h2 className="text-6xl md:text-6xl font-bold text-left text-[#1EC677]">
  {formatted}
</h2>

        
        </div>
  )
}
