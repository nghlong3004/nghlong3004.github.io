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
    const adopted = useRef<ReturnType<typeof takeSnapshot>>(undefined)
    const replayIntro = useRef(false)
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
        cur.style.display = ""
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
        let raf = 0
        let timeout = 0
        const controls = new Set<HTMLElement>()
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
                controls.add(el)
                el.style.opacity = String(+ku.toFixed(3))
                el.style.translate = `0 ${((1 - ku) * 14).toFixed(1)}px`
            })
        }
        const end = () => {
            if (done) return
            done = true
            replayIntro.current = false
            window.cancelAnimationFrame(raf)
            window.clearTimeout(timeout)
            cur.style.display = "none"
            a.style.transform = ""
            b.style.transform = ""
            seam.style.transform = ""
            seam.style.opacity = ""
            dev.style.transform = ""
            dev.style.opacity = ""
            if (nm) {
                nm.style.opacity = ""
                nm.style.translate = ""
            }
            controls.forEach((el) => {
                el.style.opacity = ""
                el.style.translate = ""
            })
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", end)
            document.removeEventListener("visibilitychange", end)
        }
        const onScroll = () => {
            if (window.scrollY > 60) end()
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", end)
        document.addEventListener("visibilitychange", end)
        set(0)
        const t0 = performance.now()
        const total = D(2300)
        const step = (now: number) => {
            if (done) return
            const t = now - t0
            set(t)
            if (t < total) raf = window.requestAnimationFrame(step)
            else end()
        }
        raf = window.requestAnimationFrame(step)
        timeout = window.setTimeout(end, total + 1500)
        return () => {
            const interrupted = !done
            end()
            replayIntro.current = interrupted
            return interrupted
        }
    }
    useIsoLayoutEffect(() => {
        if (isCanvas || typeof window === "undefined") return
        let seen = false
        try {
            seen = window.sessionStorage.getItem("ff-seen") === "1"
            window.sessionStorage.setItem("ff-seen", "1")
        } catch {}
        const hidden = document.visibilityState === "hidden"
        const snapshot = document.getElementById(SNAP_ID) as ReturnType<typeof takeSnapshot> | null
        // Same-instance effect replay may retry an unfinished intro; a new seen visit may not.
        const run = introLive && (!seen || replayIntro.current) && !snapshot &&
            !hidden && window.scrollY < 40
        replayIntro.current = false
        const cancelIntro = run ? playIntro() : undefined
        if (!run && R.iCur.current) R.iCur.current.style.display = "none"
        adopted.current = undefined
        if (hidden) {
            fadeIn.current = 0
            ;[R.cL.current, R.cR.current, R.cOpen.current].forEach((c) => {
                if (c) c.style.opacity = "1"
            })
            if (snapshot && !snapshot.__section) releaseSnapshot(0, snapshot)
        } else if (snapshot) {
            // the previous page left a still copy of itself on top: this page draws at full
            // opacity underneath and the copy fades out once the screen is ready
            if (!snapshot.__section) adopted.current = snapshot
        } else if (seen && !run) {
            // before the first paint: content hidden, then the loop fades it in
            ;[R.cL.current, R.cR.current, R.cOpen.current].forEach((c) => {
                if (c) c.style.opacity = "0"
            })
            fadeIn.current = performance.now()
            kick.current()
        }
        return () => {
            // Decide before ending: cleanup must never promote an unfinished curtain to a page snapshot.
            const interrupted = cancelIntro?.() ?? false
            if (!interrupted && R.stage.current) takeSnapshot(R.stage.current)
        }
    }, [isCanvas])
    useEffect(() => {
        const snapshot = adopted.current
        if (!snapshot || isCanvas || typeof window === "undefined")
            return
        adopted.current = undefined
        const t0 = Date.now()
        let id = 0
        let raf = 0
        let fallback = 0
        let cancelled = false
        const release = () => {
            if (!cancelled) releaseSnapshot(360, snapshot)
        }
        const check = () => {
            if (cancelled || !snapshot.isConnected) return
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
                if (document.visibilityState === "hidden") releaseSnapshot(0, snapshot)
                else {
                    // two frames so this page has really painted underneath
                    raf = window.requestAnimationFrame(() => {
                        raf = window.requestAnimationFrame(release)
                    })
                    fallback = window.setTimeout(release, 500)
                }
            } else id = window.setTimeout(check, 40)
        }
        id = window.setTimeout(check, 60)
        return () => {
            cancelled = true
            window.clearTimeout(id)
            window.clearTimeout(fallback)
            window.cancelAnimationFrame(raf)
            releaseSnapshot(0, snapshot)
        }
    }, [isCanvas])

}
