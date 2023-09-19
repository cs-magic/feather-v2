"use client"

import { useEffect, useRef, useState } from "react"
import { useAppStore } from "@/store"
import { toast } from "react-toastify"

import { useMounted } from "@/hooks/use-mount"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WithPlayerId } from "@/app/room/[id]/auth"

export default function RoomPage({
  params: { id: roomId },
}: {
  params: { id: string }
}) {
  const { userId, setUserId } = useAppStore()
  const ref = useRef<HTMLInputElement>(null)

  const mounted = useMounted()
  if (!mounted) return null

  if (!userId) {
    return (
      <form
        className={
          "w-[320px] mx-auto h-full | flex  justify-center gap-2 flex-col"
        }
        onSubmit={async (event) => {
          event.preventDefault()

          const v = ref.current?.value
          if (!v) return
          const res = await fetch(`/api/user?username=${v}`)
          console.log({ res })

          if (!res.ok) {
            const { message } = await res.json()
            toast.error(message)
          } else {
            toast.success(`欢迎 👏 ${v} 👏🏻 体验全世界最无聊的吹羽毛游戏！`)
            setUserId(v)
          }
        }}
      >
        <Label>请输入您的用户名：</Label>
        <Input ref={ref} placeholder={"宇智波佐助"} defaultValue={userId} />
        <Button type={"submit"}>OK</Button>
      </form>
    )
  }

  console.log({ userId })
  return <WithPlayerId roomId={roomId} userId={userId} />
}
