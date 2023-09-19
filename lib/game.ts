import { ICartesianPos, IPolarPos } from "@/ds/general"
import { SocketEvent } from "@/ds/socket"
import { IPlayer, ISocket, IUser } from "@/ds/user"

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
  roomId: string
  members: IPlayer[]
  feathers: IPolarPos[]
}

export class Game {
  private readonly roomId: string
  private tick = 0
  public state: GameStateType = "waiting"
  private server: SocketIOServer
  private members: IPlayer[] = []
  public feathers: IPolarPos[] = []

  constructor(server: SocketIOServer, roomId: string) {
    this.server = server
    this.roomId = roomId
  }

  public canStart(): boolean {
    for (const p of this.members) {
      if (p.state !== "prepared") return false
    }
    return true
  }

  private sync() {
    console.log("syncing ...")
    this.members = this.members.filter((x) => !!x)
    this.server.to(this.roomId).emit(SocketEvent.GameState, this.data())
  }

  public memberJoinRoom(user: IUser & ISocket) {
    // 重连需要删除旧的socket（uid一致，但sid不一致）
    const i = this.members.findIndex(
      (m) => m.userId === user.userId && m.socketId !== user.socketId
    )
    if (i >= 0) delete this.members[i]

    this.members.push(initPlayerFromUser(user))
    this.sync()
  }

  public memberLeaveRoom(socketId: string) {
    this.members = this.members.filter(
      (p) => p.socketId && p.socketId !== socketId
    )
    this.sync()
  }

  public memberPrepare(socketId: string) {
    const player = this.members.find((p) => p.socketId === socketId)!
    const { state } = player
    player.state = state === "preparing" ? "prepared" : "preparing"
    this.sync()

    // 最后一个人准备后自动开局
    if (player.state === "prepared") this.tryStart()
  }

  public memberMove(socketId: string, { x }: { x: number }) {
    this.members.find((p) => p.socketId === socketId)!.x = x
  }

  public memberShoot(socketId: string, power: number) {
    // todo
    // this.members.find((p) => p.socketId === socketId)!
  }

  public data(): GameState {
    const data = {
      state: this.state,
      tick: this.tick,
      roomId: this.roomId,
      members: this.members,
      feathers: this.feathers,
    } as GameState
    console.log("data: ", data)
    return data
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
