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
    <div className="pb-2 col-start-1 col-end-3 h-[80px] grid justify-center items-center rounded-lg">
          <h2 className="md:text-4xl text-2xl font-bold text-center">
            {formatted}{" "}
            <span className="text-xs text-gray-600">({savedPercentage}%)</span>
          </h2>
          <p className="text-sm font-bold text-gray-600 text-center">Money Saved</p>
        </div>
  )
}
