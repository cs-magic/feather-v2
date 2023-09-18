import { useEffect, useState } from "react"
import { useAppStore } from "@/store"
import { useInterval } from "@mantine/hooks"
import { Joystick } from "react-joystick-component"
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick"

import {
  MainPlayerMaxX,
  MainPlayerMinX,
  MainPlayerSpeedMultiplier,
} from "@/config/game"

export const JoystickController = () => {
  const [playerSpeed, setPlayerSpeed] = useState(0)
  const { playerX, setPlayerX } = useAppStore()

  const handleMove = (event: IJoystickUpdateEvent) => {
    setPlayerSpeed((x) => event.x ?? 0)
    // console.log("moving: ", event)
  }

  const handleStop = (event: IJoystickUpdateEvent) => {
    setPlayerSpeed(0)
    console.log("stop: ", event)
  }

  const interval = useInterval(() => {
    console.log({ playerSpeed })
    setPlayerX(() => {
      let x = playerX
      // console.log({ x, playerSpeed })
      if (playerSpeed) {
        x += playerSpeed * MainPlayerSpeedMultiplier
        x = Math.max(x, MainPlayerMinX)
        x = Math.min(x, MainPlayerMaxX)
        // console.log({ playerSpeed, x })
      }
      return x
    })
  }, 20) // 50fps

  useEffect(() => {
    interval.start()
    return interval.stop
  }, [])

  // console.log({ playerSpeed, playerX })

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
