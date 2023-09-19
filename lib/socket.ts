import { IFullMsg, SocketEvent } from "@/ds/socket"
import socketio from "socket.io-client"

import { SocketIOServer } from "@/types/socket"
import { SOCKET_IO_ENDPOINT, SOCKET_IO_URL } from "@/config/site"
import { Game } from "@/lib/game"

export const socket = socketio(
  // SOCKET_IO_URL,
  // "http://localhost:3000/api/socket",
  {
    path: SOCKET_IO_ENDPOINT,
    transports: [
      // "websocket", // 不能开 websocket，我也不知道为什么！
      "polling", // 这是默认的，关了后就没法用了
    ], // ref: https://stackoverflow.com/a/41953165/9422455
    autoConnect: false,
    timeout: 1000,
  }
)

const user2room: Record<string, string> = {}

const gameManager: Record<string, Game> = {}

const getGameFromSocket = (server: SocketIOServer, roomId: string) => {
  if (roomId in gameManager) return gameManager[roomId]
  return (gameManager[roomId] = new Game(server, roomId))
}

const socketHandlers: { name: string; handler: keyof Game }[] = [
  { name: "disconnecting", handler: "memberLeaveRoom" },
  // { name: "disconnected", handler: "memberLeaveRoom" },
  { name: SocketEvent.UserLeaveRoom, handler: "memberLeaveRoom" },
  { name: SocketEvent.UserPrepare, handler: "memberPrepare" },
  { name: SocketEvent.UserMove, handler: "memberMove" },
  { name: SocketEvent.UserShoot, handler: "memberShoot" },
]

export const handleSocket = (server: SocketIOServer) => {
  server.on("connection", (socket) => {
    const g = () => getGameFromSocket(server, user2room[socket.id])

    socket.on("disconnecting", () => {
      console.log("disconnecting")
    })

    socket.on("disconnect", () => {
      console.log("disconnect")
    })

    socket.on(SocketEvent.UserJoinRoom, async (msg: IFullMsg) => {
      const { roomId } = msg

      // const fullMsg: IFullMsg = { ...msg, socketId: socket.id }
      console.log(
        SocketEvent.UserJoinRoom,
        { sid: msg.socketId, uid: msg.userId },
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
}
