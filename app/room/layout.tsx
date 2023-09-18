"use client"

import { PropsWithChildren } from "react"
import { IRoomMsg, SocketEvent } from "@/ds/socket"
import { toast } from "react-toastify"

import { useSocketEvents } from "@/hooks/socket"
import { Separator } from "@/components/ui/separator"
import { MainPlayer } from "@/components/game/main-player"
import { Player } from "@/components/game/player"
import { BattleArea } from "@/app/room/battel"

export default function GameLayout({ children }: PropsWithChildren) {
  useSocketEvents([
    {
      name: SocketEvent.UserJoinRoom,
      handler: (msg: IRoomMsg) => {
        console.log("UserJoinRoom: ", msg)
        toast(msg.content)
      },
    },
  ])

  return (
    <div
      className={
        "relative w-full h-full md:w-[720px] mx-auto flex flex-col border overflow-auto"
      }
    >
      <div className={"absolute inset-0 w-full h-full flex flex-col"}>
        <div className={"ml-[50%] w-[20%] -translate-x-1/2"}>
          <Player blow="/game/player/A/blow.png" />
        </div>
        <Separator orientation={"horizontal"} />

        <BattleArea>{children}</BattleArea>

        <Separator orientation={"horizontal"} />
        <MainPlayer />
      </div>
    </div>
  )
}
