import type { Finish, Scene, ScreenMotion } from "../types"

// Four hand-tuned finishes: [base, shade, highlight, deep]
export const FINISHES: Record<
    Exclude<Finish, "custom">,
    { label: string; c: string[] }
> = {
    titanium: {
        label: "Titanium",
        c: ["#DCD9D3", "#A6A29B", "#F7F5F1", "#6F6B65"],
    },
    graphite: {
        label: "Graphite",
        c: ["#3A3A3D", "#1B1B1D", "#6A6A6E", "#0E0E10"],
    },
    coral: { label: "Coral", c: ["#EFA38C", "#C4664F", "#F9CDBE", "#9B4A37"] },
    sage: { label: "Sage", c: ["#C3CBB7", "#76816B", "#E0E6D8", "#5A6450"] },
}
export const FINISH_KEYS = ["titanium", "graphite", "coral", "sage"] as const
export const SCENES: { key: Scene; label: string }[] = [
    { key: "split", label: "Basic" },
    { key: "glow", label: "Glow" },
    { key: "orbit", label: "Orbit" },
]

// Device geometry in design pixels. Screen = W - 2*(f+bz).
// Landscape screen 976 x 660 (two halves of 488). Portrait screen 358 x 718 (two halves of 359).
export const GEO = {
    landscape: { W: 1000, H: 684, f: 4, bz: 8, T: 12, R: 46 },
    portrait: { W: 380, H: 740, f: 4, bz: 7, T: 10, R: 42 },
}

export const MOTION_DEFAULTS: ScreenMotion = {
    on: true,
    headlines: true,
    images: true,
    counters: true,
    hover: true,
    duration: 1,
    distance: 26,
    stagger: 0.06,
}
