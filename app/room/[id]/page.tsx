"use client"

import { useEffect, useState } from "react"
import { IRoomMsg, SocketEvent } from "@/ds/socket"
import { useAppStore } from "@/store"
import { useElementSize } from "@mantine/hooks"
import { toast } from "react-toastify"

import { GameUpdateClientInterval } from "@/config/game"
import { GameState, toUserPos } from "@/lib/game"
import { socket } from "@/lib/socket"
import useInterval from "@/hooks/interval"
import { useSocketEvents } from "@/hooks/socket"
import { Separator } from "@/components/ui/separator"
import { Feather } from "@/components/game/feather"
import { MainPlayer, SubPlayer } from "@/components/game/player"
import GroundLayer from "@/app/room/layers/01-ground.layer"
import DialogLayer from "@/app/room/layers/04-dialog.layer"
import Layer from "@/app/room/layers/Layer"

export default function RoomPage({
  params: { id: roomId },
}: {
  params: { id: string }
}) {
  const [tick, setTick] = useState(0)
  const k = 0

  const [game, setGame] = useState<GameState>()

  const { ref, width, height } = useElementSize()

  const { setViewPointWidth, setViewPointHeight, userImage } = useAppStore()
  const mainPlayer = game?.members.filter((m) => m.id === socket.id)[0]

  useInterval(() => {
    if (game?.state === "playing") {
      setTick((tick) => tick + 1)
    }
  }, GameUpdateClientInterval)

  useSocketEvents(
    [
      {
        name: SocketEvent.UserJoinRoom,
        handler: (msg: IRoomMsg) => {
          console.log("UserJoinRoom: ", msg)
          toast(msg.content)
        },
      },
      {
        name: SocketEvent.Game,
        handler: (msg: GameState) => {
          console.log("synced game: ", msg)
          setGame(msg)
        },
      },
    ],
    { roomId, image: userImage }
  )

  useEffect(() => {
    setViewPointWidth(width)
    setViewPointHeight(height)
  }, [width, height])

  const n = (game?.members.length ?? 0) - 1

  return (
    <div className={"absolute inset-0 w-full h-full flex flex-col"}>
      <div className={"w-full flex items-end"}>
        {game?.members
          .filter((m) => m.id !== socket.id)
          .map((m) => (
            <div className={"grow basis-0"} key={m.id}>
              <SubPlayer key={m.id} {...m} />
            </div>
          ))}
      </div>
      <Separator orientation={"horizontal"} />

      <div className={"grow relative"} ref={ref}>
        <GroundLayer />

        <Layer>
          {game?.feathers
            .map((polarPos) => toUserPos(polarPos, k, n))
            .map((cartesianPos, index) => (
              <Feather key={index} pos={cartesianPos} />
            ))}
        </Layer>

        <DialogLayer state={game?.state ?? "waiting"} />
      </div>

      <Separator orientation={"horizontal"} />
      {mainPlayer && <MainPlayer roomId={roomId} player={mainPlayer} />}
    </div>
  )
}
