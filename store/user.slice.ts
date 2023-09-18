/**
 * Copyright (c) CS-Magic, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { type StoreSlice } from "@/store/index"

export interface UserState {
  userImage: string
  setUserImage: (v: string) => void
}

export const createUserSlice: StoreSlice<UserState> = (
  setState,
  getState,
  store
) => ({
  userImage: "/game/player/A/blow.png", // 居中
  setUserImage: (v) =>
    setState((state) => {
      state.userImage = v
    }),
})
