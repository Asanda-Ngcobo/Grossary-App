'use client'
import { useState, useEffect } from 'react'

export default function MoneySaved({ moneySaved, savedPercentage }) {
  const [formatted, setFormatted] = useState("0")

  useEffect(() => {
    setFormatted(
      new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(
        moneySaved || 0
      )
    )
  }, [moneySaved])

  return (
    <div className="pb-2 col-start-1 col-end-3 h-[120px] bg-[#04284B] grid justify-center items-center rounded-lg">
          <h2 className="text-4xl font-bold text-center">
            {formatted}{" "}
            <span className="text-sm text-gray-600">({savedPercentage}%)</span>
          </h2>
          <p className="text-sm text-gray-500 text-center">Money Saved</p>
        </div>
  )
}
