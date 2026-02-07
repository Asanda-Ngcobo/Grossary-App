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
    <div className="pb-2 ">
          <h2 className="md:text-4xl text-xl font-bold ">
            {formatted}{" "}
            <span className={`text-[10px] ${moneySaved > 0 ? 'text-[#ACF532]': 'text-amber-700'}`}>({savedPercentage}%)</span>
          </h2>
          <p className="text-sm font-bold text-gray-600 text-center">
            <span className='text-[#ACF532]'>Under</span>/<span className='
            text-amber-700'>Over</span> Budget
          </p>
        </div>
  )
}
