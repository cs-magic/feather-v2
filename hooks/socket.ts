import { useEffect } from "react"
import { IRoomMsg, IUserMsg, SocketEvent } from "@/ds/socket"

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
export function useSocketEvents(
  events: Event[],
  extra: { roomId: string; image: string }
) {
  console.log("using socket events")
  const { roomId, image } = extra
  const allEvents: Event[] = [...defaultEvents, ...events]

  useEffect(() => {
    // no-op if the socket is already connected
    console.log("connecting")
    socket.connect()

    for (const event of allEvents) {
      console.log("on handler of ", event.name)
      socket.on(event.name, event.handler)
    }

    socket.on("connect", () => {
      if (roomId) {
        // 客户端有可能都没有监听 UserJoinRoom，但是服务端我们要加，否则客户端容易bug
        socket.emit(SocketEvent.UserJoinRoom, {
          roomId,
          content: `user ${socket.id} joined room ${roomId}`,
          id: socket.id,
          image,
        } as IRoomMsg & IUserMsg)
      }
    })

    return function () {
      console.log("disconnecting")
      socket.disconnect()

      for (const event of allEvents) {
        console.log("off handler of ", event.name)
        socket.off(event.name)
      }
    }
  }, [])
}
