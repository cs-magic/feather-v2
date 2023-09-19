import Image from "next/image"
import { ICartesianPos, IPolarPos } from "@/ds/general"
import { useAppStore } from "@/store"

import { toUserPos } from "@/lib/game"

import { AspectRatio } from "../ui/aspect-ratio"

export const Feather = ({
  pPos,
  k,
  n,
}: {
  pPos: IPolarPos
  k: number
  n: number
}) => {
  const cPos = toUserPos(pPos, k, n)
  const { viewPointWidth, viewPointHeight } = useAppStore()

  const left = viewPointWidth * cPos.x
  const top = viewPointHeight * cPos.y
  return (
    <div
      className={"absolute w-[5%] -translate-x-1/2 -translate-y-1/2 z-[9999]"}
      style={{
        left,
        top,
      }}
    >
      <AspectRatio ratio={1 / 3} className={"relative"}>
        <Image
          className={"rotate-90"}
          src={"/game/feather/feather.png"}
          alt={"element"}
          fill
          sizes={"width:60px"}
        />

        <div className={"absolute inset-0 w-80 bg-cyan-800"}>
          <div>{`p:(r=${pPos.r.toFixed(1)}, theta=${pPos.theta.toFixed(
            1
          )}, speed=${pPos.speed.toFixed(1)})`}</div>
          <div>{`c:(x=${cPos.x.toFixed(1)}, y=${cPos.y.toFixed(
            1
          )}), k=${k}, n=${n}`}</div>
          <div>{`v:(w=${viewPointWidth}, h=${viewPointHeight}, (${left.toFixed(
            1
          )}, ${top.toFixed(1)}))`}</div>
        </div>
      </AspectRatio>
    </div>
  )
}
