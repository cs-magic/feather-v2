import { useAppStore } from "@/store"

import { Player } from "@/components/game/player"

export const MainPlayer = () => {
  const { playerX, setPlayerX } = useAppStore()

  return <Player blow="/game/player/B/blow.png" pos="bottom" x={playerX} />
}
