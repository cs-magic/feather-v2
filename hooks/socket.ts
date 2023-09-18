import { useEffect } from "react"

import { socket } from "@/lib/socket"

export interface Event {
  name: string

  handler(...args: any[]): any
}

export const defaultEvents: Event[] = [
  { name: "connect", handler: console.log },
  { name: "connect_error", handler: console.error },
  { name: "disconnect", handler: console.log },
]

/**
 * ref: https://www.codeconcisely.com/posts/react-socket-io-hooks/
 * @param _events
 */
export function useSocketEvents(_events: Event[]) {
  console.log("using socket events")
  const events: Event[] = [...defaultEvents, ..._events]

  useEffect(() => {
    // no-op if the socket is already connected
    console.log("connecting")
    socket.connect()

    for (const event of events) {
      console.log("on handler of ", event.name)
      socket.on(event.name, event.handler)
    }

    return function () {
      for (const event of events) {
        console.log("off handler of ", event.name)
        socket.off(event.name)
      }
      console.log("disconnecting")
      socket.disconnect()
    }
  }, [])
}
