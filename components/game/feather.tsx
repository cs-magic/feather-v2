import { useEffect, useState } from "react"
import Image from "next/image"
import { ICartesianPos } from "@/ds/general"
import { useAppStore } from "@/store"
import { useElementSize } from "@mantine/hooks"

export const Feather = ({ pos }: { pos: ICartesianPos }) => {
  const { viewPointWidth, viewPointHeight } = useAppStore()
  const { ref, width, height } = useElementSize()

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  console.log({ viewPointWidth, viewPointHeight, pos, width, height })

  return (
    <Image
      ref={ref}
      src={"/game/feather/feather.png"}
      alt={"element"}
      className={"absolute rotate-90"}
      width={60}
      height={30}
      style={{
        left: viewPointWidth * pos.x - width / 2,
        top: viewPointHeight * pos.y - height / 2,
      }}
    />
  )
}
