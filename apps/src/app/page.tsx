'use client'
import React, { useEffect, useState } from 'react'

export default function Home() {
  const [count, setCount] = useState(3)

  useEffect(() => {
    setTimeout(() => {
      if(count <= 0) {
        location.replace('/cash-entry')
        return null
      } else {
        setCount(count - 1)
      }
    }, 1000)
  }, [count])
  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly p-24 bg-slate-400">
      <div>
        <strong>Hello there, to access the app, you can open the link belows :</strong>
        <a href="http://localhost:3000/cash-entry" className="text-green-800">
          <p>http://localhost:3000/cash-entry</p>
        </a>
      </div>
      <div>
        <p className="underline">
          <strong>Automatically redirect to page Cash Entry in : {count}s</strong>
        </p>
      </div>
    </main>
  )
}
