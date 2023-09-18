"use client"

import { useAppStore } from "@/store"
import { useElementSize } from "@mantine/hooks"
import { animated, useSpring } from "@react-spring/web"
import { useDrag } from "@use-gesture/react"

import { limitRange } from "@/lib/range"
import { cn } from "@/lib/utils"
import { Player } from "@/components/game/player"

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

  return (
    <div className={"w-full relative"}>
      <animated.div
        ref={ref}
        {...bind()}
        style={style}
        className={cn(" -translate-x-1/2 select-none touch-none w-[20%] z-50")}
        suppressHydrationWarning // ref: https://nextjs.org/docs/messages/react-hydration-error#solution-3-using-suppresshydrationwarning
      >
        <Player blow="/game/player/B/blow.png" />
      </animated.div>
    </div>
  )
}
