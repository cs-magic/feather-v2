import { NextApiRequest } from "next"

import { NextApiResponseServerIO } from "@/types/socket"

const userCache = new Set<string>()
userCache.add("test")

export default function roomHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method === "GET") {
    const username = req.query.username as string
    console.log({ username })
    if (userCache.has(username))
      return res
        .status(406)
        .json({ message: "该用户名已经被人抢占了，请重新试一个吧！" })

    userCache.add(username)
    res.status(200).json({ message: "准入成功！" })
  }
}
