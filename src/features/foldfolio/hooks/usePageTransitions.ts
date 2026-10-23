import { useEffect, useRef } from "react"
import type { RefObject } from "react"
import type { DeviceRefs } from "./useDeviceRefs"
import { useIsoLayoutEffect } from "./useIsoLayoutEffect"
import { SNAP_ID, takeSnapshot, releaseSnapshot } from "../engine/snapshots"
import type { GeometryState, Geometry, IntroConfig } from "../engine/types"

export function usePageTransitions({
    R, introCfg, geo, isCanvas, introLive, kick, G, fadeIn,
}: {
    R: DeviceRefs
    introCfg: IntroConfig
    geo: RefObject<GeometryState>
    isCanvas: boolean
    introLive: boolean
    kick: RefObject<() => void>
    G: Geometry
    fadeIn: RefObject<number>
}) {
    // page change: the device stays where it is, only the screen content fades in (driven
    // from the loop, so nothing is animated by the compositor)
    const adopted = useRef(false)
    // ---------- opening animation: a seam of light, the page parts along the fold,
    // your name rises, then the phone lifts into place and the controls settle.
    // Pure 2D (translate / scale / rotate / opacity) stepped from rAF; everything is
    // reset to the normal state at the end.
    const playIntro = () => {
        const cur = R.iCur.current,
            a = R.iA.current,
            b = R.iB.current,
            seam = R.iSeam.current
        const dev = R.iDev.current,
            nm = R.iNames.current
        if (!cur || !a || !b || !seam || !dev) return
        cur.style.animation = "none"
        const sp = 1 / Math.max(0.4, Math.min(2, introCfg.speed || 1))
        const D = (ms: number) => ms * sp
        const cl = (v: number) => Math.min(1, Math.max(0, v))
        const o3 = (k: number) => 1 - Math.pow(1 - k, 3)
        const o4 = (k: number) => 1 - Math.pow(1 - k, 4)
        const o5 = (k: number) => 1 - Math.pow(1 - k, 5)
        const dots = () =>
            R.stage.current
                ? (R.stage.current.querySelector(
                      "[data-ff-dots]"
                  ) as HTMLElement | null)
                : null
        const head = () =>
            document.querySelector("[data-ff-switcher]") as HTMLElement | null
        let done = false
        // no name beside the phone (inner pages): the phone comes in sooner
        const early = nm && nm.textContent && nm.textContent.trim() ? 0 : 280
        const set = (t: number) => {
            const k = (x: number, y: number) => cl((t - D(x)) / (D(y) - D(x)))
            const P = geo.current.port
            const vh = window.innerHeight,
                vw = window.innerWidth
            const ks = o3(k(0, 560))
            seam.style.transform = P
                ? `scaleX(${ks.toFixed(4)})`
                : `scaleY(${ks.toFixed(4)})`
            seam.style.opacity = String(+(1 - k(760, 1060)).toFixed(3))
            const kc = o4(k(460, 1320))
            const far = (P ? vh : vw) / 2 + 4
            a.style.transform = P
                ? `translateY(${(-kc * far).toFixed(1)}px)`
                : `translateX(${(-kc * far).toFixed(1)}px)`
            b.style.transform = P
                ? `translateY(${(kc * far).toFixed(1)}px)`
                : `translateX(${(kc * far).toFixed(1)}px)`
            if (nm) {
                const kn = o4(k(560, 1500))
                nm.style.opacity = String(+kn.toFixed(3))
                nm.style.translate = `0 ${((1 - kn) * 56).toFixed(1)}px`
            }
            const kd = k(820 - early, 2000 - early),
                e = o5(kd)
            dev.style.opacity = String(+cl(kd * 3).toFixed(3))
            dev.style.transform = `translateY(${((1 - e) * vh * 0.5).toFixed(1)}px) rotate(${((1 - e) * -5).toFixed(3)}deg) scale(${(0.82 + 0.18 * e).toFixed(4)})`
            const ku = o3(k(1600, 2250))
            ;[dots(), head()].forEach((el) => {
                if (!el) return
                el.style.opacity = String(+ku.toFixed(3))
                el.style.translate = `0 ${((1 - ku) * 14).toFixed(1)}px`
            })
        }
        const end = () => {
            if (done) return
            done = true
            cur.style.display = "none"
            dev.style.transform = ""
            dev.style.opacity = ""
            if (nm) {
                nm.style.opacity = ""
                nm.style.translate = ""
            }
            ;[dots(), head()].forEach((el) => {
                if (!el) return
                el.style.opacity = ""
                el.style.translate = ""
            })
            window.removeEventListener("scroll", onScroll)
            document.removeEventListener("visibilitychange", end)
        }
        const onScroll = () => {
            if (window.scrollY > 60) end()
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        document.addEventListener("visibilitychange", end)
        set(0)
        const t0 = performance.now()
        const total = D(2300)
        const step = (now: number) => {
            if (done) return
            const t = now - t0
            set(t)
            if (t < total) window.requestAnimationFrame(step)
            else end()
        }
        window.requestAnimationFrame(step)
        window.setTimeout(end, total + 1500)
    }
    useIsoLayoutEffect(() => {
        if (isCanvas || typeof window === "undefined") return
        let seen = false
        try {
            seen = window.sessionStorage.getItem("ff-seen") === "1"
            window.sessionStorage.setItem("ff-seen", "1")
        } catch {}
        // opening animation: only on the first page of a visit, at the top, in a visible tab
        {
            const reduced =
                window.matchMedia &&
                window.matchMedia("(prefers-reduced-motion: reduce)").matches
            const run =
                introLive &&
                !seen &&
                !document.getElementById(SNAP_ID) &&
                document.visibilityState === "visible" &&
                window.scrollY < 40 &&
                !reduced
            if (run) playIntro()
            else if (R.iCur.current) R.iCur.current.style.display = "none"
        }
        if (document.getElementById(SNAP_ID)) {
            // the previous page left a still copy of itself on top: this page draws at full
            // opacity underneath and the copy fades out once the screen is ready
            adopted.current = true
            return
        }
        if (seen) {
            // before the first paint: content hidden, then the loop fades it in
            ;[R.cL.current, R.cR.current, R.cOpen.current].forEach((c) => {
                if (c) c.style.opacity = "0"
            })
            fadeIn.current = performance.now()
            kick.current()
        }
    }, [isCanvas])
    // leaving the page: keep a still copy of the stage on screen for the next page
    useIsoLayoutEffect(() => {
        if (isCanvas || typeof window === "undefined") return
        return () => {
            if (R.stage.current) takeSnapshot(R.stage.current)
        }
    }, [isCanvas])
    useEffect(() => {
        if (!adopted.current || isCanvas || typeof window === "undefined")
            return
        adopted.current = false
        const t0 = Date.now()
        let id = 0
        const check = () => {
            const main = R.cOpen.current || R.cR.current || R.cL.current
            let ready = true
            if (main) {
                const top = main.getBoundingClientRect().top
                main.querySelectorAll("img").forEach((im) => {
                    const i = im as HTMLImageElement
                    if (
                        i.getBoundingClientRect().top - top < G.H * 1.2 &&
                        !(i.complete && i.naturalWidth)
                    )
                        ready = false
                })
            }
            if (ready || Date.now() - t0 > 1200) {
                kick.current()
                if (document.visibilityState === "hidden") releaseSnapshot(0)
                else {
                    // two frames so this page has really painted underneath
                    window.requestAnimationFrame(() =>
                        window.requestAnimationFrame(() => releaseSnapshot(360))
                    )
                    window.setTimeout(() => releaseSnapshot(360), 500)
                }
            } else id = window.setTimeout(check, 40)
        }
        id = window.setTimeout(check, 60)
        return () => window.clearTimeout(id)
    }, [isCanvas])

}
