import { PropsWithChildren } from "react"

export default function Layer({ children }: PropsWithChildren) {
  return <div className={"absolute inset-0 w-full h-full"}>{children}</div>
}
