import type { GEO } from "../config/constants"
import type { FoldfolioProps, Mode, Scene } from "../types"

export type MItem = {
    el: HTMLElement
    root: HTMLElement
    top: number
    h: number
    kind: "t" | "h" | "i" | "c"
    done: boolean
}
export type Reveal = {
    el: HTMLElement
    img: HTMLElement | null
    kind: MItem["kind"]
    t0: number
    dur: number
    dist: number
}

export type SceneImage = { src: string; top: number }
export type NameSize = { lw: number; lh: number; rw: number; rh: number }
export type IntroConfig = { on: boolean; color: string; line: string; speed: number }
export type Geometry = typeof GEO.landscape | typeof GEO.portrait
export type GeometryState = {
    port: boolean
    G: Geometry
    s: number
    U1: number
    U2: number
    U3: number
    innerMax: number
    innerPx: number
    stageH: number
    vw: number
    cy: number
    halfW: number
    halfH: number
    Hs: number
    scene: Scene
    nameSize: NameSize
    imgs: NonNullable<FoldfolioProps["sceneImages"]>
    mode: Mode
    cRight: string
    cAll: string
    inner: (r: string, off: number) => string
}
export type LiveState = {
    k: number
    inner: number
    cur: number
    tint: string
    bars: HTMLElement[] | null
    rc: string
    pe: number
}
export type TintSection = {
    top: number
    lum: number
    lumR: number
    src?: string
    srcR?: string
}
export type StyleWriter = (el: HTMLElement | null | undefined, key: string, value: string) => void
