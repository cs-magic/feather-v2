"use client"

import { PropsWithChildren } from "react"

export default function GameLayout({ children }: PropsWithChildren) {
  return (
    <div
      suppressHydrationWarning
      className={
        "relative w-full h-full md:w-[720px] mx-auto flex flex-col border overflow-auto"
      }
    >
      {children}
    </div>
  )
}
