import { useEffect, useState } from "react"
import Image from "next/image"
import { useAppStore } from "@/store"
import { useElementSize } from "@mantine/hooks"

import { cn } from "@/lib/utils"

export interface IPlayer {
  pos: "top" | "bottom"
  x: number

  blow: string
}

export const Player = ({ x, pos, blow }: IPlayer) => {
  const [playerState, setPlayerState] = useState(blow)
  const { ref, width, height } = useElementSize()
  const { viewPointWidth } = useAppStore()

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Image
      ref={ref}
      src={playerState}
      alt={"player"}
      width={120}
      height={360}
      className={cn("absolute w-[20%]", pos === "top" ? "top-0" : "bottom-0")}
      style={{
        left: x * viewPointWidth - width / 2,
      }}
    />
  )
}
