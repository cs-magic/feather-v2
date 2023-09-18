export interface IUser {
  id: string
  image: string
}

export type PlayerStateType = "preparing" | "prepared" | "playing" | "idle"

export interface IPlayer extends IUser {
  life: number
  x: number
  state: PlayerStateType
}
