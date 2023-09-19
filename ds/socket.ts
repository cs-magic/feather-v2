import { IUser } from "./user"

export interface IBaseMsg {
  content?: string
}

export interface IMsg extends IUser, IBaseMsg {
  roomId: string
}

export enum SocketEvent {
  // room
  UserJoinRoom = "UserJoinRoom",
  UserLeaveRoom = "UserLeaveRoom",
  UserPrepared = "UserPrepared",
  UserUnPrepare = "UserUnPrepare",
  Game = "Game",
}
