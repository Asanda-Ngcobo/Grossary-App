'use client'
import { Quicksand } from 'next/font/google';
import { useState, useEffect } from 'react'

const MoneyFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
});

export default function ListMoneySpent({ money_spent }) {
  const [formatted, setFormatted] = useState("0")

  useEffect(() => {
    setFormatted(
      new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(
        money_spent
      )
    )
  }, [money_spent])

  return (
   
        <div   >
              <p>Money Spent</p> <h1 className={`${MoneyFont.className}
           text-2xl text-amber-700`}>-{formatted}</h1></div>

        
  )
}
