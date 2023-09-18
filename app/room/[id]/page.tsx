"use client"

import { useEffect, useRef, useState } from "react"
import { IMsg, IRoomMsg, SocketEvent } from "@/ds/socket"
import { toast } from "react-toastify"
import { Socket, connect, io } from "socket.io-client"

// import { toast } from "sonner"

import { FeatherRenderInterval } from "@/config/game"
import { SOCKET_IO_ENDPOINT } from "@/config/site"
import useInterval from "@/hooks/interval"
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
  const [connected, setConnected] = useState<boolean>(false)

  const [socket, setSocket] = useState<Socket>()

  const socketInitializer = async () => {
    const socket = connect({
      path: SOCKET_IO_ENDPOINT,
    })

    socket.on("connect_error", (err) => {
      console.error(`connect_error`, err)
    })

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id)
      setConnected(true)

      console.log("joining room ...")
      socket.emit(SocketEvent.UserJoinRoom, {
        roomId,
        content: `user ${socket.id} joined room`,
      } as IRoomMsg)
    })

    socket.on(SocketEvent.UserJoinRoom, (msg: IRoomMsg) => {
      console.log("someone joined room: ", msg.content)
      toast(msg.content)
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
