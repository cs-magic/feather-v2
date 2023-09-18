import socketio from "socket.io-client"

import { SOCKET_IO_ENDPOINT } from "@/config/site"

export const socket = socketio({
  path: SOCKET_IO_ENDPOINT,
  // transports: ["websocket"], // 不要开这个
  autoConnect: false,
  timeout: 300,
})
