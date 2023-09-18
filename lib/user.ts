import { IPlayer, IUser } from "@/ds/user"

export const initPlayerFromUser = (user: IUser): IPlayer => ({
  ...user,
  life: 3,
  x: 0.5,
  state: "preparing",
})
