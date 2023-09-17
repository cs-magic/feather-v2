import React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * ref: https://stackoverflow.com/a/62637068/9422455
 */
export const Shoot = () => {
  let counter = 0
  let timerinterval = React.useRef(null as unknown as any)

  const [ms, setMs] = React.useState(counter)

  const timer = (start: any) => {
    console.log("tick tock")
    console.log(start)
    if (start === true && counter >= 1) {
      timerinterval.current = setInterval(() => {
        console.log(counter)
        setMs(counter) //When I remove this, the infinite loop disappears.
        counter += 1
        //@ts-ignore
      }, [10])
    } else {
      setMs(0)
    }
  }

  const pressingDown = (e: any) => {
    console.log("start")
    e.preventDefault()
    counter = 1
    timer(true)
  }

  const notPressingDown = (e: any) => {
    console.log("stop")
    e.preventDefault()
    timer(false)
    console.log("pressed: ", { ms })
    setMs(0)
    clearInterval(timerinterval.current)
  }
  const n = 53

  return (
    <Button
      onMouseDown={pressingDown}
      onMouseUp={notPressingDown}
      onTouchStart={pressingDown}
      onTouchEnd={notPressingDown}
      className={cn(
        "w-16 h-16 rounded-full p-6 whitespace-nowrap  text-white transition-all"
        // "bg-cyan-800/30",
        // `hover:bg-cyan-800/${Math.min(Math.max(30, ms), 100)}`
      )}
      style={{
        background: `hsl(195,68%,${Math.min(Math.max(20, ms), 50)}%)`,
        scale: 1 + Math.min(0.3, Math.log(1 + ms) / 10),
      }}
    >
      蓄力
    </Button>
  )
}
