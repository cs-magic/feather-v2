import { Server as NetServer } from "http"
import { NextApiRequest } from "next"
import { Server } from "socket.io"

import { NextApiResponseServerIO } from "@/types/socket"
import { SOCKET_IO_ENDPOINT } from "@/config/site"
import { handleSocket } from "@/lib/socket"

export const config = {
  api: {
    bodyParser: false,
  },
}

/**
 * 我们强制每个用户同一时间、只能在某一浏览器、在某一个对战室内，因此，可以构建 socket.id -> room.id 的哈希表
 * @param req
 * @param res
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (res.socket.server.io) {
    // console.log("Socket is already running")
  } else {
    console.log("initializing Socket.io server...")

    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any
    const server = new Server(httpServer, {
      path: SOCKET_IO_ENDPOINT,
      addTrailingSlash: false, // next13必加，巨坑，ref: https://github.com/vercel/next.js/issues/49334
    })

    handleSocket(server)

    // append SocketIO server to Next.js socket server response
    res.socket.server.io = server
  }

  res.end()
}
