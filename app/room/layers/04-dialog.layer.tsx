import { GameStateType } from "@/lib/game"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Layer from "@/app/room/layers/Layer"

export default function DialogLayer({ state }: { state: GameStateType }) {
  switch (state) {
    case "stopped":
      return (
        <Layer>
          <div
            className={
              "h-full flex items-center justify-center flex-col gap-2 | z-50"
            }
          >
            <div className={"w-[80%]"}>
              <Alert className={"bg-cyan-800"}>
                <AlertTitle>恭喜，你胜利了！✌🏻</AlertTitle>
                <AlertDescription>本局战况：</AlertDescription>
              </Alert>
            </div>
          </div>
        </Layer>
      )
    default:
      return null
  }
}
