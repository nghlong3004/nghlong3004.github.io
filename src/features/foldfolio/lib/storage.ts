import type { Scene, Finish } from "../types"

export const STORE_KEY = "foldfolio:style"
export const STORE_EVENT = "foldfolio:style"

export function readStore(): { scene?: Scene; finish?: Finish } {
    try {
        return JSON.parse(window.localStorage.getItem(STORE_KEY) || "{}")
    } catch {
        return {}
    }
}
