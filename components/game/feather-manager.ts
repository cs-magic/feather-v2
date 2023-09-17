import {FeatherUpdateInterval, FeatherSpeed, FeatherAddInterval} from "@/config/game";
import {ICartesianPos, IPolarPos} from "@/ds/general";

export type GameState = "waiting" | "playing" | "pause" | "stopped"

export class FeatherManager {
  public n: number = 2
  public state: GameState
  public feathers: IPolarPos[] = []

  private addFeather = () => {
    this.feathers.push({r: 0, theta: (Math.random() - .5) * 2 * Math.PI})
  }

  constructor(nPlayers: number = 2) {
    this.n = nPlayers
    this.state = "playing"
    this.addFeather()

    const addFeatherInterval = setInterval(() => {
      this.addFeather()
    }, FeatherAddInterval)

    setInterval(() => {
      if (this.state === "playing") {
        this.feathers.forEach((feature) => {
          if (feature.r >= 1) {
            this.state = "stopped"
            clearInterval(addFeatherInterval)
          } else {
            feature.r += FeatherSpeed * FeatherUpdateInterval / 1000
          }
        })
      }
    }, FeatherUpdateInterval)
  }

  public toUser(k: number): ICartesianPos[] {
    return this.feathers.map((feather) => toUserPos(feather, k, this.n))
  }
}


export const toUserPos = (pos: IPolarPos, k: number, n: number): ICartesianPos => {
  const theta_k = pos.theta - (k / n) * 2 * Math.PI
  const is_in_user_space = Math.abs(theta_k) < Math.PI / n
  const center_x = theta_k / ((is_in_user_space ? 1 / n : (1 - 1 / n)) * 2 * Math.PI)
  const center_y = is_in_user_space ? pos.r : -pos.r
  const x = (center_x + 1) / 2
  const y = (center_y + 1) / 2
  // console.log({pos, k, n, theta_k, x, y})
  return {
    x,
    y
  }
}
