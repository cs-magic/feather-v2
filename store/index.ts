/**
 * Copyright (c) CS-Magic, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createPlayerSlice, type PlayerState } from "@/store/player.slice"
import { createSystemSlice, type SystemState } from "@/store/system.slice"
import { UIState, createUISlice } from "@/store/ui.slice"
import { create, type StateCreator } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

/**
 * store
 */
export type StoreState = PlayerState & SystemState & UIState

export type StoreSlice<T> = StateCreator<
  StoreState,
  [
    ["zustand/devtools", never],
    ["zustand/persist", unknown],
    ["zustand/immer", never]
  ],
  [],
  T
>

export const useAppStore = create<StoreState>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createPlayerSlice(...a),
        ...createSystemSlice(...a),
        ...createUISlice(...a),
      })),
      {
        name: "zustand",
        version: 0.1,
        // @ts-ignore
        migrate: (persistedState: StoreState, version) => {
          // example
          if (version === 0) {
            // @ts-ignore
            delete persistedState.app
          }
          return persistedState
        },
      }
    )
  )
)
