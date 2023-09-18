import { Server as NetServer } from "http"
import { NextApiRequest } from "next"
import { IMsg, IRoomMsg, IUserMsg, SocketEvent } from "@/ds/socket"
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
    })

    server.on("connection", (socket) => {
      console.log("onConnection")

      socket.on("disconnecting", () => {
        console.log("rooms before disconnecting: ", socket.rooms) // the Set contains at least the socket ID
        socket.rooms.forEach((r) => {
          if (r in gameManager) {
            gameManager[r].memberDisconnect()
          }
        })
      })

      socket.on(SocketEvent.General, (msg: IMsg) => {
        console.log(`received general msg: ${JSON.stringify(msg)}`)
      })

      socket.on(SocketEvent.UserJoinRoom, async (msg: IRoomMsg & IUserMsg) => {
        console.log(SocketEvent.UserJoinRoom, msg)
        const { roomId, id = socket.id, image } = msg
        await socket.join(roomId) // 这里要等待！
        // 自己是排除的，ref: https://socket.io/docs/v4/server-api/#sockettoroom
        socket.to(roomId).emit(SocketEvent.UserJoinRoom, msg)

        getRoom(server, roomId).memberJoin({ id, image })
      })

      socket.on(SocketEvent.UserLeaveRoom, (msg: IRoomMsg) => {
        getRoom(server, msg.roomId).memberLeave(socket.id)
      })

      socket.on(SocketEvent.UserPrepared, async (msg: IRoomMsg) => {
        getRoom(server, msg.roomId).memberPrepare(socket.id)
      })

      socket.on(SocketEvent.UserUnPrepare, async (msg: IRoomMsg) => {
        getRoom(server, msg.roomId).memberUnPrepare(socket.id)
      })
    })

    // append SocketIO server to Next.js socket server response
    res.socket.server.io = server
  }

  res.end()
}
