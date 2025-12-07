'use client'
import { Quicksand } from 'next/font/google';
import { useState, useEffect } from 'react'

const MoneyFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
});

export default function ListMoneyLeft({ money_left }) {
  const [formatted, setFormatted] = useState("0")

  useEffect(() => {
    setFormatted(
      new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(
        money_left
      )
    )
  }, [money_left])

  return (
   
        <div   >
              <p>Money Left</p> <h1 className={`${MoneyFont.className}
           text-2xl text-[#ACF532]`}>{formatted}</h1></div>

        
  )
}
