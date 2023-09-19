/**
 * Copyright (c) CS-Magic, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { type StoreSlice } from "@/store/index"

export interface UserState {
  socketId?: string
  setSocketId: (v: string | undefined) => void

  userId?: string
  setUserId: (v: string | undefined) => void

  userImage: string
  setUserImage: (v: string) => void
}

export const createUserSlice: StoreSlice<UserState> = (
  setState,
  getState,
  store
) => ({
  socketId: undefined,
  setSocketId: (v) =>
    setState((state) => {
      state.socketId = v
    }),

  userId: undefined,
  setUserId: (v) =>
    setState((state) => {
      state.userId = v
    }),

  userImage: "/game/player/0/blow.png", // 居中
  setUserImage: (v) =>
    setState((state) => {
      state.userImage = v
    }),
})
