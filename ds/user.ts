export interface IUser {
  userId: string
  image: string
}

export type PlayerStateType = "preparing" | "prepared" | "playing" | "idle"

export interface IPlayer extends IUser {
  life: number
  x: number
  state: PlayerStateType
}
