import { useEffect, useRef } from "react"
import type { RefObject } from "react"
import type { DeviceRefs } from "./useDeviceRefs"
import { clamp, easeOut } from "../lib/math"
import type { FoldfolioProps } from "../types"
import type { GeometryState, LiveState, Reveal } from "../engine/types"

// Parent layout effects can call the public ref before this hook's passive setup/replay.
const scrollImmediately = (top: number) => window.scrollTo({ top, behavior: "instant" })

export function useAnimationLoop({
    rootRef, topRef, R, isCanvas, geo, preview, reveals, fadeIn, motion, live, renderFrame, stepReveals, kick,
}: {
    rootRef: RefObject<HTMLDivElement | null>
    topRef: RefObject<number>
    R: DeviceRefs
    isCanvas: boolean
    geo: RefObject<GeometryState>
    preview: number
    reveals: RefObject<Reveal[]>
    fadeIn: RefObject<number>
    motion: FoldfolioProps["motion"]
    live: RefObject<LiveState>
    renderFrame: RefObject<(scrolled: number, t: number) => void>
    stepReveals: (t: number) => boolean
    kick: RefObject<() => void>
}) {
    const jump = useRef<(top: number) => void>(scrollImmediately)
    // scroll → target, smoothed with a frame-rate independent lerp. The loop sleeps when
    // nothing moves, reads window.scrollY (no forced layout) and wakes up on scroll.
    useEffect(() => {
        if (typeof window === "undefined") return
        let raf = 0
        let running = false
        let cur = -1
        let last = 0
        const measureTop = () => {
            const el = rootRef.current
            if (!el) return
            const r = el.getBoundingClientRect()
            topRef.current = r.top + window.scrollY
            // keep the hinge on a whole screen pixel even when the component itself starts
            // at a fractional x (no blurred seam between the halves)
            if (R.rig.current)
                R.rig.current.style.left =
                    (Math.round(r.left + r.width / 2) - r.left).toFixed(2) +
                    "px"
        }
        measureTop()
        const readTarget = () => {
            if (isCanvas) {
                // Canvas: scrub the whole timeline with the "Preview" slider
                const g = geo.current
                const span =
                    g.mode === "fold"
                        ? g.U1 + g.innerPx + g.U2 + g.U3
                        : g.innerPx
                return (clamp(preview, 0, 100) / 100) * span
            }
            return Math.max(0, window.scrollY - topRef.current)
        }
        // only animate (orbit / float) while the device is on screen
        let inView = true
        let io: IntersectionObserver | null = null
        if (typeof IntersectionObserver !== "undefined" && rootRef.current) {
            io = new IntersectionObserver((es) => {
                inView = es.some((e) => e.isIntersecting)
                if (inView) wake()
            })
            io.observe(rootRef.current)
        }
        const needsTime = () => {
            if (isCanvas || !inView) return false
            if (reveals.current.length || fadeIn.current) return true
            const g = geo.current
            if (g.scene === "orbit") return true
            return motion.float && live.current.k > 0.0005
        }
        const loop = (t: number) => {
            const target = readTarget()
            const dt = last ? Math.min(64, t - last) : 16.7
            last = t
            if (cur < 0 || isCanvas) cur = target
            else {
                const a =
                    1 -
                    Math.pow(1 - clamp(motion.smoothing, 0.02, 1), dt / 16.67)
                cur += (target - cur) * a
            }
            if (Math.abs(target - cur) < 0.1) cur = target
            live.current.cur = cur
            renderFrame.current(cur, t)
            stepReveals(t)
            if (fadeIn.current) {
                const p = clamp((t - fadeIn.current) / 420, 0, 1)
                const o = String(+easeOut(p).toFixed(3))
                ;[R.cL.current, R.cR.current, R.cOpen.current].forEach((c) => {
                    if (c) c.style.opacity = o
                })
                if (p >= 1) fadeIn.current = 0
            }
            if (cur !== target || needsTime()) {
                raf = window.requestAnimationFrame(loop)
            } else {
                running = false
                last = 0
            }
        }
        const wake = () => {
            if (document.visibilityState === "hidden") {
                // background tab (no animation frames): just draw the current state
                cur = readTarget()
                live.current.cur = cur
                renderFrame.current(cur, performance.now())
                stepReveals(performance.now() + 1e9)
                if (fadeIn.current) {
                    fadeIn.current = 0
                    ;[R.cL.current, R.cR.current, R.cOpen.current].forEach(
                        (c) => {
                            if (c) c.style.opacity = "1"
                        }
                    )
                }
                return
            }
            if (running) return
            running = true
            raf = window.requestAnimationFrame(loop)
        }
        kick.current = wake
        // Section transitions jump both the browser and the loop's private smoother together.
        jump.current = (top) => {
            window.scrollTo({ top, behavior: "instant" })
            cur = readTarget()
            window.cancelAnimationFrame(raf)
            last = 0
            running = false
            if (document.visibilityState === "hidden") wake()
            else {
                running = true
                loop(performance.now())
            }
        }
        const onResize = () => {
            measureTop()
            wake()
        }
        // first paint before the loop starts (also covers static renderers)
        cur = readTarget()
        live.current.cur = cur
        renderFrame.current(cur, performance.now())
        wake()
        window.addEventListener("scroll", wake, { passive: true })
        window.addEventListener("resize", onResize)
        document.addEventListener("visibilitychange", wake)
        const iv = window.setTimeout(measureTop, 1200)
        return () => {
            window.cancelAnimationFrame(raf)
            jump.current = scrollImmediately
            running = false
            if (io) io.disconnect()
            window.clearTimeout(iv)
            window.removeEventListener("scroll", wake)
            window.removeEventListener("resize", onResize)
            document.removeEventListener("visibilitychange", wake)
        }
    }, [isCanvas, preview, motion.smoothing, motion.float])
    return jump
}
