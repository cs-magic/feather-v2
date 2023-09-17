/**
 * Copyright (c) CS-Magic, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { type StoreSlice } from "@/store/index"

export interface PlayerState {
  playerSpeed: number
  setPlayerSpeed: (v: number) => void
  playerX: number
  setPlayerX: (v: number) => void
}

export const createPlayerSlice: StoreSlice<PlayerState> = (
  setState,
  getState,
  store
) => ({
  playerSpeed: 0,
  setPlayerSpeed: (v) =>
    setState((state) => {
      state.playerSpeed = v
    }),
  playerX: 0.5, // 居中
  setPlayerX: (v) =>
    setState((state) => {
      state.playerX = v
    }),
})
