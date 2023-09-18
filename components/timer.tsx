import React, { HTMLAttributes, PropsWithChildren, useState } from "react"

import { ShootInterval } from "@/config/game"

export type ITimer = {
  onPressing?: (t: number) => void
  onFinish?: (t: number) => void
} & PropsWithChildren &
  HTMLAttributes<HTMLDivElement>

/**
 * ref: https://stackoverflow.com/a/62637068/9422455
 */
export const Timer = ({ onPressing, onFinish, ...props }: ITimer) => {
  let timerIntervalRef = React.useRef(null as unknown as any)
  const [t, setT] = useState(0)

  const onPressingDown = (e: any) => {
    e.preventDefault()

    timerIntervalRef.current = setInterval(() => {
      setT((t) => {
        console.log({ t })
        const tt = t + ShootInterval
        onPressing && onPressing(tt)
        return tt
      })
    }, ShootInterval)
  }

  const onPressingUp = (e: any) => {
    e.preventDefault()
    clearInterval(timerIntervalRef.current)
    console.log("pressed: ", { t })
    onFinish && onFinish(t)
    setT(0)
  }

  return (
    <div
      onMouseDown={onPressingDown}
      onTouchStart={onPressingDown}
      onMouseUp={onPressingUp}
      onTouchEnd={onPressingUp}
      onMouseLeave={onPressingUp}
      {...props}
    />
  )
}
