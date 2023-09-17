/**
 * Copyright (c) CS-Magic, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { type StoreSlice } from "@/store/index"

export interface PlayerState {
  speed: number
  setSpeed: (v: number) => void
}

export const createPlayerSlice: StoreSlice<PlayerState> = (
  setState,
  getState,
  store
) => ({
  speed: 0,
  setSpeed: (v) =>
    setState((state) => {
      state.speed = v
    }),
})
