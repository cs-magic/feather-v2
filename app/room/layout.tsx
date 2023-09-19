"use client"

import { PropsWithChildren, useEffect } from "react"

export default function GameLayout({ children }: PropsWithChildren) {
  /**
   * set height for mobile browser (safari, chrome ...) to be full of inner height (but invalid !)
   */
  useEffect(() => {
    const setInnerHeight = () => {
      console.log("add setInnerHeight")
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
      )
    }
    window.addEventListener("resize", setInnerHeight)

    setInnerHeight()
    return () => {
      console.log("remove setInnerHeight")
      window.removeEventListener("resize", setInnerHeight)
    }
  }, [])

  return (
    <div
      className={
        "relative w-full h-full md:w-[720px] mx-auto flex flex-col border overflow-hidden"
      }
    >
      {children}
    </div>
  )
}
