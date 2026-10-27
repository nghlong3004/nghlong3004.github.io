import { useRef } from "react"
import { gsap } from "gsap"
import type { RefObject } from "react"
import type { DeviceRefs } from "./useDeviceRefs"
import { clamp, easeOut } from "../lib/math"
import { toHex } from "../lib/colors"
import { useIsoLayoutEffect } from "./useIsoLayoutEffect"
import type { ScreenMotion } from "../types"
import type { GeometryState, LiveState, MItem, Reveal, SceneImage, TintSection } from "../engine/types"
import { centerOutInsets, collectCompositionGroups } from "../engine/compositionMotion.ts"

export function useScreenMotion({
    isCanvas, R, autoImgs, measureSat, paintScenes, screenColor, measureLum, tintMap, rootRef,
    topRef, motionOn, mo, kick, live, geo,
}: {
    isCanvas: boolean
    R: DeviceRefs
    autoImgs: RefObject<SceneImage[]>
    measureSat: (src: string) => void
    paintScenes: RefObject<() => void>
    screenColor: string
    measureLum: (src: string) => void
    tintMap: RefObject<TintSection[]>
    rootRef: RefObject<HTMLDivElement | null>
    topRef: RefObject<number>
    motionOn: boolean
    mo: ScreenMotion
    kick: RefObject<() => void>
    live: RefObject<LiveState>
    geo: RefObject<GeometryState>
}) {
    const mItems = useRef<MItem[]>([])
    const seen = useRef<WeakSet<HTMLElement>>(
        typeof WeakSet !== "undefined" ? new WeakSet() : (null as any)
    )
    const primed = useRef<WeakSet<HTMLImageElement>>(
        typeof WeakSet !== "undefined" ? new WeakSet() : (null as any)
    )
    const active = useRef(true)
    const epoch = useRef(0)
    const timers = useRef(new Set<number>())
    const frames = useRef(new Set<number>())
    const counters = useRef(new Map<Text, { el: HTMLElement; original: string }>())
    const compositions = useRef(new Map<HTMLElement, ReturnType<typeof gsap.context>>())
    const compositionGroups = useRef(new Map<HTMLElement, HTMLElement>())
    const compositionCounters = useRef(new Map<HTMLElement, HTMLElement>())
    const compositionCounterTimers = useRef(new Map<HTMLElement, number>())
    const compositionTimelines = useRef(new Map<HTMLElement, ReturnType<typeof gsap.timeline>>())
    const consumedEntry = useRef<string | null>(null)
    const entry = useRef<null | {
        screens: HTMLElement[]
        originals: { screen: HTMLElement; clip: string; priority: string; width: number; height: number }[]
        context: ReturnType<typeof gsap.context>
        timeline: ReturnType<typeof gsap.timeline>
        progress: { value: number }
        port: boolean
        inner: number
        height: number
        paintedFull: boolean
    }>(null)
    const releaseEntry = () => {
        const current = entry.current
        if (!current) return
        entry.current = null
        current.context.revert()
        current.originals.forEach(({ screen, clip, priority }) => {
            if (clip) screen.style.setProperty("clip-path", clip, priority)
            else screen.style.removeProperty("clip-path")
        })
        reveals.current.forEach(reveal => { if (current.screens.includes(reveal.el)) reveal.dur = -1 })
        reveals.current = reveals.current.filter(reveal => reveal.dur > 0)
    }
    const armEntry = useRef<() => void>(() => {})
    armEntry.current = () => {
        if (!motionOn || isCanvas || typeof document === "undefined") return
        const roots = [R.cL.current, R.cR.current, R.cOpen.current, R.cInteractive?.current].filter(Boolean) as HTMLElement[]
        const screens = roots.flatMap(root => Array.from(root.querySelectorAll<HTMLElement>('[data-ff-motion="composition"][data-ff-motion-entry]')))
        const token = screens[0]?.getAttribute("data-ff-motion-entry")
        if (!token || token === consumedEntry.current) return
        releaseEntry()
        consumedEntry.current = token
        const g = geo.current
        const progress = { value: 0 }
        let timeline!: ReturnType<typeof gsap.timeline>
        const context = gsap.context(() => {
            timeline = gsap.timeline({ paused: true }).to(progress, { value: 1, duration: mo.duration, ease: easeOut })
        }, rootRef.current || screens[0])
        const current = {
            screens, originals: screens.map(screen => ({ screen, clip: screen.style.getPropertyValue("clip-path"), priority: screen.style.getPropertyPriority("clip-path"), width: screen.offsetWidth, height: screen.offsetHeight })),
            context, timeline, progress, port: g.port, inner: Math.max(0, live.current.inner), height: g.Hs, paintedFull: false,
        }
        entry.current = current
        current.originals.forEach(({ screen, width, height }) => {
            screen.style.clipPath = centerOutInsets(current.port, width, height, current.height, current.inner, 0)
        })
        reveals.current.push({ el: screens[0], img: null, kind: "t", t0: performance.now(), dur: mo.duration * 1000, dist: 0 })
        kick.current()
    }
    const releaseComposition = (screen: HTMLElement) => {
        compositions.current.get(screen)?.revert()
        compositions.current.delete(screen)
        const removed = new Set<HTMLElement>()
        compositionGroups.current.forEach((owner, group) => {
            if (owner !== screen) return
            removed.add(group)
            compositionGroups.current.delete(group)
            compositionTimelines.current.delete(group)
        })
        compositionCounters.current.forEach((owner, counter) => {
            if (owner !== screen) return
            const timer = compositionCounterTimers.current.get(counter)
            if (timer !== undefined) {
                window.clearTimeout(timer)
                timers.current.delete(timer)
                compositionCounterTimers.current.delete(counter)
            }
            removed.add(counter)
            compositionCounters.current.delete(counter)
        })
        mItems.current = mItems.current.filter(item => !removed.has(item.el))
        reveals.current.forEach(reveal => { if (removed.has(reveal.el)) reveal.dur = -1 })
    }
    const forgetCounter = (el: HTMLElement) => {
        counters.current.forEach((counter, node) => {
            if (counter.el === el) counters.current.delete(node)
        })
    }
    const later = (el: HTMLElement, callback: () => void, delay: number) => {
        const id = window.setTimeout(() => {
            timers.current.delete(id)
            if (active.current && el.isConnected) callback()
            else if (!el.isConnected) forgetCounter(el)
        }, delay)
        timers.current.add(id)
        return id
    }
    const nextFrame = (el: HTMLElement, callback: (now: number) => void) => {
        const id = window.requestAnimationFrame((now) => {
            frames.current.delete(id)
            if (active.current && el.isConnected) callback(now)
            else if (!el.isConnected) forgetCounter(el)
        })
        frames.current.add(id)
    }
    const scan = useRef<() => void>(() => {})
    scan.current = () => {
        if (!active.current || typeof document === "undefined" || isCanvas) return
        const generation = epoch.current
        const roots = [R.cL.current, R.cR.current, R.cOpen.current, R.cInteractive?.current].filter(
            Boolean
        ) as HTMLElement[]
        const list: MItem[] = []
        const screens = roots.flatMap(root => Array.from(root.querySelectorAll<HTMLElement>('[data-ff-motion="composition"]')))
        const liveScreens = new Set(screens)
        compositions.current.forEach((_context, screen) => {
            if (screen.isConnected && liveScreens.has(screen)) return
            releaseComposition(screen)
        })
        const topOf = (el: HTMLElement, root: HTMLElement) => {
            let y = 0
            let e: HTMLElement | null = el
            while (e && e !== root) {
                y += e.offsetTop
                e = e.offsetParent as HTMLElement | null
            }
            return y
        }
        // images in the Screen feed the Glow / Orbit backgrounds automatically
        const main = R.cInteractive?.current || R.cOpen.current || R.cR.current || R.cL.current
        if (main) {
            const found: { src: string; top: number }[] = []
            const have = new Set<string>()
            main.querySelectorAll(
                "[data-framer-background-image-wrapper] img"
            ).forEach((im) => {
                const img = im as HTMLImageElement
                const src = img.currentSrc || img.src
                const key = src.split("?")[0]
                const box = img.closest(
                    "[data-framer-background-image-wrapper]"
                ) as HTMLElement
                if (!src || have.has(key) || !box || box.offsetWidth < 120)
                    return
                have.add(key)
                found.push({
                    src,
                    top: topOf(box, main) + box.offsetHeight / 2,
                })
            })
            found.sort((a, b) => a.top - b.top)
            const changed =
                found.map((f) => f.src).join() !==
                autoImgs.current.map((f) => f.src).join()
            autoImgs.current = found
            found.forEach((f) => measureSat(f.src))
            if (changed) paintScenes.current()
        }
        // sections of the Screen and how bright they are (for the status bar tint)
        if (main) {
            const lumOf = (el: Element | null): number => {
                while (el && el !== main.parentElement) {
                    const bg = window.getComputedStyle(el).backgroundColor
                    const m = bg.match(/[\d.]+/g)
                    if (m && (m.length < 4 || +m[3] > 0.5))
                        return (
                            (0.2126 * +m[0] + 0.7152 * +m[1] + 0.0722 * +m[2]) /
                            255
                        )
                    el = el.parentElement
                }
                const n =
                    parseInt(toHex(String(screenColor)).slice(1, 7), 16) || 0
                return (
                    (0.2126 * ((n >> 16) & 255) +
                        0.7152 * ((n >> 8) & 255) +
                        0.0722 * (n & 255)) /
                    255
                )
            }
            const slotRoot = (main.firstElementChild &&
                main.firstElementChild.firstElementChild) as HTMLElement | null
            const secs: {
                top: number
                lum: number
                lumR: number
                src?: string
                srcR?: string
            }[] = []
            // the deepest layer under a point near the top-left / top-right corner of a section
            // (a two-column section can be dark on one side and an image on the other)
            const edge = (
                el: HTMLElement,
                side: "left" | "right"
            ): { lum: number; src?: string } => {
                let cur = el
                const r0 = cur.getBoundingClientRect()
                const px = side === "left" ? r0.left + 24 : r0.right - 24
                const py = r0.top + 18
                for (let d = 0; d < 8; d++) {
                    const kids = Array.from(cur.children) as HTMLElement[]
                    let hit: HTMLElement | null = null
                    for (const k of kids) {
                        if (!k.offsetWidth || !k.offsetHeight) continue
                        const r = k.getBoundingClientRect()
                        if (
                            r.left <= px &&
                            r.right >= px &&
                            r.top <= py &&
                            r.bottom >= py
                        )
                            hit = k
                    }
                    if (!hit) break
                    cur = hit
                    const im =
                        cur.tagName === "IMG" ? (cur as HTMLImageElement) : null
                    if (im && im.currentSrc) {
                        const src = (im.currentSrc || im.src).split("?")[0]
                        measureLum(src)
                        return { lum: lumOf(cur), src }
                    }
                }
                return { lum: lumOf(cur) }
            }
            if (slotRoot) {
                const e0L = edge(slotRoot, "left"),
                    e0R = edge(slotRoot, "right")
                secs.push({
                    top: 0,
                    lum: e0L.lum,
                    lumR: e0R.lum,
                    src: e0L.src,
                    srcR: e0R.src,
                })
                const slotStyle = window.getComputedStyle(slotRoot)
                const surfaceWidth = slotRoot.clientWidth -
                    (parseFloat(slotStyle.paddingLeft) || 0) -
                    (parseFloat(slotStyle.paddingRight) || 0)
                const surfaces = new Set([
                    ...slotRoot.children,
                    ...slotRoot.querySelectorAll("[data-ff-surface]"),
                ])
                surfaces.forEach((c) => {
                    const el = c as HTMLElement
                    if (!el.offsetHeight) return
                    // Keep split-hero edge sampling; padded full-width sections still qualify.
                    let contentWidth = surfaceWidth
                    const parent = el.parentElement
                    if (parent && parent !== slotRoot && parent.clientWidth >= surfaceWidth * 0.9) {
                        const style = window.getComputedStyle(parent)
                        contentWidth = surfaceWidth -
                            (parseFloat(style.paddingLeft) || 0) -
                            (parseFloat(style.paddingRight) || 0)
                    }
                    if (el.hasAttribute("data-ff-surface") &&
                        el.offsetWidth < contentWidth * 0.9) return
                    const eL = edge(el, "left"),
                        eR = edge(el, "right")
                    secs.push({
                        top: topOf(el, main),
                        lum: eL.lum,
                        lumR: eR.lum,
                        src: eL.src,
                        srcR: eR.src,
                    })
                })
            }
            tintMap.current = secs.sort((a, b) => a.top - b.top)
            if (rootRef.current)
                topRef.current =
                    rootRef.current.getBoundingClientRect().top + window.scrollY
        }
        // big type never spills out of the screen: a heading wider than its box wraps
        // (several words) or scales down (one long word), recomputed on every layout
        const fitText = () => {
            const ref = R.cInteractive?.current || R.cOpen.current || R.cR.current || R.cL.current
            if (!ref) return
            const RTC = '[data-framer-component-type="RichTextContainer"]'
            const lists = roots.map(
                (r) => Array.from(r.querySelectorAll(RTC)) as HTMLElement[]
            )
            const kidsOf = (el: HTMLElement) =>
                Array.from(
                    el.querySelectorAll("h1,h2,h3,h4,h5,h6,p")
                ) as HTMLElement[]
            // reset every copy, then measure the reference copy (never turned in 3D)
            lists.forEach((l) =>
                l.forEach((el) => {
                    if (!el.dataset.fffit) return
                    el.style.maxWidth = ""
                    el.style.whiteSpace = ""
                    ;(el.style as any).zoom = ""
                    kidsOf(el).forEach((c) => {
                        c.style.whiteSpace = ""
                        c.style.overflowWrap = ""
                        c.style.wordBreak = ""
                    })
                    delete el.dataset.fffit
                })
            )
            if (!ref.offsetWidth) return
            // layout geometry (offsets), so 3D turns, scaling and reveal motion never skew it
            const leftOf = (el: HTMLElement) => {
                let x = 0
                let e: HTMLElement | null = el
                while (e && e !== ref) {
                    x += e.offsetLeft
                    e = e.offsetParent as HTMLElement | null
                }
                return e === ref ? x : NaN
            }
            const fixes: { i: number; mw: string; wrap: boolean; z: string }[] =
                []
            ;(Array.from(ref.querySelectorAll(RTC)) as HTMLElement[]).forEach(
                (el, i) => {
                    if (!el.offsetWidth) return
                    const fs =
                        parseFloat(
                            window.getComputedStyle(el.firstElementChild || el)
                                .fontSize
                        ) || 0
                    if (fs < 18) return
                    const x0 = leftOf(el)
                    if (isNaN(x0)) return
                    const right = x0 + Math.max(el.offsetWidth, el.scrollWidth)
                    // the nearest box this text visibly sticks out of: the screen itself, or a
                    // box that clips or has a fill (a card, a dark band). Spilling past a
                    // transparent layout box is invisible and left alone.
                    let lim = Infinity
                    let a = el.parentElement
                    while (a && a !== ref.parentElement) {
                        const ax = a === ref ? 0 : leftOf(a)
                        if (!isNaN(ax) && a.clientWidth) {
                            const cs = window.getComputedStyle(a)
                            const bg = cs.backgroundColor
                            const seen =
                                a === ref ||
                                cs.overflowX !== "visible" ||
                                (bg !== "transparent" &&
                                    !/rgba\(.*,\s*0\)$/.test(bg)) ||
                                cs.backgroundImage !== "none"
                            if (seen && ax + a.offsetWidth < right - 2) {
                                lim =
                                    ax +
                                    a.clientLeft +
                                    a.clientWidth -
                                    (parseFloat(cs.paddingRight) || 0)
                                break
                            }
                        }
                        a = a.parentElement
                    }
                    if (lim === Infinity) return
                    const avail = lim - x0
                    if (avail < 40) return
                    const k = 1
                    const f = { i, mw: "", wrap: false, z: "" }
                    el.dataset.fffit = "1"
                    if (
                        /\s/.test((el.textContent || "").trim()) &&
                        el.scrollWidth <= el.offsetWidth + 1
                    ) {
                        f.wrap = true
                        f.mw = avail / k + "px"
                        el.style.maxWidth = f.mw
                        el.style.whiteSpace = "pre-wrap"
                        kidsOf(el).forEach((c) => {
                            c.style.whiteSpace = "pre-wrap"
                            c.style.overflowWrap = "normal"
                            c.style.wordBreak = "normal"
                        })
                    }
                    const w = Math.max(el.offsetWidth, el.scrollWidth)
                    if (w > avail + 1) {
                        const z = Math.max(0.35, avail / w)
                        f.z = z.toFixed(4)
                        ;(el.style as any).zoom = f.z
                        if (f.mw) {
                            f.mw = avail / k / z + "px"
                            el.style.maxWidth = f.mw
                        }
                    }
                    fixes.push(f)
                }
            )
            // the same fix on the other copies (the halves show the same screen)
            roots.forEach((r, ri) => {
                if (r === ref) return
                fixes.forEach((f) => {
                    const el = lists[ri][f.i]
                    if (!el) return
                    el.dataset.fffit = "1"
                    if (f.mw) el.style.maxWidth = f.mw
                    if (f.wrap) {
                        el.style.whiteSpace = "pre-wrap"
                        kidsOf(el).forEach((c) => {
                            c.style.whiteSpace = "pre-wrap"
                            c.style.overflowWrap = "normal"
                            c.style.wordBreak = "normal"
                        })
                    }
                    if (f.z) (el.style as any).zoom = f.z
                })
            })
        }
        fitText()
        if (document.fonts && document.fonts.ready)
            document.fonts.ready.then(() => {
                if (active.current && epoch.current === generation && roots.every((root) => root.isConnected)) fitText()
            })
        // load + decode every screen image up front: no loading/decoding hitches while scrolling
        roots.forEach((root) =>
            root.querySelectorAll("img").forEach((im) => {
                const img = im as HTMLImageElement
                if (primed.current.has(img)) return
                primed.current.add(img)
                if (img.loading === "lazy") img.loading = "eager"
                if (img.decode) img.decode().catch(() => {})
            })
        )
        if (!motionOn && !mo.hover) return
        roots.forEach((root) => {
            const marked = screens.filter(screen => root.contains(screen))
            if (motionOn) marked.forEach(screen => {
                let context = compositions.current.get(screen)
                if (!context) {
                    context = gsap.context(() => {}, screen)
                    compositions.current.set(screen, context)
                }
                collectCompositionGroups(screen).forEach(el => {
                    if (seen.current.has(el)) return
                    const registerCounters = () => {
                        if (mo.counters) el.querySelectorAll<HTMLElement>('[data-framer-name^="Count"],[data-framer-name^="count"]').forEach(counter => {
                            if (seen.current.has(counter)) return
                            seen.current.add(counter)
                            compositionCounters.current.set(counter, screen)
                            list.push({ el: counter, root, top: 0, h: 0, kind: "c", done: false })
                        })
                    }
                    if (entry.current?.screens.includes(screen) && !entry.current.paintedFull) {
                        const top = topOf(el, root)
                        if (top < live.current.inner + geo.current.Hs && top + el.offsetHeight > live.current.inner) {
                            seen.current.add(el)
                            registerCounters()
                            return
                        }
                    }
                    seen.current.add(el)
                    compositionGroups.current.set(el, screen)
                    list.push({ el, root, top: 0, h: 0, kind: "t", done: false })
                    registerCounters()
                })
            })
            const grouped = (el: HTMLElement) => marked.some(screen => screen.contains(el))
            const add = (el: HTMLElement | null, kind: MItem["kind"]) => {
                if (!motionOn || !el || seen.current.has(el) || grouped(el)) return
                seen.current.add(el)
                el.classList.add("ffm-" + kind)
                list.push({ el, root, top: 0, h: 0, kind, done: false })
            }
            if (mo.images)
                root.querySelectorAll(
                    "[data-framer-background-image-wrapper]"
                ).forEach((w) => add(w.parentElement as HTMLElement, "i"))
            root.querySelectorAll(
                '[data-framer-component-type="RichTextContainer"]'
            ).forEach((t) => {
                const tag =
                    (t.firstElementChild && t.firstElementChild.tagName) || ""
                // big numbers ("12", "140+", "9") count up automatically
                const txt = ((t as HTMLElement).innerText || "").trim()
                const big =
                    mo.counters &&
                    /^\D{0,2}\d[\d,.]*\D{0,4}$/.test(txt) &&
                    parseFloat(
                        window.getComputedStyle(t.firstElementChild || t)
                            .fontSize
                    ) >= 34
                add(
                    t as HTMLElement,
                    big
                        ? "c"
                        : mo.headlines && (tag === "H1" || tag === "H2")
                          ? "h"
                          : "t"
                )
            })
            // hover styles for links, detected from their look
            if (mo.hover)
                root.querySelectorAll("a").forEach((a) => {
                    const el = a as HTMLElement
                    if (el.dataset.ffh) return
                    const cs = window.getComputedStyle(el)
                    const hasBg =
                        cs.backgroundColor !== "rgba(0, 0, 0, 0)" &&
                        cs.backgroundColor !== "transparent"
                    const round = parseFloat(cs.borderTopLeftRadius) >= 12
                    const hasImg = !!el.querySelector(
                        "[data-framer-background-image-wrapper]"
                    )
                    let k = ""
                    if (hasBg && round && el.offsetWidth < 420 && !hasImg)
                        k = "b"
                    else if (
                        !hasImg &&
                        el.offsetWidth > root.clientWidth * 0.55
                    )
                        k = "r"
                    else if (hasImg) k = "k"
                    if (k) {
                        el.dataset.ffh = k
                        el.classList.add("ffh-" + k)
                    }
                })
            if (mo.counters)
                root.querySelectorAll(
                    '[data-framer-name^="Count"],[data-framer-name^="count"]'
                ).forEach((c) => add(c as HTMLElement, "c"))
        })
        kick.current()
        mItems.current = mItems.current
            .filter((m) => !m.done && m.el.isConnected)
            .concat(list)
        mItems.current.forEach((m) => {
            m.top = topOf(m.el, m.root)
            m.h = m.el.offsetHeight
        })
        // whatever is already on screen shows now (no waiting for the first scroll)
        if (list.length)
            motionTick.current(Math.max(0, live.current.inner), live.current.pe)
    }
    const countUp = (el: HTMLElement) => {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
        let node: Text | null = null
        while (walker.nextNode()) {
            const n = walker.currentNode as Text
            if (/\d/.test(n.nodeValue || "")) {
                node = n
                break
            }
        }
        if (!node) return
        const txt = node.nodeValue || ""
        const m = txt.match(/^(\D*)(\d[\d,.]*)(.*)$/)
        if (!m) return
        const raw = m[2].replace(/,/g, "")
        const target = parseFloat(raw)
        const dec = raw.includes(".") ? raw.split(".")[1].length : 0
        const pad = !dec && raw.startsWith("0") ? raw.length : 0
        const comma = m[2].includes(",")
        const fmt = (v: number) => {
            let s = v.toFixed(dec)
            if (pad) s = s.padStart(pad, "0")
            if (comma)
                s = Number(s).toLocaleString("en-US", {
                    minimumFractionDigits: dec,
                })
            return m[1] + s + m[3]
        }
        const t0 = performance.now()
        const dur = 1400 + Math.min(1200, target * 4)
        const tn = node
        counters.current.set(tn, { el, original: txt })
        const step = (now: number) => {
            if (!el.contains(tn)) return
            const p = clamp((now - t0) / dur, 0, 1)
            tn.nodeValue = fmt(
                target * (1 - Math.pow(2, -10 * p)) * (p === 1 ? 1 : 1.0009)
            )
            if (p < 1) nextFrame(el, step)
            else {
                tn.nodeValue = txt
                counters.current.delete(tn)
            }
        }
        tn.nodeValue = fmt(0)
        nextFrame(el, step)
        later(el, () => {
            if (el.contains(tn)) tn.nodeValue = txt
            counters.current.delete(tn)
        }, dur + 400) // safety
    }
    const motionTick = useRef<(inner: number, pe: number) => void>(() => {})
    motionTick.current = (inner: number, pe: number) => {
        if (!motionOn || !mItems.current.length) return
        if (pe < 0.55) return // wait until the display is (almost) open
        const g = geo.current
        const lo = inner - 40
        const hi = inner + g.Hs * (g.port ? 1 : 0.94)
        let n = 0
        let compositionStart: number | undefined
        for (const m of mItems.current) {
            if (m.done || !m.el.isConnected || m.top > hi || m.top + m.h < lo) continue
            const screen = compositionGroups.current.get(m.el)
            if (screen && entry.current?.screens.includes(screen) && !entry.current.paintedFull) continue
            m.done = true
            const d = Math.min(n * mo.stagger, 0.6)
            n++
            const el = m.el
            if (compositionCounters.current.has(el)) {
                const timer = later(el, () => {
                    compositionCounterTimers.current.delete(el)
                    countUp(el)
                }, d * 1000 + 150)
                compositionCounterTimers.current.set(el, timer)
                continue
            }
            if (screen) {
                const context = compositions.current.get(screen)!
                let timeline: ReturnType<typeof gsap.timeline>
                context.add(() => {
                    timeline = gsap.timeline({ paused: true }).fromTo(el,
                        { opacity: 0, y: mo.distance },
                        { opacity: 1, y: 0, duration: mo.duration, ease: easeOut, immediateRender: false })
                })
                timeline!.time(0)
                compositionTimelines.current.set(el, timeline!)
                reveals.current.push({ el, img: null, kind: "t", t0: compositionStart ??= performance.now(), dur: mo.duration * 1000, dist: mo.distance })
                continue
            }
            const img =
                m.kind === "i"
                    ? (el.querySelector(
                          "[data-framer-background-image-wrapper] img"
                      ) as HTMLElement | null)
                    : null
            const dur =
                mo.duration *
                (m.kind === "h" ? 1.15 : m.kind === "c" ? 1 : 0.9) *
                1000
            el.style.transition = "none"
            if (img) img.style.transition = "none"
            reveals.current.push({
                el,
                img,
                kind: m.kind,
                t0: performance.now() + d * 1000,
                dur,
                dist:
                    m.kind === "c"
                        ? mo.distance * 0.6
                        : m.kind === "h"
                          ? 12
                          : mo.distance,
            })
            if (m.kind === "c") later(el, () => countUp(el), d * 1000 + 150)
        }
        if (n) {
            mItems.current = mItems.current.filter((m) => !m.done)
            kick.current()
        }
    }
    // reveals are stepped from the loop: plain style writes, no CSS transitions, so the
    // browser never has to create extra layers for them
    const reveals = useRef<Reveal[]>([])
    const stepReveals = (t: number) => {
        if (!active.current) return false
        if (entry.current?.paintedFull && entry.current.screens.some(screen => !screen.isConnected)) releaseEntry()
        const list = reveals.current
        if (!list.length) return false
        let keep = false
        for (const r of list) {
            if (entry.current?.screens.includes(r.el)) {
                const current = entry.current
                if (current.screens.some(screen => !screen.isConnected) || geo.current.port !== current.port || document.visibilityState === "hidden") {
                    releaseEntry()
                    continue
                }
                if (current.paintedFull) {
                    r.dur = -1
                    continue
                }
                // A queued rAF timestamp can precede a synchronous navigation step.
                const elapsed = Math.max(current.timeline.time(), (t - r.t0) / 1000)
                current.timeline.time(Math.min(elapsed, current.timeline.duration()))
                current.inner = Math.max(0, live.current.inner)
                current.originals.forEach(({ screen, width, height }) => {
                    screen.style.clipPath = centerOutInsets(current.port, width, height, current.height, current.inner, current.progress.value)
                })
                if (elapsed >= current.timeline.duration()) {
                    // Retain the full-root clip for the observed settled-text paint stability;
                    // lifecycle release restores the prior clip without idle playback.
                    current.originals.forEach(({ screen }) => { screen.style.clipPath = "inset(0px)" })
                    current.paintedFull = true
                }
                keep = true
                continue
            }
            const timeline = compositionTimelines.current.get(r.el)
            if (timeline) {
                if (!r.el.isConnected) {
                    const screen = compositionGroups.current.get(r.el)
                    if (screen && !screen.isConnected) releaseComposition(screen)
                    else {
                        timeline.revert()
                        compositionTimelines.current.delete(r.el)
                    }
                    r.dur = -1
                    continue
                }
                const elapsed = Math.max(0, (t - r.t0) / 1000)
                timeline.time(Math.min(elapsed, timeline.duration()))
                if (elapsed >= timeline.duration()) {
                    timeline.revert()
                    compositionTimelines.current.delete(r.el)
                    r.dur = -1
                } else keep = true
                continue
            }
            if (!r.el.isConnected) {
                r.dur = -1
                continue
            }
            const p = clamp((t - r.t0) / r.dur, 0, 1)
            const e = easeOut(p)
            const img = r.img?.isConnected ? r.img : null
            r.el.style.opacity = String(+e.toFixed(3))
            if (r.kind !== "i")
                r.el.style.translate = `0 ${((1 - e) * r.dist).toFixed(2)}px`
            if (img) img.style.scale = String(+(1.08 - 0.08 * e).toFixed(4))
            if (p >= 1) {
                // clean up so hover effects and layout are untouched afterwards
                const el = r.el,
                    im = img
                el.classList.remove("ffm-" + r.kind)
                el.style.removeProperty("opacity")
                el.style.removeProperty("translate")
                if (im) im.style.removeProperty("scale")
                // hover transitions come back a moment later (otherwise the reset itself
                // would be animated)
                later(el, () => {
                    el.style.removeProperty("transition")
                    if (im?.isConnected) im.style.removeProperty("transition")
                }, 80)
                r.dur = -1
            } else keep = true
        }
        reveals.current = list.filter((r) => r.dur > 0)
        return keep
    }

    useIsoLayoutEffect(() => {
        active.current = true
        return () => {
            active.current = false
            epoch.current++
            timers.current.forEach((id) => window.clearTimeout(id))
            frames.current.forEach((id) => window.cancelAnimationFrame(id))
            timers.current.clear()
            frames.current.clear()
            counters.current.forEach(({ el, original }, node) => {
                if (el.isConnected && el.contains(node)) node.nodeValue = original
            })
            counters.current.clear()
            releaseEntry()
            consumedEntry.current = null
            const grouped = new Set(compositionGroups.current.keys())
            compositions.current.forEach(context => context.revert())
            compositions.current.clear()
            compositionGroups.current.clear()
            compositionCounters.current.clear()
            compositionCounterTimers.current.clear()
            compositionTimelines.current.clear()
            reveals.current.forEach(({ el, img, kind }) => {
                if (grouped.has(el)) return
                if (!el.isConnected) return
                el.classList.remove("ffm-" + kind)
                el.style.removeProperty("opacity")
                el.style.removeProperty("translate")
                el.style.removeProperty("transition")
                if (img?.isConnected) {
                    img.style.removeProperty("scale")
                    img.style.removeProperty("transition")
                }
            })
            reveals.current = []
            mItems.current = []
            seen.current = new WeakSet()
        }
    }, [])

    return { motionTick, scan, reveals, stepReveals, armEntry }
}
