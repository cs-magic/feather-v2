/**
 * Copyright (c) CS-Magic, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { type StoreSlice } from "@/store/index"

export interface PlayerState {
  playerX: number
  setPlayerX: (v: Function | number) => void

  roomId: string | undefined
  setRoomId: (v: string | undefined) => void
}

export const createPlayerSlice: StoreSlice<PlayerState> = (
  setState,
  getState,
  store
) => ({
  playerX: 0.5, // 居中
  setPlayerX: (v) =>
    setState((state) => {
      state.playerX = typeof v === "number" ? v : v()
    }),

  roomId: undefined,
  setRoomId: (v) =>
    setState((state) => {
      state.roomId = v
    }),
})
