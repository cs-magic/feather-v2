"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useAppStore } from "@/store"
import { useElementSize } from "@mantine/hooks"

import { FeatherRenderInterval } from "@/config/game"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { JoystickController } from "@/components/game/controller/joystick"
import { Shoot } from "@/components/game/controller/shoot"
import { Feather } from "@/components/game/feather"
import { FeatherManager, toUserPos } from "@/components/game/feather-manager"
import { MainPlayer } from "@/components/game/main-player"
import { Player } from "@/components/game/player"

export default function IndexPage() {
  const [tick, setTick] = useState(0)
  const [n, setN] = useState(2)
  const k = 0

  const featherManager = useRef(new FeatherManager(n))

  const { ref, width, height } = useElementSize()

  const { setViewPointWidth, setViewPointHeight, playerX } = useAppStore()

  useEffect(() => {
    setViewPointWidth(width)
    setViewPointHeight(height)
  }, [width, height])

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((tick) => tick + 1)
      if (featherManager.current.state === "stopped") {
        clearInterval(interval)
      }
    }, FeatherRenderInterval)

    return () => clearInterval(interval)
  }, [])

  // console.log({ tick })

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

      {featherManager.current.feathers
        .map((polarPos) => toUserPos(polarPos, k, n))
        .map((cartesianPos, index) => (
          <Feather key={index} pos={cartesianPos} />
        ))}

      <Player blow="/game/player/A/blow.png" pos="top" x={0.5} />

      <MainPlayer />

      <div className={"absolute left-8 bottom-8"}>
        <JoystickController />
      </div>

      <div className={"absolute right-8 bottom-8"}>
        <Shoot
          onPressing={(t) => {}}
          onFinish={(t) => {
            featherManager.current.feathers.forEach((feather) => {
              const { x, y } = toUserPos(feather, k, n)

              console.log({ playerX, t, x, y })
              if (y > 0.9 - t / 10) {
                if (Math.abs(playerX - x) < 0.1) {
                  feather.invert = true
                }
              }
            })
          }}
        />
      </div>
    </section>
  )
}
