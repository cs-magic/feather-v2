"use client"

import { PropsWithChildren, useEffect } from "react"
import { useAppStore } from "@/store"
import { useElementSize } from "@mantine/hooks"

import { Separator } from "@/components/ui/separator"
import { MainPlayer } from "@/components/game/main-player"
import { Player } from "@/components/game/player"

export default function GameLayout({ children }: PropsWithChildren) {
  const { ref, width, height } = useElementSize()

  const { setViewPointWidth, setViewPointHeight, playerX } = useAppStore()

  useEffect(() => {
    setViewPointWidth(width)
    setViewPointHeight(height)
  }, [width, height])

  return (
    <div
      className={
        "relative w-full h-full md:w-[720px] mx-auto flex flex-col border overflow-auto"
      }
    >
      <div className={"absolute inset-0 w-full h-full flex flex-col"}>
        <div className={"ml-[50%] w-[20%] -translate-x-1/2"}>
          <Player blow="/game/player/A/blow.png" />
        </div>
        <Separator orientation={"horizontal"} />

        <div className={"grow relative"} ref={ref}>
          {children}
        </div>

        <Separator orientation={"horizontal"} />
        <MainPlayer />
      </div>
    </div>
  )
}
