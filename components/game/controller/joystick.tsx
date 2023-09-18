import { useAppStore } from "@/store"
import { Joystick } from "react-joystick-component"
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick"

import {
  MainPlayerMaxX,
  MainPlayerMinX,
  MainPlayerSpeedMultiplier,
} from "@/config/game"
import useInterval from "@/hooks/interval"

export const JoystickController = () => {
  const { playerSpeed, setPlayerSpeed, playerX, setPlayerX } = useAppStore()

  const handleMove = (event: IJoystickUpdateEvent) => {
    setPlayerSpeed(event.x ?? 0)
    console.log("moving: ", event)
  }

  const handleStop = (event: IJoystickUpdateEvent) => {
    setPlayerSpeed(0)
    console.log("stop: ", event)
  }

  useInterval(() => {
    if (playerSpeed) {
      let x = playerX + playerSpeed * MainPlayerSpeedMultiplier
      x = Math.max(x, MainPlayerMinX)
      x = Math.min(x, MainPlayerMaxX)
      console.log({ playerSpeed, x })
      setPlayerX(x)
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
