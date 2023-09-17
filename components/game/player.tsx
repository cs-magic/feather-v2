import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {cn} from "@/lib/utils";



export interface PlayerActions {
  pos: "top" | "bottom"
  blow: string
  x?: number
}

export const Player = ({player}: { player: PlayerActions }) => {
  const [playerState, setPlayerState] = useState(player.blow)

  return (
    <Image src={playerState} alt={'player'} width={120} height={360} className={cn(
      'absolute w-[20%]',
      player.pos === "top" ? "top-0" : "bottom-0"
    )} style={{
      left: player.x ?? 320
    }}/>
  )
}

export default function useInterval(cb: () => void, delay: number) {
  const ref = useRef<any>()

  useEffect(() => {
    ref.current = cb
  })

  useEffect(() => {
    if (delay < 0) {
      return
    }
    const timer = setInterval(() => ref.current(), delay)
    return () => {
      clearInterval(timer)
    }
  }, [delay])
}
