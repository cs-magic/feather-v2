export interface IMsg {
  content: string
}

export enum SocketEvent {
  General = "General",
  UserJoinRoom = "UserJoinRoom",
}
