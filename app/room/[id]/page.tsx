"use client"

import { useEffect, useState } from "react"
import { IMsg, SocketEvent } from "@/ds/socket"
import { Socket, io } from "socket.io-client"

import { SOCKET_IO_ENDPOINT } from "@/config/site"
import { Button } from "@/components/ui/button"

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

  return (
    <div>
      <div>Room ID: {roomId}</div>

      <Button
        onClick={() => {
          sendMessage({ content: "test welcome" })
        }}
      >
        Hello World
      </Button>
    </div>
  )
}
