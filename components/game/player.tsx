import { useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

export interface IPlayer {
  pos: "top" | "bottom"
  blow: string
  x?: number
}

export const Player = ({ player }: { player: IPlayer }) => {
  const [playerState, setPlayerState] = useState(player.blow)

  return (
    <Image
      src={playerState}
      alt={"player"}
      width={120}
      height={360}
      className={cn(
        "absolute w-[20%]",
        player.pos === "top" ? "top-0" : "bottom-0"
      )}
      style={{
        left: player.x ?? 320,
      }}
    />
  )
}
