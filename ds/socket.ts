import { ISocket, IUser } from "./user"

export interface IBaseMsg {
  content?: string
}

export interface IMsg extends IUser, IBaseMsg {
  roomId: string
}

export interface IFullMsg extends IMsg, ISocket {}

export enum SocketEvent {
  GameState = "GameState",

  UserJoinRoom = "UserJoinRoom",
  UserLeaveRoom = "UserLeaveRoom",

  UserSwitchPreparation = "UserSwitchPreparation",

  UserMove = "UserMove",
  UserShoot = "UserShoot",
}
