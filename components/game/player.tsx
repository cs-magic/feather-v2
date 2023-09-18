"use client"

import { PropsWithChildren, ReactNode, useState } from "react"
import Image from "next/image"
import { IRoomMsg, SocketEvent } from "@/ds/socket"
import { IPlayer, PlayerStateType } from "@/ds/user"
import { useAppStore } from "@/store"
import { PlayerState } from "@/store/player.slice"
import { useElementSize } from "@mantine/hooks"
import { animated, useSpring } from "@react-spring/web"
import { useDrag } from "@use-gesture/react"
import { range } from "lodash"

import { limitRange } from "@/lib/range"
import { socket } from "@/lib/socket"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Timer } from "@/components/timer"

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

export const PlayerInner = ({ id, image, life = 3, x, state }: IPlayer) => {
  return (
    <div className={"relative w-full"}>
      <AspectRatio ratio={3 / 4}>
        <Image
          src={image}
          alt={"player"}
          fill
          className={cn("w-full pointer-events-none")}
          priority
          sizes={"width:120px"}
        />
      </AspectRatio>

      <PlayerStateComp state={state} life={life} />
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

export const MainPlayer = ({
  player,
  roomId,
}: {
  player: IPlayer
  roomId: string
}) => {
  const { viewPointWidth } = useAppStore()
  const xkey = "marginLeft"
  const left = viewPointWidth >> 1
  const [style, api] = useSpring(() => ({ [xkey]: left }), [])
  const [isMoving, setMoving] = useState(false)
  const [t, setT] = useState(0)

  const bind = useDrag(({ active, movement: [mx, my], offset: [ox, oy] }) => {
    if (!active) {
      setMoving(false)
    }
    if (active && Math.abs(mx) > 10) {
      setMoving(true)
    }
    const pw = width >> 1
    console.log({ active, left, mx: ox, viewPointWidth })
    api.start({
      [xkey]: limitRange(left + ox, { l: pw, r: viewPointWidth - pw }),
    })
  }, {})

  const onFinish = (t: number) => {
    setT(0)
  }
  const pressedT = isMoving ? 0 : t

  const { ref, width } = useElementSize()

  return (
    <div className={"shrink-0 w-full relative"} ref={ref}>
      <div
        className={"relative w-1/2 max-w-[120px] select-none -translate-x-1/2"}
        style={{
          marginLeft: width * (player.x ?? 0.5),
        }}
      >
        <animated.div
          ref={ref}
          {...bind()}
          // style={{
          //   ...style,
          // }}
          className={cn(" select-none touch-none z-50")}
          suppressHydrationWarning // ref: https://nextjs.org/docs/messages/react-hydration-error#solution-3-using-suppresshydrationwarning
        >
          <Timer
            onFinish={onFinish}
            onPressing={setT}
            style={{
              /* offset-x | offset-y | [ blur-radius | spread-radius | ] color */
              boxShadow: `0px -${pressedT}px ${pressedT}px ${pressedT}px rgba(200, 20, 20, 70%)`,
              scale: 1 - Math.min(pressedT, 300) / 500,
            }}
          >
            <PlayerInner {...player} />
          </Timer>
        </animated.div>
      </div>

      <Button
        className={"absolute right-2 bottom-2"}
        onClick={() => {
          socket.emit(SocketEvent.UserPrepared, { roomId } as IRoomMsg)
        }}
      >
        准备
      </Button>
    </div>
  )
}
