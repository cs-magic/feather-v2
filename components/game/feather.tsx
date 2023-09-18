import Image from "next/image"
import { ICartesianPos } from "@/ds/general"
import { useAppStore } from "@/store"

export const Feather = ({ pos }: { pos: ICartesianPos }) => {
  const { viewPointWidth, viewPointHeight } = useAppStore()

  return (
    <Image
      src={"/game/feather/feather.png"}
      alt={"element"}
      className={"absolute rotate-90 -translate-x-1/2 -translate-y-1/2"}
      width={60}
      height={30}
      style={{
        marginLeft: viewPointWidth * pos.x,
        marginTop: viewPointHeight * pos.y,
      }}
    />
  )
}
