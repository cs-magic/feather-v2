export interface ISocket {
  socketId: string
}

export interface IUser {
  userId: string
  userImage: string
}

export type PlayerStateType = "preparing" | "prepared" | "playing" | "idle"

export interface IPlayer extends IUser, ISocket {
  life: number
  x: number
  state: PlayerStateType
}
