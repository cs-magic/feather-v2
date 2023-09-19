import { ICartesianPos, IPolarPos } from "@/ds/general"
import { SocketEvent } from "@/ds/socket"
import { IPlayer, IUser } from "@/ds/user"

import { SocketIOServer } from "@/types/socket"
import {
  FeatherAddInterval,
  FeatherSpeed,
  GameUpdateServerInterval,
} from "@/config/game"
import { initPlayerFromUser } from "@/lib/user"

/**
 * 本来还加了 stop 状态，但是实际是一局局连着玩的，所以暂时没必要。。
 */
export type GameStateType = "waiting" | "playing" | "pause"

export interface GameState {
  state: GameStateType
  tick: number
  room: string
  members: IPlayer[]
  feathers: IPolarPos[]
}

export class GameRoom {
  public state: GameStateType = "waiting"
  private server: SocketIOServer
  private room: string
  private members: IPlayer[] = []
  public feathers: IPolarPos[] = []
  private tick = 0

  constructor(server: SocketIOServer, room: string) {
    this.server = server
    this.room = room
  }

  public canStart(): boolean {
    for (const p of this.members) {
      if (p.state !== "prepared") return false
    }
    return true
  }

  private sync() {
    this.members = this.members.filter((x) => !!x)
    this.server.to(this.room).emit(SocketEvent.Game, this.data())
  }

  public memberJoin(user: IUser) {
    // 重连需要删除旧的socket
    const i = this.members.findIndex((m) => m.userId === user.userId)
    if (i >= 0) delete this.members[i]

    this.members.push(initPlayerFromUser(user))
    this.sync()
  }

  public memberLeave(playerId?: string) {
    this.members = this.members.filter((p) => p.userId && p.userId !== playerId)
    this.sync()
  }

  public memberPrepare(playerId: string) {
    this.members.find((p) => p.userId === playerId)!.state = "prepared"
    this.sync()

    // 最后一个人准备后自动开局
    this.tryStart()
  }

  public memberUnPrepare(playerId: string) {
    this.members.find((p) => p.userId === playerId)!.state = "preparing"
    this.sync()
  }

  public data(): GameState {
    return {
      state: this.state,
      tick: this.tick,
      room: this.room,
      members: this.members,
      feathers: this.feathers,
    }
  }

  private addFeather = () => {
    this.feathers.push({
      r: 0,
      theta: (Math.random() - 0.5) * 2 * Math.PI,
      // (Math.random() / 2) * 2 * Math.PI,
    })
  }

  private addFeatherInterval = setInterval(() => {
    if (this.state === "playing") {
      this.addFeather()
    }
  }, FeatherAddInterval)

  private updateFeathersInterval = setInterval(() => {
    if (this.state === "playing") {
      this.tick += 1
      this.feathers.forEach((feature) => {
        if (feature.r >= 1) {
          this.state = "waiting"
          this.members.forEach((m) => (m.state = "idle"))
        } else {
          const dir = feature.invert ? -1 : 1
          feature.r += (dir * FeatherSpeed * GameUpdateServerInterval) / 1000
        }
      })
      console.log(`syncing: `, this.data())
      // 还在运行，也可能这一轮终止了，但不管如何，都传输一下
      this.sync()
    }
  }, GameUpdateServerInterval)

  public tryStart() {
    if (this.canStart()) {
      console.log("=== game started ===")
      this.state = "playing"
      this.feathers = []
    }
  }

  public pause() {
    console.log("=== game paused ===")
    this.state = "pause"
  }

  public resume() {
    console.log("=== game resumed ===")
    this.state = "playing"
  }
}

/**
 * 返回
 *  - x: [0: 1]， 从左到右
 *  - y: [0: 1]，从上到下
 * @param pos
 * @param k
 * @param n
 */
export const toUserPos = (
  pos: IPolarPos,
  k: number,
  n: number
): ICartesianPos => {
  const theta_k = pos.theta - (k / n) * 2 * Math.PI
  const is_in_user_space = Math.abs(theta_k) < Math.PI / n
  const center_x =
    theta_k / ((is_in_user_space ? 1 / n : 1 - 1 / n) * 2 * Math.PI)
  const center_y = is_in_user_space ? pos.r : -pos.r
  const x = (center_x + 1) / 2
  const y = (center_y + 1) / 2
  // console.log({pos, k, n, theta_k, x, y})
  return {
    x,
    y,
  }
}
