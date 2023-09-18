import { Server as NetServer } from "http"
import { NextApiRequest } from "next"
import { IMsg, SocketEvent } from "@/ds/socket"
import { Server } from "socket.io"

import { NextApiResponseServerIO } from "@/types/socket"
import { SOCKET_IO_ENDPOINT } from "@/config/site"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (res.socket.server.io) {
    // console.log("Socket is already running")
  } else {
    console.log("New Socket.io server...")
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any
    const io = new Server(httpServer, {
      path: SOCKET_IO_ENDPOINT,
      addTrailingSlash: false, // ref: https://github.com/vercel/next.js/issues/49334
    })

    io.on("connection", (socket) => {
      console.log("onConnection")
      socket.on(SocketEvent.General, (msg: IMsg) => {
        console.log(`received general msg: ${JSON.stringify(msg)}`)
      })

      socket.on(SocketEvent.UserJoinRoom, (msg: IMsg) => {
        socket.broadcast.emit(SocketEvent.UserJoinRoom, msg)
      })
    })

    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io
  }

  res.end()
}
