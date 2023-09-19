import { useEffect, useState } from "react"
import { IFullMsg, IMsg, SocketEvent } from "@/ds/socket"
import { useAppStore } from "@/store"
import { useElementSize } from "@mantine/hooks"
import { range } from "lodash"
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

export const WithPlayerId = (msg: IMsg) => {
  const { roomId, userId, userImage } = msg

  const [tick, setTick] = useState(0)

  const [game, setGame] = useState<GameState>({
    state: "waiting",
    members: [],
    feathers: [],
    tick: 0,
    roomId: roomId,
  })

  const { ref, width, height } = useElementSize()

  const { setViewPointWidth, setViewPointHeight } = useAppStore()

  useInterval(() => {
    if (game.state === "playing") {
      setTick((tick) => tick + 1)
    }
  }, GameUpdateClientInterval)

  useSocketEvents(
    [
      {
        name: SocketEvent.UserJoinRoom,
        handler: (msg: IFullMsg) => {
          console.log("UserJoinRoom: ", msg)
          toast(msg.content)
        },
      },
      {
        name: SocketEvent.GameState,
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

  const k = game.members.findIndex((m) => m.userId === userId)
  const mainPlayer = game.members[k]
  const n = game.members.length
  const subPlayersRange = range(n)
  delete subPlayersRange[k]

  console.log({ socket, mainPlayer, msg })
  if (!socket || !mainPlayer) return null

  return (
    <div
      className={"absolute inset-0 w-full h-full flex flex-col"}
      suppressHydrationWarning
    >
      <div className={"w-full flex items-end shrink-0"}>
        {subPlayersRange.map((k) => (
          <div className={"grow basis-0"} key={k}>
            <SubPlayer player={game.members[k]} k={k} />
          </div>
        ))}
      </div>
      <Separator orientation={"horizontal"} />

      <div className={"grow relative"} ref={ref}>
        <GroundLayer />

        {game.feathers.map((f, i) => (
          <Feather key={i} pPos={f} k={k} n={n} />
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
          k={k}
        />
      )}
    </div>
  )
}
