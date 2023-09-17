import { useEffect, useState } from "react"
import { useAppStore } from "@/store"
import { useElementSize } from "@mantine/hooks"

import {
  MainPlayerDefaultSpeed,
  MainPlayerMaxX,
  MainPlayerMinX,
} from "@/config/game"
import useInterval from "@/hooks/interval"
import { Player } from "@/components/game/player"

export const MainPlayer = () => {
  const [playerX, setPlayerX] = useState(0)
  const { speed, viewPointWidth } = useAppStore()

  const { ref, width, height } = useElementSize()

  useEffect(() => {
    setPlayerX(viewPointWidth >> 1)
  }, [viewPointWidth])

  useInterval(() => {
    console.log(speed, playerX)
    if (speed > 0 && playerX < viewPointWidth * MainPlayerMaxX) {
      setPlayerX(playerX + speed * MainPlayerDefaultSpeed)
    } else if (speed < 0 && playerX > viewPointWidth * MainPlayerMinX) {
      setPlayerX(playerX + speed * MainPlayerDefaultSpeed)
    }
  }, 20) // 20ms, 50FPS

  return (
    <Player
      ref={ref}
      player={{
        blow: "/game/player/B/blow.png",
        pos: "bottom",
        x: playerX - width / 2,
      }}
    />
  )
}
