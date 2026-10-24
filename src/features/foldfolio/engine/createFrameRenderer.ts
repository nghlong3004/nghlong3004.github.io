import type { RefObject } from "react"
import type { DeviceRefs } from "../hooks/useDeviceRefs"
import type { FoldfolioProps } from "../types"
import type { GeometryState, LiveState, StyleWriter, SceneImage, TintSection } from "./types"
import { clamp, eio, eo } from "../lib/math"

export function createFrameRenderer({
    geo, motion, live, S, R, motionTick, sceneList, sat, glowCur, glowFlip, drawGlow, status,
    tintMap, imgLum, rootRef,
}: {
    geo: RefObject<GeometryState>
    motion: FoldfolioProps["motion"]
    live: RefObject<LiveState>
    S: StyleWriter
    R: DeviceRefs
    motionTick: RefObject<(inner: number, pe: number) => void>
    sceneList: () => SceneImage[]
    sat: RefObject<Record<string, number>>
    glowCur: RefObject<string>
    glowFlip: RefObject<number>
    drawGlow: (canvas: HTMLCanvasElement, src: string) => void
    status: FoldfolioProps["status"]
    tintMap: RefObject<TintSection[]>
    imgLum: RefObject<Record<string, number>>
    rootRef: RefObject<HTMLDivElement | null>
}) {
    return (sc: number, t: number) => {
        const g = geo.current
        const { G: Gd, port: P } = g
        let p1 = 1,
            p3 = 0,
            inner = 0
        if (g.mode === "fold") {
            p1 = g.U1 > 0 ? clamp(sc / (g.U1 * 0.9), 0, 1) : 1
            inner = clamp((sc - g.U1) / (g.s || 1), 0, g.innerMax)
            p3 =
                g.U2 > 0
                    ? clamp(
                          (sc - g.U1 - g.innerPx - g.U2 * 0.08) / (g.U2 * 0.92),
                          0,
                          1
                      )
                    : 0
        } else {
            inner = clamp(sc / (g.s || 1), 0, g.innerMax)
        }
        const pe = g.mode === "fold" ? eio(p1) * (1 - eio(p3)) : 1 // 1 = fully open
        const k = +(1 - pe).toFixed(4) // 1 = fully closed
        const th = 180 * k
        const sn = Math.sin((th * Math.PI) / 180)
        const fl = motion.float && k > 0 ? Math.sin(t / 1500) * 5 * k : 0
        const flat = k < 0.003 // (almost) fully open: leave 3D mode (much lighter to draw)
        const L = live.current
        const kChanged = L.k !== k
        L.k = k
        L.pe = pe

        // ---- device (only when the fold state or the idle float changes)
        if (kChanged || fl) {
            // closed: slide so the closed phone sits in the middle (plain 2D move)
            S(
                R.dev.current,
                "transform",
                flat
                    ? "none"
                    : P
                      ? `translate(0px, ${((-k * Gd.H) / 4 + fl).toFixed(2)}px)`
                      : `translate(${((-k * Gd.W) / 4).toFixed(2)}px, ${fl.toFixed(2)}px)`
            )
        }
        if (kChanged) {
            const PP = 2800
            const front = th < 90
            const leaf = R.leaf.current,
                cover = R.cover.current
            // left half: visible until it is edge-on, then the cover takes over
            S(leaf, "visibility", front ? "visible" : "hidden")
            S(
                leaf,
                "transform",
                th < 0.2
                    ? "none"
                    : `perspective(${PP}px) ${P ? `rotateX(${(-th).toFixed(3)}deg)` : `rotateY(${th.toFixed(3)}deg)`}`
            )
            S(cover, "visibility", front ? "hidden" : "visible")
            S(
                cover,
                "transform",
                th > 179.8
                    ? "none"
                    : `perspective(${PP}px) ${P ? `rotateX(${(180 - th).toFixed(3)}deg)` : `rotateY(${(th - 180).toFixed(3)}deg)`}`
            )
            // right half is fully covered when closed: skip drawing it
            S(R.rightH.current, "visibility", th > 176 ? "hidden" : "visible")
            // right half: hinge corners square while the left half lies next to it, rounded
            // while the cover is on top of it (otherwise they would peek out around the cover)
            const rc = front ? g.cRight : g.cAll
            if (L.rc !== rc) {
                L.rc = rc
                S(R.rBody.current, "borderRadius", rc)
                S(R.rGlass.current, "borderRadius", g.inner(rc, Gd.f))
                S(R.rScreen.current, "borderRadius", g.inner(rc, Gd.f + Gd.bz))
                S(R.shR.current, "borderRadius", rc)
            }
            const hide = g.mode === "fold" && k > 0.985 ? "hidden" : "inherit"
            S(R.cL.current, "visibility", hide)
            S(R.cR.current, "visibility", hide)
            // shading while it turns (fades out quickly near open)
            const a = th / 90
            S(
                R.shF.current,
                "opacity",
                String(front ? +(Math.pow(a, 1.6) * 0.8).toFixed(3) : 0)
            )
            S(
                R.shB.current,
                "opacity",
                String(!front ? +(Math.pow(2 - a, 1.6) * 0.7).toFixed(3) : 0)
            )
            S(
                R.shR.current,
                "opacity",
                String(+(Math.pow(sn, 1.8) * 0.5).toFixed(3))
            )
            // nav + status overlay only when the device is flat open
            const o = clamp((pe - 0.975) * 40, 0, 1)
            S(R.overlay.current, "opacity", String(+o.toFixed(3)))
            S(R.overlay.current, "visibility", o > 0.01 ? "visible" : "hidden")
            S(R.creaseL.current, "opacity", flat ? "0" : "1")
            S(R.creaseR.current, "opacity", flat ? "0" : "1")
            const interactiveStatus = R.statusInteractive?.current
            if (interactiveStatus) {
                S(interactiveStatus, "visibility", flat ? "visible" : "hidden")
                if (interactiveStatus.getAttribute("aria-hidden") !== String(!flat))
                    interactiveStatus.setAttribute("aria-hidden", String(!flat))
            }
            const screenOverlay = R.screenOverlay.current
            if (screenOverlay) {
                S(screenOverlay, "visibility", flat ? "visible" : "hidden")
                if (screenOverlay.inert === flat) screenOverlay.inert = !flat
                if (screenOverlay.getAttribute("aria-hidden") !== String(!flat))
                    screenOverlay.setAttribute("aria-hidden", String(!flat))
            }
            const interactive = R.cInteractive?.current
            if (interactive) {
                if (!flat && interactive.contains(document.activeElement))
                    R.dev.current?.focus({ preventScroll: true })
                S(interactive, "visibility", flat ? "visible" : "hidden")
                if (!flat) {
                    interactive.setAttribute("data-ff-fold-inert", "")
                    if (!interactive.inert) interactive.inert = true
                } else if (interactive.hasAttribute("data-ff-fold-inert")) {
                    interactive.removeAttribute("data-ff-fold-inert")
                    interactive.inert = false
                }
                if (interactive.getAttribute("aria-hidden") !== String(!flat))
                    interactive.setAttribute("aria-hidden", String(!flat))
            }
            // floor shadows (transform only)
            const vis = P ? 1 : 0.5 + 0.5 * pe
            const tx = P ? 0 : (Gd.W / 4) * k
            const sh = `translateX(-50%) translateX(${tx.toFixed(1)}px) scaleX(${vis.toFixed(4)})`
            S(R.shadow.current, "transform", sh)
            S(R.shadowC.current, "transform", sh)
            if (R.call.current) {
                const on = clamp((p3 - 0.02) * 6, 0, 1)
                S(R.call.current, "opacity", String(+on.toFixed(3)))
                S(R.call.current, "pointerEvents", on > 0.5 ? "auto" : "none")
                const hidden = on <= 0.5
                if (R.call.current.inert !== hidden) R.call.current.inert = hidden
                if (R.call.current.getAttribute("aria-hidden") !== String(hidden)) R.call.current.setAttribute("aria-hidden", String(hidden))
            }
        }

        // ---- content
        if (L.inner !== inner || kChanged) {
            // moved with `top`, not a transform: a transform inside the turning half would
            // make the browser keep the whole (very tall) content as a separate layer
            const y = (-inner).toFixed(2)
            S(R.cL.current, "top", y + "px")
            S(
                R.cR.current,
                "top",
                (P ? -g.halfH - inner : -inner).toFixed(2) + "px"
            )
            S(R.cOpen.current, "top", y + "px")
            S(R.cInteractive?.current, "top", y + "px")
            L.inner = inner
            motionTick.current(inner, pe)
        }

        // ---- scenes
        const vw = g.vw
        const DW = Gd.W * g.s,
            DH = Gd.H * g.s
        if (g.scene === "split" && kChanged && R.nmL.current && R.nmR.current) {
            const ns = g.nameSize
            const nl = R.nmL.current,
                nr = R.nmR.current
            if (!P) {
                const closedW = DW / 2
                const side = (vw - closedW) / 2
                const tuck = closedW * 0.06 // slide a little behind the device: no gap
                const maxH = g.stageH * 0.42
                const sl = Math.min(
                    (side - vw * 0.03 + tuck) / ns.lw,
                    maxH / ns.lh
                )
                const sr = Math.min(
                    (side - vw * 0.03 + tuck) / ns.rw,
                    maxH / ns.rh
                )
                const push = closedW / 2 - tuck + (vw * 0.22 + DW / 4) * eo(pe)
                S(
                    nl,
                    "transform",
                    `translate(calc(${(vw / 2 - push).toFixed(1)}px - 100%), ${g.cy}px) translateY(-50%) scale(${sl.toFixed(4)})`
                )
                S(nl, "transformOrigin", "100% 50%")
                S(
                    nr,
                    "transform",
                    `translate(${(vw / 2 + push).toFixed(1)}px, ${g.cy}px) translateY(-50%) scale(${sr.toFixed(4)})`
                )
                S(nr, "transformOrigin", "0% 50%")
            } else {
                const closedH = DH / 2
                const space = (g.stageH - closedH) / 2
                const sl = Math.min((vw * 0.86) / ns.lw, (space * 0.62) / ns.lh)
                const sr = Math.min((vw * 0.86) / ns.rw, (space * 0.62) / ns.rh)
                const off = closedH / 2 + space * 0.1
                // Balance visible capitals, not the name frames' unused descender space.
                const nameCy = g.cy + space * 0.075
                const slide = vw * 0.8 * eo(pe)
                S(
                    nl,
                    "transform",
                    `translate(calc(${(vw / 2 - slide).toFixed(1)}px - 50%), calc(${nameCy - off}px - 100%)) scale(${sl.toFixed(4)})`
                )
                S(nl, "transformOrigin", "50% 100%")
                S(
                    nr,
                    "transform",
                    `translate(calc(${(vw / 2 + slide).toFixed(1)}px - 50%), ${nameCy + off}px) scale(${sr.toFixed(4)})`
                )
                S(nr, "transformOrigin", "50% 0%")
            }
            const op = String(+(1 - pe * 0.9).toFixed(3))
            S(nl, "opacity", op)
            S(nr, "opacity", op)
        }
        if (g.scene === "glow" && R.glow.current) {
            const list = sceneList()
            if (list.length) {
                // closed: the most colourful image; open: the colourful image nearest the middle
                const sv = (src: string) =>
                    sat.current[src] === undefined ? 0.3 : sat.current[src]
                let want = list[0].src
                if (pe > 0.35 && p3 < 0.5) {
                    const mid = inner + g.Hs / 2
                    let best = Infinity
                    for (const it of list) {
                        const d =
                            Math.abs(it.top - mid) +
                            (sv(it.src) < 0.16 ? 2500 : 0)
                        if (d < best) {
                            best = d
                            want = it.src
                        }
                    }
                } else {
                    let best = -1
                    for (const it of list) {
                        if (sv(it.src) > best) {
                            best = sv(it.src)
                            want = it.src
                        }
                    }
                }
                if (want !== glowCur.current) {
                    glowCur.current = want
                    glowFlip.current = 1 - glowFlip.current
                    const f = glowFlip.current
                    ;[R.glow.current, R.glowR.current].forEach((box) => {
                        if (!box) return
                        const kids = box.children
                        const a = kids[f] as HTMLCanvasElement,
                            b2 = kids[1 - f] as HTMLCanvasElement
                        if (a) {
                            drawGlow(a, want)
                            a.style.opacity = "1"
                        }
                        if (b2) b2.style.opacity = "0"
                    })
                }
            }
            if (kChanged) {
                const gs = P ? 1 : 0.55 + 0.45 * pe
                S(
                    R.glow.current,
                    "transform",
                    `translate(-50%, -50%) scaleX(${gs.toFixed(4)})`
                )
                S(
                    R.glow.current,
                    "opacity",
                    String(+(0.75 + 0.2 * pe).toFixed(3))
                )
                S(
                    R.glowR.current,
                    "transform",
                    `translateX(-50%) scaleX(${gs.toFixed(4)}) scaleY(-1)`
                )
                S(
                    R.glowR.current,
                    "opacity",
                    String(+(0.3 + 0.25 * pe).toFixed(3))
                )
            }
        }
        // ---- status bar auto tint: look up the section under it (precomputed, no layout reads)
        if (
            status.tone !== "light" &&
            status.tone !== "dark" &&
            tintMap.current.length
        ) {
            const y = inner + 14
            let sec = tintMap.current[0]
            for (const s of tintMap.current) {
                if (s.top <= y) sec = s
                else break
            }
            const IL = imgLum.current
            const lum =
                sec.src && IL[sec.src] !== undefined ? IL[sec.src] : sec.lum
            const lumR =
                sec.srcR && IL[sec.srcR] !== undefined ? IL[sec.srcR] : sec.lumR
            // only the status bars change colour (a variable on the root would restyle everything)
            const colL = lum > 0.6 ? "#111" : "#fff"
            const colR = lumR > 0.6 ? "#111" : "#fff"
            const key = colL + colR
            if (L.tint !== key || !L.bars) {
                L.tint = key
                L.bars = rootRef.current
                    ? (Array.from(
                          rootRef.current.querySelectorAll("[data-ffsb]")
                      ) as HTMLElement[])
                    : []
                L.bars.forEach((el) => {
                    const ink = el.dataset.ffsb === "right" ? colR : colL
                    el.style.color = ink
                    el.style.setProperty("--ffsb-contrast", ink === "#111" ? "#fff" : "#111")
                    // one bar across an open landscape screen: its right group (5G, battery) follows the right side
                    if (el.dataset.ffsb === "all" && !P) {
                        const r = el.lastElementChild as HTMLElement | null
                        if (r) {
                            r.style.color = colR
                            r.style.setProperty("--ffsb-contrast", colR === "#111" ? "#fff" : "#111")
                        }
                    }
                })
            }
        }
        if (g.scene === "orbit" && R.orbit.current) {
            const cards = R.orbit.current.children
            let n = cards.length
            while (
                n > 1 &&
                (cards[n - 1] as HTMLElement).style.display === "none"
            )
                n--
            // closed: a tight ring around the phone; open: a wide ring that peeks around the display
            const rx = P
                ? vw * (0.5 + 0.06 * pe)
                : DW * (0.2 + 0.38 * k + 0.42 * pe)
            const ry = P
                ? g.stageH * (0.34 + 0.1 * pe)
                : DH * (0.2 + 0.26 * k + 0.34 * pe)
            for (let i = 0; i < n; i++) {
                const c = cards[i] as HTMLElement
                const a = t * 0.00012 + (i * Math.PI * 2) / n
                const z = Math.cos(a)
                const x = Math.sin(a) * rx
                const y =
                    g.cy + z * ry * 0.9 + Math.sin(a * 2 + i * 1.7) * DH * 0.03
                const scl =
                    (0.72 + (0.38 * (z + 1)) / 2) *
                    (0.55 + 0.45 * k + 0.25 * pe)
                c.style.transform = `translate3d(${(vw / 2 + x).toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scl.toFixed(3)}) rotate(${(Math.sin(a + i) * 8).toFixed(2)}deg)`
                S(c, "zIndex", z > 0 && k > 0.5 ? "4" : "2")
                S(
                    c,
                    "opacity",
                    String(
                        +(
                            (z > 0 ? 1 : 0.5 + 0.5 * (z + 1)) *
                            (0.85 + 0.15 * k)
                        ).toFixed(2)
                    )
                )
            }
        }
    }
}
