'use client'

import { useEffect, useState } from 'react'

export default function Greeting() {
  const [greeting, setGreeting] = useState('Hello')

  useEffect(() => {
    const hour = new Date().getHours()
    let timeOfDay

    switch (true) {
      case (hour < 12):
        timeOfDay = 'Good Morning'
        break
      case (hour >= 12 && hour < 17):
        timeOfDay = 'Good Day'
        break
      case (hour >= 17):
        timeOfDay = 'Good Evening'
        break
      default:
        timeOfDay = 'Hello'
    }

    setGreeting(timeOfDay)
  }, [])

  

  return (
    <span className=" font-bold text-[#8F8C8C] text-[14px]">
      {greeting}
    </span>
  )
}
