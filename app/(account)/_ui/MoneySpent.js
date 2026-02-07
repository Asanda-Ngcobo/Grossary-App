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
    className="pb-2 ">
          
<h2 className="text-2xl md:text-4xl font-bold text-center">
  {formatted}
</h2>

          <p className="text-sm text-gray-600 font-bold text-center">Money Spent</p>
        </div>
  )
}
