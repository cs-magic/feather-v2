import { Server as NetServer } from "http"
import { NextApiRequest } from "next"
import { IFullMsg, IMsg, SocketEvent } from "@/ds/socket"
import { Server } from "socket.io"

import { NextApiResponseServerIO, SocketIOServer } from "@/types/socket"
import { SOCKET_IO_ENDPOINT } from "@/config/site"
import { Game } from "@/lib/game"

export const config = {
  api: {
    bodyParser: false,
  },
}

const user2room: Record<string, string> = {}

const gameManager: Record<string, Game> = {}

const getGameFromSocket = (server: SocketIOServer, roomId: string) => {
  if (roomId in gameManager) return gameManager[roomId]
  return (gameManager[roomId] = new Game(server, roomId))
}

export const socketHandlers: { name: string; handler: keyof Game }[] = [
  { name: "disconnecting", handler: "memberLeaveRoom" },
  { name: SocketEvent.UserLeaveRoom, handler: "memberLeaveRoom" },
  { name: SocketEvent.UserPrepare, handler: "memberPrepare" },
  { name: SocketEvent.UserMove, handler: "memberMove" },
  { name: SocketEvent.UserShoot, handler: "memberShoot" },
]

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

    server.on("connection", (socket) => {
      const g = () => getGameFromSocket(server, user2room[socket.id])

      socket.on(SocketEvent.UserJoinRoom, async (msg: IFullMsg) => {
        const { roomId } = msg

        // const fullMsg: IFullMsg = { ...msg, socketId: socket.id }
        console.log(
          SocketEvent.UserJoinRoom,
          { msg },
          { connected: socket.connected }
        )

        if (!socket.connected || user2room[socket.id]) return // 可能是HMR搞的鬼

        user2room[socket.id] = roomId // 初始化

        await socket.join(roomId) // 这里要等待！

        // 自己是排除的，ref: https://socket.io/docs/v4/server-api/#sockettoroom
        socket.to(roomId).emit(SocketEvent.UserJoinRoom, msg)

        g().memberJoinRoom(msg)
      })

      // note: 为了能让代码减少冗余，我们使用了 eval 函数；另一种也可行但没这个简短的办法是用 bind；除此之外都会出现 this undefined的问题
      socketHandlers.forEach(({ name, handler }) => {
        socket.on(name, (...args: any[]) => {
          // console.log("handler: ", { name, sid: socket.id, args })
          eval(`g().${handler}("${socket.id}", ...args)`)
        })
      })
    })

    // append SocketIO server to Next.js socket server response
    res.socket.server.io = server
  }

  res.end()
}
