'use client'
import { Quicksand } from 'next/font/google';
import { useState, useEffect } from 'react'

const MoneyFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
});

export default function Budget({ list_budget }) {
  const [formatted, setFormatted] = useState("0")

  useEffect(() => {
    setFormatted(
      new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(
        list_budget
      )
    )
  }, [list_budget])

  return (
   
         <h5 className="text-center">Budget: {formatted}</h5>

        
  )
}
