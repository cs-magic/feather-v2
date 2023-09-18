import { PropsWithChildren, useEffect } from "react"
import { useAppStore } from "@/store"
import { useElementSize } from "@mantine/hooks"

export const BattleArea = ({ children }: PropsWithChildren) => {
  const { ref, width, height } = useElementSize()

  const { setViewPointWidth, setViewPointHeight, playerX } = useAppStore()

  useEffect(() => {
    setViewPointWidth(width)
    setViewPointHeight(height)
  }, [width, height])

  return (
    <div className={"grow relative"} ref={ref}>
      {children}
    </div>
  )
}
