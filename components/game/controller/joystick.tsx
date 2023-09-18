import { useEffect, useState } from "react"
import { useAppStore } from "@/store"
import { Joystick } from "react-joystick-component"
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick"

import { PlayerMaxX, PlayerMinX, PlayerSpeedMultiplier } from "@/config/game"
import useInterval from "@/hooks/interval"

export const JoystickController = () => {
  const [playerSpeed, setPlayerSpeed] = useState(0)
  const { playerX, setPlayerX } = useAppStore()

  const handleMove = (event: IJoystickUpdateEvent) => {
    setPlayerSpeed((x) => event.x ?? 0)
    // console.log("moving: ", event)
  }

  const handleStop = (event: IJoystickUpdateEvent) => {
    setPlayerSpeed(0)
    // console.log("stop: ", event)
  }

  useInterval(() => {
    if (playerSpeed) {
      setPlayerX(() => {
        let x = playerX
        x += playerSpeed * PlayerSpeedMultiplier
        x = Math.max(x, PlayerMinX)
        x = Math.min(x, PlayerMaxX)
        return x
      })
    }
  }, 20) // 50fps

  return (
    <Joystick
      size={100}
      sticky={false}
      stickSize={50}
      baseColor="#222"
      stickColor="#165E75"
      move={handleMove}
      stop={handleStop}
    ></Joystick>
  )
}
