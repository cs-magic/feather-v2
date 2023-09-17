import React from "react"

import { ShootInterval, ShootStep } from "@/config/game"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * ref: https://stackoverflow.com/a/62637068/9422455
 */
export const Shoot = ({
  onPressing,
  onFinish,
}: {
  onPressing?: (t: number) => void
  onFinish?: (t: number) => void
}) => {
  let timerIntervalRef = React.useRef(null as unknown as any)

  const [t, setT] = React.useState(0)

  const timer = (start: any) => {
    if (start === true) {
      timerIntervalRef.current = setInterval(() => {
        setT((t) => {
          const newT = Math.min(t + ShootStep, 1)
          onPressing && onPressing(newT)
          return newT
        })
        //@ts-ignore
      }, [ShootInterval])
    } else {
      setT(0)
    }
  }

  const onPressingDown = (e: any) => {
    e.preventDefault()
    timer(true)
  }

  const onPressingUp = (e: any) => {
    e.preventDefault()
    timer(false)
    console.log("pressed: ", { ms: t })
    setT(0)
    clearInterval(timerIntervalRef.current)

    onFinish && onFinish(t)
  }

  return (
    <Button
      onMouseDown={onPressingDown}
      onTouchStart={onPressingDown}
      onMouseUp={onPressingUp}
      onTouchEnd={onPressingUp}
      className={cn(
        "w-16 h-16 rounded-full p-6 whitespace-nowrap  text-white transition-all"
      )}
      style={{
        background: t === 1 ? "darkred" : `hsl(195,68%,${20 + t * 30}%)`,
        scale: 1 + Math.min(0.3, Math.log(1 + t)),
      }}
    >
      蓄力
    </Button>
  )
}
