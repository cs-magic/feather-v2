"use client"

import { useEffect, useRef, useState } from "react"
import { IMsg, SocketEvent } from "@/ds/socket"
import { useAppStore } from "@/store"
import { useElementSize } from "@mantine/hooks"
import { Socket, io } from "socket.io-client"

import { FeatherRenderInterval } from "@/config/game"
import { SOCKET_IO_ENDPOINT } from "@/config/site"
import useInterval from "@/hooks/interval"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Feather } from "@/components/game/feather"
import { FeatherManager, toUserPos } from "@/components/game/feather-manager"
import DialogLayer from "@/app/room/layers/04-dialog.layer"
import Layer from "@/app/room/layers/Layer"

export default function RoomPage({
  params: { id: roomId },
}: {
  params: { id: string }
}) {
  const [connected, setConnected] = useState<boolean>(false)

  const [socket, setSocket] = useState<Socket>()

  const socketInitializer = async () => {
    const socket = io({
      path: SOCKET_IO_ENDPOINT,
    })

    socket.on("connect_error", (err) => {
      console.error(`connect_error`, err)
    })

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id)
      setConnected(true)
    })

    setSocket(socket)

    if (socket) return socket.disconnect
  }

  const sendMessage = (msg: IMsg) => {
    socket?.emit(SocketEvent.General, msg)
  }

  useEffect(() => void socketInitializer(), [])

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

  return (
    <>
      <Layer>
        <div className={"w-full h-full flex flex-col grow"}>
          <div className={"grow"} />
          <Separator orientation={"horizontal"} />
          <div className={"grow"} />
        </div>
      </Layer>

      <Layer>
        {featherManager.current.feathers
          .map((polarPos) => toUserPos(polarPos, k, n))
          .map((cartesianPos, index) => (
            <Feather key={index} pos={cartesianPos} />
          ))}
      </Layer>

      {/*<ControllersLayer/>*/}

      <Layer>
        <DialogLayer state={featherManager.current.state} />
      </Layer>
    </>
  )
}
