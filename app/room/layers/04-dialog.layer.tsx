import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { GameState } from "@/components/game/feather-manager"

export default function DialogLayer({ state }: { state: GameState }) {
  switch (state) {
    case "stopped":
      return (
        <div
          className={"flex items-center justify-center flex-col gap-2 | z-50"}
        >
          <div className={"w-[80%]"}>
            <Alert className={"bg-cyan-800"}>
              <AlertTitle>恭喜，你胜利了！✌🏻</AlertTitle>
              <AlertDescription>本局战况：</AlertDescription>
            </Alert>
          </div>
        </div>
      )
    default:
      return null
  }
}
