export interface IMsg {
  // type: SocketEvent
  content?: string
}

export interface IUserMsg extends IMsg {
  id?: string
  image: string
}

export interface IRoomMsg extends IMsg {
  roomId: string
}

export enum SocketEvent {
  // general
  General = "General",

  // room
  UserJoinRoom = "UserJoinRoom",
  UserLeaveRoom = "UserLeaveRoom",
  UserPrepared = "UserPrepared",
  UserUnPrepare = "UserUnPrepare",
  Game = "Game",
}
