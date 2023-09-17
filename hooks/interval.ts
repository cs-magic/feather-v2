import { useEffect, useRef } from "react"

export default function useInterval(cb: () => void, delay: number) {
  const ref = useRef<any>()

  useEffect(() => {
    ref.current = cb
  })

  useEffect(() => {
    if (delay < 0) {
      return
    }
    const timer = setInterval(() => ref.current(), delay)
    return () => {
      clearInterval(timer)
    }
  }, [delay])
}
