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
  const [style, api] = useSpring(
    () => ({
      [xkey]: left, //playerX ?? viewPointWidth * 0.5,
    }),
    []
  )

  const { ref, width } = useElementSize()

  const bind = useDrag(({ active, offset: [mx, my] }) => {
    const pw = width >> 1
    console.log({ left, mx, viewPointWidth })
    api.start({
      [xkey]: limitRange(left + mx, { l: pw, r: viewPointWidth - pw }),
    })
  }, {})

  const [t, setT] = useState(0)

  const onFinish = (t: number) => {
    setT(0)
  }

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
          onFinish={setT}
          onPressing={setT}
          style={{
            /* offset-x | offset-y | [ blur-radius | spread-radius | ] color */
            boxShadow: `0px -${t}px ${t}px 0px rgba(200, 20, 20, 70%)`,
            scale: 1 - Math.min(t, 300) / 500,
          }}
        >
          <Player blow="/game/player/B/blow.png" />
        </Timer>
      </animated.div>
    </div>
  )
}
