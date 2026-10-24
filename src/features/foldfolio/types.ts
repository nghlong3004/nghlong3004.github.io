import type * as React from "react"

export type Mode = "fold" | "open"
export type Scene = "split" | "glow" | "orbit" | "none"
export type Finish = "titanium" | "graphite" | "coral" | "sage" | "custom"
export type Orientation = "auto" | "landscape" | "portrait"

export interface FoldfolioHandle {
    scrollToSection(sectionKey: string): void
    focusScreenElement(element: HTMLElement): boolean
}

export interface FoldfolioProps {
    ref?: React.Ref<FoldfolioHandle>
    mode: Mode
    screen?: React.ReactNode
    screenPortrait?: React.ReactNode
    screenInteractive?: React.ReactNode
    screenInteractivePortrait?: React.ReactNode
    screenOverlay?: React.ReactNode
    screenOverlayPortrait?: React.ReactNode
    screenNavigation?: { key: string; target?: string }
    cover?: React.ReactNode
    coverPortrait?: React.ReactNode
    call?: React.ReactNode
    callPortrait?: React.ReactNode
    nav?: React.ReactNode
    navPortrait?: React.ReactNode
    nameLeft?: React.ReactNode
    nameRight?: React.ReactNode
    scene: Scene
    glowColors?: [string, string, string]
    basicTone?: "tint" | "white" | "two"
    intro?: { on?: boolean; color?: string; line?: string; speed?: number }
    sceneImages?: { src: string; alt?: string }[]
    finish: Finish
    customFinish: string
    screenColor: string
    switcher: {
        show: boolean
        bottom: number
        scenesAt?: "header" | "bottom"
        top?: number
        right?: number
    }
    status: {
        show: boolean
        time: string
        live: boolean
        tone: "auto" | "light" | "dark"
        batteryText?: string
        batteryLabel?: string
    }
    layout: {
        orientation: Orientation
        portraitBelow: number
        top: number
        bottom: number
        maxScale: number
    }
    motion: {
        openLength: number
        closeLength: number
        holdLength: number
        smoothing: number
        float: boolean
        glass?: boolean
    }
    screenMotion: ScreenMotion
    preview: number
    style?: React.CSSProperties
}

// Motion inside the screens. Works on your own frames, no setup needed:
// - text fades up, big headings (H1/H2 text styles) rise out of a mask
// - frames with an image fill open up (image reveal)
// - a frame named "Count…" counts its number up (e.g. "140+", "12", "98%")
// - hover: images inside links zoom, layers named "Button…" lift, "Row…" slide
export type ScreenMotion = {
    on: boolean
    headlines: boolean
    images: boolean
    counters: boolean
    hover: boolean
    duration: number
    distance: number
    stagger: number
}
