// Foldfolio Device — the foldable phone that holds the whole site.
//
// Brief (Noor): the device is the key feature and must look very realistic.
// Duo-style opening, no camera, rounded corners on the hinge side when closed,
// a realistic crease instead of a flat line, no "squeezed" leaf while opening,
// fits every screen size, 4 frame finishes and 3 backgrounds (Basic / Glow / Orbit)
// with an optional live switcher. Everything inside the screens stays native Framer:
// connect your own frames (with CMS lists, links, effects) to the slots.
//
// How it works
// - Mode "Fold (Home)": scroll opens the device, scrolls the Screen content, folds it
//   shut and shows the Call screen on the cover.
// - Mode "Open (pages)": the device rises in already open; page scroll moves the
//   Screen content inside the display.
// - Landscape (book fold) on wide screens, Portrait (flip fold) on phones & tall screens.
//   Design your Screen frames at 976 px (landscape) and 358 px (portrait) wide.

import {
    Children,
    useEffect,
    useRef,
    useState,
    startTransition,
} from "react"
import { RenderTarget } from "./integrations/framer/preview"
import { GEO, MOTION_DEFAULTS } from "./config/constants"
import { finishColors } from "./lib/colors"
import type { ReactNode, ReactElement } from "react"
import { readStore, STORE_KEY, STORE_EVENT } from "./lib/storage"
import { LITE_CSS, MOTION_CSS, abs, fill } from "./styles/motion"
import type { FoldfolioProps, Finish, Scene, ScreenMotion } from "./types"
import type { GeometryState, LiveState, TintSection } from "./engine/types"
import { useIsoLayoutEffect } from "./hooks/useIsoLayoutEffect"
import { useDeviceRefs } from "./hooks/useDeviceRefs"
import { useSectionNavigation, useScreenNavigationRequest } from "./hooks/useSectionNavigation"
import { useSceneImages } from "./hooks/useSceneImages"
import { useScreenMotion } from "./hooks/useScreenMotion"
import { usePagePreload, useScreenFilters } from "./hooks/useScreenNavigation"
import { useAnimationLoop } from "./hooks/useAnimationLoop"
import { usePageTransitions } from "./hooks/usePageTransitions"
import { useSwitcher } from "./hooks/useSwitcher"
import { useSignalLevel } from "./hooks/useSignalLevel"
import { createFrameRenderer } from "./engine/createFrameRenderer"
import { renderDevice } from "./components/renderDevice"
import { renderScenes } from "./components/renderScenes"
import { registerPropertyControls } from "./integrations/framer/propertyControls"

function first(node: ReactNode): ReactElement | null {
    const arr = Children.toArray(node)
    return (arr[0] as ReactElement) || null
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 820
 * @framerDisableUnlink
 */
export default function FoldfolioDevice(props: FoldfolioProps) {
    const {
        ref: navigationRef,
        mode,
        scene: sceneProp,
        finish: finishProp,
        customFinish,
        screenColor,
        switcher,
        status,
        layout,
        motion,
        preview,
    } = props
    const isCanvas =
        RenderTarget.current() === RenderTarget.canvas ||
        RenderTarget.current() === RenderTarget.thumbnail

    // ---------- viewport + orientation
    const rootRef = useRef<HTMLDivElement>(null)
    // Seen visits have no curtain to hide a later correction from placeholder geometry.
    const [vp, setVp] = useState(() => ({
        w: typeof window === "undefined" ? 1200 : window.innerWidth,
        h: isCanvas || typeof window === "undefined" ? 820 : window.innerHeight,
    }))
    useIsoLayoutEffect(() => {
        if (typeof window === "undefined") return
        const measure = () => {
            const w = rootRef.current
                ? rootRef.current.offsetWidth || window.innerWidth
                : window.innerWidth
            const h = isCanvas ? 820 : window.innerHeight
            startTransition(() =>
                setVp((p) => {
                    // ignore small height-only jumps (mobile address bar) to avoid layout jumps
                    if (
                        !isCanvas &&
                        p.w === w &&
                        Math.abs(p.h - h) < 110 &&
                        w < 900
                    )
                        return p
                    return p.w === w && p.h === h ? p : { w, h }
                })
            )
        }
        measure()
        window.addEventListener("resize", measure)
        const ro =
            typeof ResizeObserver !== "undefined"
                ? new ResizeObserver(measure)
                : null
        if (ro && rootRef.current) ro.observe(rootRef.current)
        return () => {
            window.removeEventListener("resize", measure)
            if (ro) ro.disconnect()
        }
    }, [isCanvas])

    const port =
        layout.orientation === "portrait" ||
        (layout.orientation === "auto" &&
            (vp.w < layout.portraitBelow || vp.w / vp.h < 0.85))
    const G = port ? GEO.portrait : GEO.landscape
    const b = G.f + G.bz
    const Ws = G.W - 2 * b // full screen width
    const Hs = G.H - 2 * b // full screen height
    const halfW = port ? Ws : G.W / 2 - b // one half-screen
    const halfH = port ? G.H / 2 - b : Hs
    const land = !port
    const rad = (tl: number, tr: number, br: number, bl: number) =>
        `${tl}px ${tr}px ${br}px ${bl}px`
    const Ro = G.R
    // corners per piece: outer corners rounded, hinge side square (the halves meet there)
    const cLeaf = land ? rad(Ro, 0, 0, Ro) : rad(Ro, Ro, 0, 0)
    const cRight = land ? rad(0, Ro, Ro, 0) : rad(0, 0, Ro, Ro)
    const cAll = rad(Ro, Ro, Ro, Ro)
    const inner = (r: string, off: number) =>
        r
            .split(" ")
            .map((v) =>
                parseFloat(v) > 0
                    ? Math.max(0, parseFloat(v) - off) + "px"
                    : "0px"
            )
            .join(" ")

    // ---------- style (scene + finish), shared across pages through localStorage
    const [pick, setPick] = useState<{ scene: Scene; finish: Finish }>({
        scene: sceneProp,
        finish: finishProp,
    })
    useEffect(() => {
        if (typeof window === "undefined" || isCanvas || !switcher.show) {
            setPick({ scene: sceneProp, finish: finishProp })
            return
        }
        const sync = () => {
            const s = readStore()
            startTransition(() =>
                setPick({
                    scene: s.scene || sceneProp,
                    finish: s.finish || finishProp,
                })
            )
        }
        sync()
        window.addEventListener(STORE_EVENT, sync)
        window.addEventListener("storage", sync)
        return () => {
            window.removeEventListener(STORE_EVENT, sync)
            window.removeEventListener("storage", sync)
        }
    }, [sceneProp, finishProp, switcher.show, isCanvas])
    const choose = (p: Partial<{ scene: Scene; finish: Finish }>) => {
        const next = { ...pick, ...p }
        setPick(next)
        try {
            window.localStorage.setItem(STORE_KEY, JSON.stringify(next))
            window.dispatchEvent(new Event(STORE_EVENT))
        } catch {}
    }
    const scene = pick.scene
    const F = finishColors(pick.finish, customFinish)

    // ---------- scale to fit the stage
    const stageH = vp.h
    const availH = Math.max(
        200,
        stageH -
            layout.top -
            (switcher.show
                ? Math.max(layout.bottom, switcher.bottom + 64)
                : layout.bottom)
    )
    const availW = vp.w * (port ? 0.94 : 0.9)
    const s = Math.min(availW / G.W, availH / G.H, layout.maxScale)
    // the hinge sits on whole screen pixels (no blurred seam between the two halves)
    const cy = Math.round(layout.top + availH / 2)
    const cx = Math.round(vp.w / 2)
    const hingeBleed = 1 // cover the clipped screen's compositor edge; hardware still meets at the hinge

    // ---------- slots
    const screenNode = first(
        port && first(props.screenPortrait)
            ? props.screenPortrait
            : props.screen
    )
    const screenInteractiveNode = first(
        port && first(props.screenInteractivePortrait)
            ? props.screenInteractivePortrait
            : props.screenInteractive
    )
    const coverNode = first(
        port && first(props.coverPortrait) ? props.coverPortrait : props.cover
    )
    const callNode = first(
        port && first(props.callPortrait) ? props.callPortrait : props.call
    )
    const navNode = first(
        port && first(props.navPortrait) ? props.navPortrait : props.nav
    )
    const screenOverlayNode = first(
        port && first(props.screenOverlayPortrait)
            ? props.screenOverlayPortrait
            : props.screenOverlay
    )
    const nameL = first(props.nameLeft)
    const nameR = first(props.nameRight)

    // ---------- measure the Screen content height
    const measureRef = useRef<HTMLDivElement>(null)
    const [contentH, setContentH] = useState(Hs)
    // the stage gets the page's own background colour: an opaque stage lets the browser skip
    // drawing the page underneath it (less graphics memory, no half-drawn frames)
    const [pageBg, setPageBg] = useState("")
    useEffect(() => {
        if (isCanvas || typeof window === "undefined" || !rootRef.current)
            return
        let el: HTMLElement | null = rootRef.current.parentElement
        let bg = ""
        while (el) {
            const c = window.getComputedStyle(el).backgroundColor
            const m = c.match(/[\d.]+/g)
            if (m && (m.length < 4 || +m[3] >= 0.99)) {
                bg = c
                break
            }
            el = el.parentElement
        }
        startTransition(() => setPageBg(bg || "#ffffff"))
    }, [isCanvas])
    useIsoLayoutEffect(() => {
        const el = measureRef.current
        if (!el) return
        const upd = () => {
            const h = el.offsetHeight
            startTransition(() =>
                setContentH((p) => (p === (h || Hs) ? p : h || Hs))
            )
        }
        upd()
        // images and CMS content can settle late: measure again a few times
        const ts = [200, 800, 2000].map((d) => window.setTimeout(upd, d))
        const ro =
            typeof ResizeObserver !== "undefined"
                ? new ResizeObserver(upd)
                : null
        if (ro) ro.observe(el)
        return () => {
            ts.forEach((t) => window.clearTimeout(t))
            if (ro) ro.disconnect()
        }
    }, [Hs, port, mode, props.screenNavigation?.key, !!screenInteractiveNode])
    const innerMax = Math.max(0, contentH - Hs)

    // ---------- scroll phases (page pixels)
    const U1 = mode === "fold" ? stageH * motion.openLength : 0
    const U2 = mode === "fold" ? stageH * motion.closeLength : 0
    const U3 = mode === "fold" ? stageH * motion.holdLength : 0
    const innerPx = innerMax * s // scroll distance that moves the content at natural speed
    const totalH = isCanvas ? 820 : stageH + U1 + innerPx + U2 + U3

    // ---------- names (Split scene): measure natural sizes
    const nlRef = useRef<HTMLDivElement>(null)
    const nrRef = useRef<HTMLDivElement>(null)
    const [nameSize, setNameSize] = useState({ lw: 1, lh: 1, rw: 1, rh: 1 })
    useEffect(() => {
        if (typeof ResizeObserver === "undefined") return
        const upd = () => {
            const l = nlRef.current,
                r = nrRef.current
            // natural size of the name frames (robust even when the frame reports 0)
            const size = (el: HTMLElement | null) => {
                if (!el) return { w: 1, h: 1 }
                let w = Math.max(el.offsetWidth, el.scrollWidth)
                let h = Math.max(el.offsetHeight, el.scrollHeight)
                el.querySelectorAll("*").forEach((c) => {
                    const e = c as HTMLElement
                    w = Math.max(w, e.offsetWidth || 0)
                    h = Math.max(h, e.offsetHeight || 0)
                })
                return { w: Math.max(1, w), h: Math.max(1, h) }
            }
            const a = size(l),
                b3 = size(r)
            const n = { lw: a.w, lh: a.h, rw: b3.w, rh: b3.h }
            startTransition(() =>
                setNameSize((p) =>
                    p.lw === n.lw &&
                    p.lh === n.lh &&
                    p.rw === n.rw &&
                    p.rh === n.rh
                        ? p
                        : n
                )
            )
        }
        upd()
        const ts = [300, 1200].map((d) => window.setTimeout(upd, d))
        const ro = new ResizeObserver(upd)
        if (nlRef.current) ro.observe(nlRef.current)
        if (nrRef.current) ro.observe(nrRef.current)
        return () => {
            ts.forEach((t) => window.clearTimeout(t))
            ro.disconnect()
        }
    }, [scene, nameL, nameR])

    // ---------- the animation loop (direct DOM writes, no re-render per frame)
    const R = useDeviceRefs()
    const imgs = (props.sceneImages || []).filter((x) => x && x.src)
    const glowCur = useRef("")
    const glowFlip = useRef(0)
    // images for Glow / Orbit: your Scene Images, or (automatically) the images in the Screen
    const autoImgs = useRef<{ src: string; top: number }[]>([])
    const sceneList = () =>
        imgs.length
            ? imgs.map((x, i) => ({ src: x.src, top: i * 600 }))
            : autoImgs.current

    const geo = useRef<GeometryState>({
        port,
        G,
        s,
        U1,
        U2,
        U3,
        innerMax,
        innerPx,
        stageH,
        vw: vp.w,
        cy,
        halfW,
        halfH,
        Hs,
        scene,
        nameSize,
        imgs,
        mode,
        cRight,
        cAll,
        inner,
    })
    geo.current = {
        port,
        G,
        s,
        U1,
        U2,
        U3,
        innerMax,
        innerPx,
        stageH,
        vw: vp.w,
        cy,
        halfW,
        halfH,
        Hs,
        scene,
        nameSize,
        imgs,
        mode,
        cRight,
        cAll,
        inner,
    }

    // Write a style only when it changes (keeps the browser from re-doing work every frame)
    const cache = useRef<WeakMap<HTMLElement, Record<string, string>>>(
        typeof WeakMap !== "undefined" ? new WeakMap() : (null as any)
    )
    const S = (el: HTMLElement | null | undefined, k: string, v: string) => {
        if (!el) return
        let c = cache.current.get(el)
        if (!c) cache.current.set(el, (c = {}))
        if (c[k] !== v) {
            c[k] = v
            if (k.charCodeAt(0) === 45) el.style.setProperty(k, v)
            else (el.style as any)[k] = v
        }
    }
    const live = useRef<LiveState>({ k: -1, inner: -1, cur: 0, tint: "", bars: null, rc: "", pe: 0 })
    const tintMap = useRef<TintSection[]>([])
    // top-strip brightness of screen images (for the status bar over an image)
    const imgLum = useRef<Record<string, number>>({})
    const topRef = useRef(0)
    const kick = useRef<() => void>(() => {})
    const renderFrame = useRef<(scrolled: number, t: number) => void>(() => {})

    // ---------- screen motion: reveal / image reveal / headline mask / count-up
    const mo: ScreenMotion = Object.assign(
        {},
        MOTION_DEFAULTS,
        props.screenMotion
    )
    const motionOn = mo.on && !isCanvas
    const introCfg = Object.assign(
        { on: true, color: "", line: "rgba(17,17,17,.55)", speed: 1 },
        props.intro
    )
    const introLive = !!introCfg.on && !isCanvas
    const cardW = Math.round(
        Math.min(G.H * s, G.W * s * 1.2) * (port ? 0.17 : 0.15)
    )
    const { paintScenes, sat, drawGlow, measureSat, measureLum } = useSceneImages({
        sceneList, R, cardW, F, glowColors: props.glowColors, glowFlip, glowCur, kick, imgLum,
    })
    const { motionTick, scan, reveals, stepReveals } = useScreenMotion({
        isCanvas, R, autoImgs, measureSat, paintScenes, screenColor, measureLum,
        tintMap, rootRef, topRef, motionOn, mo, kick, live, geo,
    })
    renderFrame.current = createFrameRenderer({
        geo, motion, live, S, R, motionTick, sceneList, sat, glowCur, glowFlip, drawGlow, status,
        tintMap, imgLum, rootRef,
    })
    useEffect(() => {
        glowCur.current = ""
        paintScenes.current()
    }, [scene, imgs.length])
    useEffect(() => {
        if (isCanvas) return
        const a = window.setTimeout(() => scan.current(), 30)
        const b2 = window.setTimeout(() => scan.current(), 700)
        const c = window.setTimeout(() => scan.current(), 2000)
        return () => {
            window.clearTimeout(a)
            window.clearTimeout(b2)
            window.clearTimeout(c)
        }
    }, [motionOn, contentH, port, mode, vp.w, screenNode, isCanvas])

    usePagePreload({ isCanvas, rootRef, R })

    useScreenFilters({ isCanvas, rootRef, R, scan, kick })

    const fadeIn = useRef(0)
    const jump = useAnimationLoop({
        rootRef, topRef, R, isCanvas, geo, preview, reveals, fadeIn,
        motion, live, renderFrame, stepReveals, kick,
    })
    const { cancel: cancelSection, reveal: revealScreenElement } =
        useSectionNavigation(navigationRef, rootRef, R, geo, live, jump)
    useScreenNavigationRequest({
        request: props.screenNavigation, rootRef, measureRef, refs: R, geometry: geo,
        live, jump, cancelSection, contentH, setContentH, isCanvas,
    })
    // Navigation remaps the old scroll offset before the new fold geometry can
    // briefly hide an otherwise focused flat screen during viewport resize.
    useIsoLayoutEffect(() => {
        cache.current = new WeakMap()
        live.current.k = -1
        live.current.inner = -1
        live.current.tint = ""
        live.current.bars = null
        live.current.rc = ""
        paintScenes.current()
        renderFrame.current(live.current.cur, performance.now())
        kick.current()
    })

    usePageTransitions({ R, introCfg, geo, isCanvas, introLive, kick, G, fadeIn })
    useIsoLayoutEffect(() => {
        const interactive = R.cInteractive.current
        return () => {
            if (interactive?.contains(document.activeElement))
                R.dev.current?.focus({ preventScroll: true })
        }
    }, [!!screenInteractiveNode, props.screenNavigation?.key])

    // live clock for the status bar
    const [clock, setClock] = useState(status.time)
    const signalLevel = useSignalLevel(status.show && !isCanvas)
    useEffect(() => {
        if (!status.live || typeof window === "undefined" || isCanvas) {
            setClock(status.time)
            return
        }
        const tick = () => {
            const d = new Date()
            startTransition(() =>
                setClock(
                    String(d.getHours()).padStart(2, "0") +
                        ":" +
                        String(d.getMinutes()).padStart(2, "0")
                )
            )
        }
        tick()
        const id = window.setInterval(tick, 15000)
        return () => window.clearInterval(id)
    }, [status.live, status.time, isCanvas])

    const { device } = renderDevice({
        G, b, F, status, port, clock, R, halfW, halfH, Ws, mode, measureRef, screenNode, land,
        inner, screenColor, coverNode, rootRef, live, geo, callNode, cRight, cLeaf, hingeBleed,
        cAll, Ro, Hs, navNode, screenOverlayNode, screenInteractiveNode,
        onInteractiveFocus: (event) => {
            if (event.target instanceof HTMLElement)
                revealScreenElement.current(event.target)
        }, signalLevel,
    })

    const { splitLayer, namesLayer, glowLayer, orbitLayer, curtainBg } = renderScenes({
        props, F, introCfg, scene, pageBg, port, cy, stageH, nameL, nameR, R, nlRef, nameSize,
        nrRef, G, s, cardW,
    })

    const { switcherUI, headerSwitcher } = useSwitcher({ vp, switcher, scene, choose, isCanvas, pick })

    // ---------------------------------------------------------------- render
    return (
        <div
            ref={rootRef}
            className={
                (motionOn ? "ffm-on" : "") +
                (mo.hover && !isCanvas ? " ffm-hover" : "") +
                (motion.glass ? "" : " ffm-lite")
            }
            style={{
                ...props.style,
                position: "relative",
                width: "100%",
                height: totalH,
                ["--ffdur" as any]: mo.duration + "s",
                ["--ffd" as any]: mo.distance + "px",
            }}
        >
            {(motionOn || mo.hover) && !isCanvas && <style>{MOTION_CSS}</style>}
            {!motion.glass && <style>{LITE_CSS}</style>}
            <div
                ref={R.stage}
                style={{
                    position: isCanvas ? "relative" : "sticky",
                    top: 0,
                    width: "100%",
                    height: stageH,
                    overflow: screenInteractiveNode ? "clip" : "hidden",
                    background: pageBg || undefined,
                }}
            >
                <div style={fill}>
                    {splitLayer}
                    <div
                        ref={R.iNames}
                        style={{ ...fill, pointerEvents: "none" }}
                    >
                        {namesLayer}
                    </div>
                    {glowLayer}
                    {orbitLayer}
                </div>
                <div
                    ref={R.rig}
                    style={{
                        ...abs,
                        left: cx,
                        top: cy,
                        width: 0,
                        height: 0,
                        zIndex: 3,
                    }}
                >
                    <div ref={R.iDev} style={{ ...abs, left: 0, top: 0 }}>
                        <div
                            ref={R.wA}
                            style={{
                                ...abs,
                                left: 0,
                                top: 0,
                            }}
                        >
                            <div
                                ref={R.wB}
                                style={{
                                    ...abs,
                                    left: 0,
                                    top: 0,
                                    transform: `scale(${s})`,
                                }}
                            >
                                {device}
                            </div>
                        </div>
                    </div>
                </div>
                {switcherUI}
                {headerSwitcher}
                {introLive && (
                    <div
                        ref={R.iCur}
                        data-ff-intro=""
                        aria-hidden="true"
                        style={{
                            ...fill,
                            zIndex: 25,
                            pointerEvents: "none",
                            animation: "ffi-safe .4s 4s forwards",
                        }}
                    >
                        <style>{`@keyframes ffi-safe{to{opacity:0;visibility:hidden}}`}</style>
                        <div
                            ref={R.iA}
                            style={{
                                ...abs,
                                background: curtainBg,
                                ...(port
                                    ? {
                                          left: 0,
                                          right: 0,
                                          top: 0,
                                          height: cy + 1,
                                      }
                                    : {
                                          top: 0,
                                          bottom: 0,
                                          left: 0,
                                          width: cx + 1,
                                      }),
                            }}
                        />
                        <div
                            ref={R.iB}
                            style={{
                                ...abs,
                                background: curtainBg,
                                ...(port
                                    ? { left: 0, right: 0, top: cy, bottom: 0 }
                                    : {
                                          top: 0,
                                          bottom: 0,
                                          left: cx,
                                          right: 0,
                                      }),
                            }}
                        />
                        <div
                            ref={R.iSeam}
                            style={{
                                ...abs,
                                background: introCfg.line,
                                ...(port
                                    ? {
                                          left: 0,
                                          right: 0,
                                          top: cy - 0.5,
                                          height: 1,
                                          transform: "scaleX(0)",
                                      }
                                    : {
                                          top: 0,
                                          bottom: 0,
                                          left: cx - 0.5,
                                          width: 1,
                                          transform: "scaleY(0)",
                                      }),
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

FoldfolioDevice.displayName = "Foldfolio Device"
registerPropertyControls(FoldfolioDevice)
