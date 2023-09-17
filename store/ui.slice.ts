/**
 * Copyright (c) CS-Magic, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { type StoreSlice } from "@/store/index"

export interface UIState {
  viewPointWidth: number
  setViewPointWidth: (v: number) => void

  mainPlayerWidth: number
  setMainPlayerWidth: (v: number) => void
}

export const createUISlice: StoreSlice<UIState> = (
  setState,
  getState,
  store
) => ({
  viewPointWidth: 0,
  setViewPointWidth: (v) =>
    setState((state) => {
      state.viewPointWidth = v
    }),

  mainPlayerWidth: 0,
  setMainPlayerWidth: (v) =>
    setState((state) => {
      state.mainPlayerWidth = v
    }),
})
