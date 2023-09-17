/**
 * Copyright (c) CS-Magic, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { type StoreSlice } from "@/store/index"

export interface SystemState {}

export const createSystemSlice: StoreSlice<SystemState> = (
  setState,
  getState,
  store
) => ({})
