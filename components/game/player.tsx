"use client"

import { forwardRef, useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

export interface IPlayer {
  blow: string
}

export const Player = forwardRef<HTMLDivElement, IPlayer>(({ blow }, ref) => {
  const [playerState, setPlayerState] = useState(blow)

  return (
    <Image
      src={playerState}
      alt={"player"}
      width={120}
      height={360}
      className={cn("w-full pointer-events-none")}
    />
  )
})
Player.displayName = "Player"
