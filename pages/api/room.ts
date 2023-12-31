import { NextApiRequest } from "next"

import { NextApiResponseServerIO } from "@/types/socket"

export default function roomHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method === "POST") {
    // get message
    const message = req.body

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("message", message)

    // return message
    res.status(201).json(message)
  }
}
