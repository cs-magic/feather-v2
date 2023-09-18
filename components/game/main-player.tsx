"use client"

import { useState } from "react"
import { useAppStore } from "@/store"
import { useElementSize } from "@mantine/hooks"
import { animated, useSpring } from "@react-spring/web"
import { useDrag } from "@use-gesture/react"

import { limitRange } from "@/lib/range"
import { cn } from "@/lib/utils"
import { Player } from "@/components/game/player"
import { Timer } from "@/components/timer"

export const MainPlayer = () => {
  const { viewPointWidth } = useAppStore()
  const xkey = "marginLeft"
  const left = viewPointWidth >> 1
  const [style, api] = useSpring(() => ({ [xkey]: left }), [])
  const [isMoving, setMoving] = useState(false)
  const [t, setT] = useState(0)

  const { ref, width } = useElementSize()

  const bind = useDrag(({ active, movement: [mx, my], offset: [ox, oy] }) => {
    if (!active) {
      setMoving(false)
    }
    if (active && Math.abs(mx) > 10) {
      setMoving(true)
    }
    const pw = width >> 1
    console.log({ active, left, mx: ox, viewPointWidth })
    api.start({
      [xkey]: limitRange(left + ox, { l: pw, r: viewPointWidth - pw }),
    })
  }, {})

  const onFinish = (t: number) => {
    setT(0)
  }
  const pressedT = isMoving ? 0 : t

  return (
    <div className={"w-full relative"}>
      <animated.div
        ref={ref}
        {...bind()}
        style={{
          ...style,
        }}
        className={cn(" -translate-x-1/2 select-none touch-none w-[20%] z-50")}
        suppressHydrationWarning // ref: https://nextjs.org/docs/messages/react-hydration-error#solution-3-using-suppresshydrationwarning
      >
        <Timer
          onFinish={onFinish}
          onPressing={setT}
          style={{
            /* offset-x | offset-y | [ blur-radius | spread-radius | ] color */
            boxShadow: `0px -${pressedT}px ${pressedT}px ${pressedT}px rgba(200, 20, 20, 70%)`,
            scale: 1 - Math.min(pressedT, 300) / 500,
          }}
        >
          <Player blow="/game/player/B/blow.png" />
        </Timer>
      </animated.div>
    </div>
  )
}
