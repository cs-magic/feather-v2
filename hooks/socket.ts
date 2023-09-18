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
    socket.connect()

    for (const event of events) {
      socket.on(event.name, event.handler)
    }
    // no-op if the socket is already connected

    return function () {
      for (const event of events) {
        socket.off(event.name)
      }
      socket.disconnect()
    }
  }, [])
}
