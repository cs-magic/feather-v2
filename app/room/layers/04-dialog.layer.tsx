import { IMsg, SocketEvent } from "@/ds/socket"
import { PlayerStateType } from "@/ds/user"

import { GameStateType } from "@/lib/game"
import { socket } from "@/lib/socket"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Layer from "@/app/room/layers/Layer"

export default function DialogLayer({
  gameState,
  playerState,
  ...msg
}: {
  gameState: GameStateType
  playerState: PlayerStateType
} & IMsg) {
  if (gameState === "waiting" && playerState === "idle")
    return (
      <Layer>
        <div
          className={
            "h-full flex items-center justify-center flex-col gap-2 | z-50"
          }
        >
          <div className={"w-[80%]"}>
            <Card className={"bg-primary"}>
              <CardHeader>
                <CardTitle> 恭喜，你胜利了！✌🏻 </CardTitle>
                <CardDescription>3 : 1</CardDescription>
              </CardHeader>
              <CardContent>战局回顾：xxxx</CardContent>
              <CardFooter>
                <Button
                  variant={"outline"}
                  className={"w-full"}
                  onClick={() => {
                    socket.emit(SocketEvent.UserSwitchPreparation, msg)
                  }}
                >
                  继续准备
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Layer>
    )
  return null
}
