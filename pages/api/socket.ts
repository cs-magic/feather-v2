import { Server as NetServer } from "http"
import { NextApiRequest } from "next"
import { IMsg, SocketEvent } from "@/ds/socket"
import { Server } from "socket.io"

import { NextApiResponseServerIO, SocketIOServer } from "@/types/socket"
import { SOCKET_IO_ENDPOINT } from "@/config/site"
import { GameRoom } from "@/lib/game"

export const config = {
  api: {
    bodyParser: false,
  },
}

const user2room: Record<string, string> = {}

const gameManager: Record<string, GameRoom> = {}

const getGame = (server: SocketIOServer, roomId: string) => {
  if (roomId in gameManager) return gameManager[roomId]
  return (gameManager[roomId] = new GameRoom(server, roomId))
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
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    })

    server.on("connection", (socket) => {
      const game = getGame(server, user2room[socket.id])

      socket.on(SocketEvent.UserJoinRoom, async (msg: IMsg) => {
        console.log(SocketEvent.UserJoinRoom, msg.userId)
        const { roomId, userId, userImage } = msg

        await socket.join(roomId) // 这里要等待！

        user2room[socket.id] = roomId

        // 自己是排除的，ref: https://socket.io/docs/v4/server-api/#sockettoroom
        socket.to(roomId).emit(SocketEvent.UserJoinRoom, msg)

        game.memberJoinRoom(msg)
      })

      socket.on("disconnecting", () => {
        console.log("rooms before disconnecting: ", socket.rooms) // the Set contains at least the socket ID
        // 遍历所有房间（不过这里没必要）: `socket.rooms.forEach((r) => {`
        game.memberLeaveRoom(socket.id)
      })

      socket.on(SocketEvent.UserLeaveRoom, () => {
        game.memberLeaveRoom(socket.id)
      })

      socket.on(SocketEvent.UserSwitchPreparation, async () => {
        game.memberSwitchPreparation(socket.id)
      })

      socket.on(SocketEvent.UserMove, async (x: number) => {
        game.memberMove(socket.id, x)
      })

      socket.on(SocketEvent.UserShoot, async (power: number) => {
        game.memberShoot(socket.id, power)
      })
    })

    // append SocketIO server to Next.js socket server response
    res.socket.server.io = server
  }

  res.end()
}
