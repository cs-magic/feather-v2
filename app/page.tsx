"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useElementSize } from "@mantine/hooks"
import { Joystick } from "react-joystick-component"
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick"

import { FeatherRenderInterval } from "@/config/game"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FeatherManager } from "@/components/game/feather-manager"
import { Player } from "@/components/game/player"

export default function IndexPage() {
  const [tick, setTick] = useState(0)
  const [nPlayers, setNPlayers] = useState(2)
  const k = 0

  const featherManager = useRef(new FeatherManager())

  const { ref, width, height } = useElementSize()

  const handleMove = (event: IJoystickUpdateEvent) => {
    console.log("moving: ", event)
  }

  const handleStop = (event: IJoystickUpdateEvent) => {
    console.log("stop: ", event)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((tick) => tick + 1)
      if (featherManager.current.state === "stopped") {
        clearInterval(interval)
      }
    }, FeatherRenderInterval)

    return () => clearInterval(interval)
  }, [])

  console.log({ tick })

  return (
    <section className="relative w-full h-full" ref={ref}>
      {featherManager.current.state === "stopped" && (
        <div
          className={
            "absolute inset-0 w-full h-full | flex items-center justify-center flex-col | z-50"
          }
        >
          <div className={"w-[80%]"}>
            <Alert className={"bg-cyan-800"}>
              <AlertTitle>恭喜，你胜利了！✌🏻</AlertTitle>
              <AlertDescription>本局战况：</AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      {featherManager.current.toUser(k).map((feather, index) => (
        <Image
          key={index}
          src={"/game/feather/feather.png"}
          alt={"element"}
          className={"absolute"}
          width={120}
          height={60}
          style={{
            left: width * feather.x,
            top: height * feather.y,
          }}
        />
      ))}

      <Player player={{ blow: "/game/player/A/blow.png", pos: "top" }} />

      <Player player={{ blow: "/game/player/B/blow.png", pos: "bottom" }} />

      <div
        className={"absolute left-8 bottom-8 flex items-center justify-center"}
      >
        <Joystick
          size={100}
          sticky={true}
          baseColor="gray"
          stickColor="blue"
          move={handleMove}
          stop={handleStop}
        ></Joystick>
      </div>

      <div
        className={
          "absolute right-8 bottom-8 w-16 h-16 | rounded-full shrink-0 | flex items-center justify-center | bg-cyan-800 p-6 whitespace-nowrap"
        }
      >
        蓄力
      </div>
    </section>
  )
}
