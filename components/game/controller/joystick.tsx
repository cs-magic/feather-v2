import { useAppStore } from "@/store"
import { Joystick } from "react-joystick-component"
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick"

export const JoystickController = () => {
  const { speed, setSpeed } = useAppStore()

  const handleMove = (event: IJoystickUpdateEvent) => {
    setSpeed(event.x ?? 0)
    console.log("moving: ", event)
  }

  const handleStop = (event: IJoystickUpdateEvent) => {
    setSpeed(0)
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
