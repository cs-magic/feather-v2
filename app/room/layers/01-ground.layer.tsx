import { Separator } from "@/components/ui/separator"
import Layer from "@/app/room/layers/Layer"

export default function GroundLayer() {
  return (
    <Layer>
      <div className={"w-full h-full flex flex-col grow"}>
        <div className={"grow"} />
        <Separator orientation={"horizontal"} />
        <div className={"grow"} />
      </div>
    </Layer>
  )
}
