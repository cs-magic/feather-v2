import { useAppStore } from "@/store"
import { Joystick } from "react-joystick-component"
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick"

import { MainPlayerMaxX, MainPlayerMinX, MainPlayerSpeed } from "@/config/game"

export const JoystickController = () => {
  const { playerSpeed, setPlayerSpeed, playerX, setPlayerX } = useAppStore()

  const handleMove = (event: IJoystickUpdateEvent) => {
    setPlayerX(
      Math.max(
        MainPlayerMinX,
        Math.min(MainPlayerMaxX, playerX + (event.x ?? 0) * MainPlayerSpeed)
      )
    )
    console.log("moving: ", event)
  }

  const handleStop = (event: IJoystickUpdateEvent) => {
    console.log("stop: ", event)
  }

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
