"use client"

import { useState } from "react"
import Image from "next/image"
import { IMsg, SocketEvent } from "@/ds/socket"
import { IPlayer, PlayerStateType } from "@/ds/user"
import { useElementSize } from "@mantine/hooks"
import { animated, useSpring } from "@react-spring/web"
import { useGesture } from "@use-gesture/react"
import { range } from "lodash"

import { PlayerMaxLife } from "@/config/game"
import { GameStateType } from "@/lib/game"
import { limitRange } from "@/lib/range"
import { socket } from "@/lib/socket"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export const PlayerStateComp = ({
  state,
  life,
}: {
  state: PlayerStateType
  life: number
}) => {
  switch (state) {
    case "playing":
      return (
        <div className="absolute right-2 top-2 inline-flex items-center gap-1 ">
          {range(life).map((index) => (
            <div className={"rounded-full w-2 h-2 bg-green-500"} key={index} />
          ))}
        </div>
      )
    case "preparing":
      return (
        <div className={cn("ribbon")}>
          <div className="content">🕓</div>
        </div>
      )
    case "prepared":
      return (
        <div className={cn("ribbon check")}>
          <svg
            width="24px"
            height="24px"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="check"
            className="svg-inline--fa fa-check fa-w-16"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
            ></path>
          </svg>
        </div>
      )
    default:
      return null
  }
}

export const PlayerInner = ({
  userId,
  userImage,
  life = 3,
  x,
  state,
}: IPlayer) => {
  return (
    <div className={"relative w-full"}>
      <AspectRatio ratio={3 / 4}>
        <Image
          src={userImage}
          alt={"player"}
          fill
          className={cn("w-full pointer-events-none")}
          priority
          sizes={"width:120px"}
        />
      </AspectRatio>

      <PlayerStateComp state={state} life={life} />
      <div
        className={
          "absolute bottom-0 w-full bg-cyan-900 text-center text-xs truncate px-2"
        }
      >
        {userId}
      </div>
    </div>
  )
}

export const SubPlayer = (player: IPlayer) => {
  const { ref, width } = useElementSize()
  return (
    <div className={"shrink-0 w-full relative"} ref={ref}>
      <div
        className={"relative w-1/2 max-w-[120px] select-none -translate-x-1/2"}
        style={{
          marginLeft: width * (player.x ?? 0.5),
        }}
      >
        <PlayerInner {...player} />
      </div>
    </div>
  )
}

// 要在组件外面，否则会被重复渲染
let timer: ReturnType<typeof setInterval> // number

export const MainPlayer = ({
  gameStateType,
  player,
  roomId,
}: {
  gameStateType: GameStateType
  player: IPlayer
  roomId: string
}) => {
  const { ref, width } = useElementSize()
  const startMarginLeft = width >> 1

  const { ref: refImage, width: imageWidth } = useElementSize()

  const [s, setS] = useState("progress-info")

  const [style, api] = useSpring(
    () => ({ marginLeft: startMarginLeft, t: 0 }),
    [startMarginLeft]
  )

  const bind = useGesture(
    {
      onDragStart: () => {
        timer = setInterval(() => {
          const t = Math.min(style.t.get() + 10, 100)
          console.log({ t, s })
          if (t > 90 && s !== "progress-error") {
            setS("progress-error")
          }
          api.start({ t })
        }, 100)
      },
      onDragEnd: () => {
        console.log("end")
        clearInterval(timer)
        api.start({ t: 0 })
        if (s !== "progress-info") {
          setS("progress-info")
        }
      },
      onDrag: ({
        active,
        movement: [mx, my],
        offset: [ox, oy],
        pressed,
        startTime,
        timeStamp,
      }) => {
        const pw = imageWidth / 2
        const marginLeft = limitRange(startMarginLeft + ox, pw, width - pw)
        const x = marginLeft / width
        socket.emit(SocketEvent.UserMove, { x })

        // console.log({
        //     active,
        //     pressed,
        //     mx: mx.toFixed(1),
        //     marginLeft: marginLeft.toFixed(1),
        //     startTime: startTime.toFixed(1),
        //     timeStamp: timeStamp.toFixed(1),
        // })
        api.start({ marginLeft })
      },
    },
    {}
  )

  console.log({ s, t: style.t.get() })
  return (
    <div className={"shrink-0 w-full relative"} ref={ref}>
      <animated.div
        className="relative w-1/2 max-w-[120px] -translate-x-1/2 select-none touch-none z-50"
        style={{ marginLeft: style.marginLeft }}
        ref={refImage}
        {...bind()}
        suppressHydrationWarning // ref: https://nextjs.org/docs/messages/react-hydration-error#solution-3-using-suppresshydrationwarning
      >
        <PlayerInner {...player} />
      </animated.div>

      <div className={"absolute left-2 top-2 w-full"}>
        <div className={"flex flex-col gap-2"}>
          <div className={"inline-flex items-center gap-2"}>
            <Label>生命值</Label>
            <animated.progress
              className={cn(
                "progress w-36",
                player.life <= PlayerMaxLife / 3
                  ? "progress-error"
                  : player.life <= (PlayerMaxLife * 2) / 3
                  ? "progress-warn"
                  : "progress-info"
              )}
              value={player.life}
              max={PlayerMaxLife}
            />
          </div>

          <div className={"inline-flex items-center gap-2"}>
            <Label>怒气值</Label>
            <animated.progress
              className={cn("progress w-36", s)}
              value={style.t}
              max="100"
            />
          </div>
        </div>
      </div>

      {gameStateType === "waiting" &&
        ["preparing", "prepared"].includes(player.state) && (
          <Button
            className={"absolute right-2 bottom-2"}
            onClick={() => socket.emit(SocketEvent.UserSwitchPreparation)}
          >
            {player.state === "prepared" ? "取消准备" : "准备"}
          </Button>
        )}
    </div>
  )
}
