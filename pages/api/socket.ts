import { Server as NetServer } from "http"
import { NextApiRequest } from "next"
import { IBaseMsg, IMsg, IRoomMsg, IUserMsg, SocketEvent } from "@/ds/socket"
import { IPlayer } from "@/ds/user"
import { Server } from "socket.io"

import { NextApiResponseServerIO, SocketIOServer } from "@/types/socket"
import { SOCKET_IO_ENDPOINT } from "@/config/site"
import { GameRoom } from "@/lib/game"

export const config = {
  api: {
    bodyParser: false,
  },
}

const gameManager: Record<string, GameRoom> = {}
const getRoom = (server: SocketIOServer, roomId: string) => {
  if (roomId in gameManager) return gameManager[roomId]
  return (gameManager[roomId] = new GameRoom(server, roomId))
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
    const server = new Server(httpServer, {
      path: SOCKET_IO_ENDPOINT,
      addTrailingSlash: false, // ref: https://github.com/vercel/next.js/issues/49334
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    })

    server.on("connection", (socket) => {
      socket.on("disconnecting", () => {
        console.log("rooms before disconnecting: ", socket.rooms) // the Set contains at least the socket ID
        socket.rooms.forEach((r) => {
          if (r in gameManager) {
            gameManager[r].memberLeave()
          }
        })
      })

      socket.on(SocketEvent.UserJoinRoom, async (msg: IMsg) => {
        console.log(SocketEvent.UserJoinRoom, msg.userId)
        const { roomId, userId, image } = msg
        await socket.join(roomId) // 这里要等待！
        // 自己是排除的，ref: https://socket.io/docs/v4/server-api/#sockettoroom
        socket.to(roomId).emit(SocketEvent.UserJoinRoom, msg)

        getRoom(server, roomId).memberJoin({ userId, image })
      })

      socket.on(SocketEvent.UserLeaveRoom, (msg: IMsg) => {
        getRoom(server, msg.roomId).memberLeave(msg.userId)
      })

      socket.on(SocketEvent.UserPrepared, async (msg: IMsg) => {
        getRoom(server, msg.roomId).memberPrepare(msg.userId)
      })

      socket.on(SocketEvent.UserUnPrepare, async (msg: IMsg) => {
        getRoom(server, msg.roomId).memberUnPrepare(msg.userId)
      })
    })

    // append SocketIO server to Next.js socket server response
    res.socket.server.io = server
  }

  res.end()
}
