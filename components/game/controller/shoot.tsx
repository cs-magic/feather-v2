import React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ITimer, Timer } from "@/components/timer"

export const Shoot = (props: ITimer) => {
  const [t, setT] = React.useState(0)

  return (
    <Button
      className={cn(
        "w-16 h-16 rounded-full p-6 whitespace-nowrap  text-white transition-all select-none"
      )}
      style={{
        background: t === 1 ? "darkred" : `hsl(195,68%,${20 + t * 30}%)`,
        scale: 1 + Math.min(0.3, Math.log(1 + t)),
      }}
    >
      蓄力
      <Timer onPressing={setT} />
    </Button>
  )
}
