import { HTMLAttributes, forwardRef, useEffect, useState } from "react"
import Image from "next/image"
import { useAppStore } from "@/store"
import { useElementSize } from "@mantine/hooks"

import { cn } from "@/lib/utils"

export interface IPlayer {
  blow: string
}

export const Player = forwardRef<HTMLDivElement, IPlayer>(({ blow }, ref) => {
  const [playerState, setPlayerState] = useState(blow)
  const { ref: refImage, width, height } = useElementSize()

  return (
    <div ref={ref} className={"w-full"}>
      <Image
        ref={refImage}
        src={playerState}
        alt={"player"}
        width={120}
        height={360}
        className={cn("w-full pointer-events-none")}
      />
    </div>
  )
})
Player.displayName = "Player"
