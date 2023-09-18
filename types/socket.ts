import { Server as NetServer, Socket } from "net"
import { NextApiResponse } from "next"
import { Server } from "socket.io"

export type SocketIOServer = Server

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}
