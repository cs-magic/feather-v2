"use client"

import { animated, useSpring } from "@react-spring/web"
import { useDrag } from "@use-gesture/react"

import { cn } from "@/lib/utils"
import { Player } from "@/components/game/player"

export const MainPlayer = () => {
  // todo: zustand persist with ssr, see: https://github.com/pmndrs/zustand/issues/938
  // 每一局都会重开，所以这里不需要从store中读取位置
  const left = 200
  const side: "top" | "bottom" = "bottom"
  const [style, api] = useSpring(
    () => ({
      left: left, //playerX ?? viewPointWidth * 0.5,
      [side]: 0,
    }),
    []
  )

  const bind = useDrag(({ active, offset: [mx, my] }) => {
    api.start({ left: left + mx })
  }, {})

  return (
    <animated.div
      {...bind()}
      style={style}
      className={cn("absolute -translate-x-1/2 select-none", "w-[20%]")}
    >
      <Player blow="/game/player/B/blow.png" />
    </animated.div>
  )
}
