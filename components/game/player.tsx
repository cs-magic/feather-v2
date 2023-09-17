import {useState} from "react";
import Image from "next/image";
import {cn} from "@/lib/utils";



export interface PlayerActions {
  pos: "top" | "bottom"
  blow: string
}

export const Player = ({player}: { player: PlayerActions }) => {
  const [playerState, setPlayerState] = useState(player.blow)

  return (
    <Image src={playerState} alt={'player'} width={120} height={360} className={cn(
      'absolute w-[20%]',
      player.pos === "top" ? "top-0" : "bottom-0"
    )} style={{
      left: 320
    }}/>
  )
}
