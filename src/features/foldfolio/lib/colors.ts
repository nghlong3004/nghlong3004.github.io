import { FINISHES } from "../config/constants"
import type { Finish } from "../types"

export const mixHex = (a: string, b: string, t: number) => {
    const p = (h: string) => {
        const s = h.replace("#", "")
        const n = parseInt(
            s.length === 3
                ? s
                      .split("")
                      .map((x) => x + x)
                      .join("")
                : s.slice(0, 6),
            16
        )
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    }
    const x = p(a),
        y = p(b)
    const c = x.map((v, i) => Math.round(v + (y[i] - v) * t))
    return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("")
}
export const toHex = (c: string) => {
    if (!c) return "#DCD9D3"
    if (c.startsWith("#")) return c
    const m = c.match(/\d+(\.\d+)?/g)
    if (!m) return "#DCD9D3"
    return (
        "#" +
        m
            .slice(0, 3)
            .map((v) => Math.round(+v).toString(16).padStart(2, "0"))
            .join("")
    )
}
export function finishColors(finish: Finish, custom: string) {
    if (finish !== "custom") return FINISHES[finish].c
    const base = toHex(custom)
    return [
        base,
        mixHex(base, "#000000", 0.28),
        mixHex(base, "#FFFFFF", 0.55),
        mixHex(base, "#000000", 0.5),
    ]
}
