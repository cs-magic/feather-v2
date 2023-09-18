"use client"

import { useState } from "react"
import Image from "next/image"
import { range } from "lodash"

import { cn } from "@/lib/utils"

export interface IPlayer {
  life?: number
  blow: string
}

export const Player = ({ blow, life = 3 }: IPlayer) => {
  const [playerState, setPlayerState] = useState(blow)

  return (
    <div className={"relative w-full select-none"}>
      <Image
        src={playerState}
        alt={"player"}
        width={120}
        height={360}
        className={cn("w-full pointer-events-none")}
      />

      <div className={"absolute right-2 top-2 inline-flex items-center gap-1"}>
        {range(life).map((index) => (
          <div className={"rounded-full w-2 h-2 bg-green-500"} key={index} />
        ))}
      </div>
    </div>
  )
}
