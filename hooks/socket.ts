import { useEffect } from "react"
import { IFullMsg, IMsg, SocketEvent } from "@/ds/socket"

import { socket } from "@/lib/socket"

export interface Event {
  name: string

  handler(...args: any[]): any
}

export const defaultEvents: Event[] = [
  // { name: "connect", handler: console.log },
  { name: "connect_error", handler: console.error },
  { name: "disconnect", handler: console.log },
]

/**
 * ref: https://www.codeconcisely.com/posts/react-socket-io-hooks/
 */
export function useSocketEvents(events: Event[], extra: IMsg) {
  console.log("using socket events")
  const { roomId, userImage } = extra
  const allEvents: Event[] = [...defaultEvents, ...events]

  const cleanup = () => {
    console.log("disconnecting")
    socket.disconnect()

    for (const event of allEvents) {
      console.log("off handler of ", event.name)
      socket.off(event.name)
    }
  }

  const init = async () => {
    // 要先唤醒一下服务器
    await fetch("/api/socket")

    // no-op if the socket is already connected
    console.log("connecting")
    socket.connect()

    for (const event of allEvents) {
      console.log("on handler of ", event.name)
      socket.on(event.name, event.handler)
    }

    socket.on("connect", () => {
      // 客户端有可能都没有监听 UserJoinRoom，但是服务端我们要加，否则客户端容易bug
      socket.emit(SocketEvent.UserJoinRoom, {
        content: `user ${socket.id} joined room ${roomId}`,
        ...extra,
        socketId: socket.id,
      } as IFullMsg)
    })
  }

  useEffect(() => {
    void init()

    window.addEventListener("beforeunload", cleanup)

    return () => {
      // react不会自己清除，ref: https://stackoverflow.com/a/61310052/9422455
      window.removeEventListener("beforeunload", cleanup)
    }
  }, [])
}
