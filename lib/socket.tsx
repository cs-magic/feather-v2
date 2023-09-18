import socketio from "socket.io-client"

import { SOCKET_IO_ENDPOINT, SOCKET_IO_URL } from "@/config/site"

export const socket = socketio(
  // SOCKET_IO_URL,
  // "http://localhost:3000/api/socket",
  {
    path: SOCKET_IO_ENDPOINT,
    transports: [
      // "websocket", // 不能开 polling，我也不知道为什么！
      "polling",
    ], // ref: https://stackoverflow.com/a/41953165/9422455
    autoConnect: false,
    timeout: 1000,
  }
)
