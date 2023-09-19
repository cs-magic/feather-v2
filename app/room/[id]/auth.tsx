import { useEffect, useState } from "react"
import { IMsg, SocketEvent } from "@/ds/socket"
import { useAppStore } from "@/store"
import { useElementSize } from "@mantine/hooks"
import { toast } from "react-toastify"

import { GameUpdateClientInterval } from "@/config/game"
import { GameState, toUserPos } from "@/lib/game"
import useInterval from "@/hooks/interval"
import { useSocketEvents } from "@/hooks/socket"
import { Separator } from "@/components/ui/separator"
import { Feather } from "@/components/game/feather"
import { MainPlayer, SubPlayer } from "@/components/game/player"
import GroundLayer from "@/app/room/layers/01-ground.layer"
import DialogLayer from "@/app/room/layers/04-dialog.layer"

export const WithPlayerId = (msg: IMsg) => {
  const { roomId, userId, userImage } = msg

  const [tick, setTick] = useState(0)
  const k = 0

  const [game, setGame] = useState<GameState>({
    state: "waiting",
    members: [],
    feathers: [],
    tick: 0,
    room: roomId,
  })

  const { ref, width, height } = useElementSize()

  const { setViewPointWidth, setViewPointHeight } = useAppStore()
  const mainPlayer = game.members.filter((m) => m.userId === userId)[0]
  const n = game.members.length

  useInterval(() => {
    if (game.state === "playing") {
      setTick((tick) => tick + 1)
    }
  }, GameUpdateClientInterval)

  useSocketEvents(
    [
      {
        name: SocketEvent.UserJoinRoom,
        handler: (msg: IMsg) => {
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
    msg
  )

  useEffect(() => {
    setViewPointWidth(width)
    setViewPointHeight(height)
  }, [width, height])

  if (!mainPlayer) return null

  return (
    <div
      className={"absolute inset-0 w-full h-full flex flex-col"}
      suppressHydrationWarning
    >
      <div className={"w-full flex items-end"}>
        {game.members
          .filter((m) => m?.userId !== userId)
          .map((m) => (
            <div className={"grow basis-0"} key={m.userId}>
              <SubPlayer key={m.userId} {...m} />
            </div>
          ))}
      </div>
      <Separator orientation={"horizontal"} />

      <div className={"grow relative"} ref={ref}>
        <GroundLayer />

        {game.feathers
          .map((polarPos) => toUserPos(polarPos, k, n))
          .map((cartesianPos, index) => (
            <Feather key={index} pos={cartesianPos} />
          ))}

        <DialogLayer
          gameState={game.state}
          playerState={mainPlayer.state}
          {...msg}
        />
      </div>

      <Separator orientation={"horizontal"} />
      {mainPlayer && (
        <MainPlayer
          roomId={roomId}
          player={mainPlayer}
          gameStateType={game.state}
        />
      )}
    </div>
  )
}
