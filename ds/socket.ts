export interface IBaseMsg {
  content?: string
}

export interface IUserMsg extends IBaseMsg {
  userId: string
  image: string
}

export interface IRoomMsg extends IBaseMsg {
  roomId: string
}

export interface IMsg extends IUserMsg, IRoomMsg {}

export enum SocketEvent {
  // room
  UserJoinRoom = "UserJoinRoom",
  UserLeaveRoom = "UserLeaveRoom",
  UserPrepared = "UserPrepared",
  UserUnPrepare = "UserUnPrepare",
  Game = "Game",
}
