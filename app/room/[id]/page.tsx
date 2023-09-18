"use client"

import { useEffect, useRef, useState } from "react"
import { IRoomMsg, SocketEvent } from "@/ds/socket"

import { FeatherRenderInterval } from "@/config/game"
import { socket } from "@/lib/socket"
import useInterval from "@/hooks/interval"
import { useSocketEvents } from "@/hooks/socket"
import { Feather } from "@/components/game/feather"
import { FeatherManager, toUserPos } from "@/components/game/feather-manager"
import GroundLayer from "@/app/room/layers/01-ground.layer"
import DialogLayer from "@/app/room/layers/04-dialog.layer"
import Layer from "@/app/room/layers/Layer"

export default function RoomPage({
  params: { id: roomId },
}: {
  params: { id: string }
}) {
  const [tick, setTick] = useState(0)
  const [n, setN] = useState(2)
  const k = 0

  const featherManager = useRef(new FeatherManager(n))

  useEffect(() => {
    featherManager.current.start()
  }, [])

  useInterval(() => {
    setTick((tick) => tick + 1)
  }, FeatherRenderInterval)

  useEffect(() => {
    console.log("socket connected: ", socket.connected)
    if (socket.connected) {
      void socket.emit(SocketEvent.UserJoinRoom, {
        roomId,
        content: `user ${socket.id} joined room ${roomId}`,
      } as IRoomMsg)
    }
  }, [socket.connected])

  return (
    <>
      <GroundLayer />

      <Layer>
        {featherManager.current.feathers
          .map((polarPos) => toUserPos(polarPos, k, n))
          .map((cartesianPos, index) => (
            <Feather key={index} pos={cartesianPos} />
          ))}
      </Layer>

      {/*<ControllersLayer/>*/}

      <DialogLayer state={featherManager.current.state} />
    </>
  )
}
