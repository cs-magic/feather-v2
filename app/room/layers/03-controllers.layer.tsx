import { useAppStore } from "@/store"

import { JoystickController } from "@/components/game/controller/joystick"
import { Shoot } from "@/components/game/controller/shoot"
import { toUserPos } from "@/components/game/feather-manager"

export default function ControllersLayer() {
  const { playerX } = useAppStore()
  return (
    <>
      <div className={"left-8 bottom-8 hidden"}>
        <JoystickController />
      </div>

      <div className={"right-8 bottom-8 hidden"}>
        <Shoot
          onPressing={(t) => {}}
          onFinish={(t) => {
            featherManager.current.feathers.forEach((feather) => {
              const { x, y } = toUserPos(feather, k, n)

              if (y > 0.9 - t / 10) {
                if (Math.abs(playerX - x) < 0.1) {
                  feather.invert = true
                }
              }
            })
          }}
        />
      </div>
    </>
  )
}
