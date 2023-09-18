import Image from "next/image"
import { ICartesianPos } from "@/ds/general"
import { useAppStore } from "@/store"

import { AspectRatio } from "../ui/aspect-ratio"

export const Feather = ({ pos }: { pos: ICartesianPos }) => {
  const { viewPointWidth, viewPointHeight } = useAppStore()

  return (
    <div
      className={" w-[5%] -translate-x-1/2 -translate-y-1/2"}
      style={{
        marginLeft: viewPointWidth * pos.x,
        marginTop: viewPointHeight * pos.y,
      }}
    >
      <AspectRatio ratio={1 / 3}>
        <Image
          className={"rotate-90"}
          src={"/game/feather/feather.png"}
          alt={"element"}
          fill
          sizes={"width:60px"}
        />
      </AspectRatio>
    </div>
  )
}
