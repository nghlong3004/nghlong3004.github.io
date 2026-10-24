// ---------- page change: a still copy of the stage stays on screen while the next page mounts,
// then fades out over the new screen (Framer swaps the whole page tree; without this the
// device vanished for a moment and came back empty)
export const SNAP_ID = "ff-pagesnap"
type Snapshot = HTMLDivElement & {
    __fading?: boolean
    __section?: boolean
    __dispose?: () => void
    __cancelFade?: () => void
}
let serial = 0
export const takeSnapshot = (stage: HTMLElement, section = false) => {
    if (typeof document === "undefined") return
    const prev = document.getElementById(SNAP_ID) as Snapshot | null
    if (prev) {
        if (prev.__dispose) prev.__dispose()
        else prev.remove()
    }
    // An interrupted section transition must not turn into a stale page-exit overlay on unmount.
    if ((!section && prev?.__section) || document.visibilityState === "hidden") return
    const r = stage.getBoundingClientRect()
    if (r.bottom <= 0 || r.top >= window.innerHeight || !r.width) return
    const clone = stage.cloneNode(true) as HTMLElement
    // Keep SVG paint references local while eliminating duplicate IDs and ARIA cross-wiring.
    const ids = new Map<string, string>()
    const nodes = [clone, ...Array.from(clone.querySelectorAll("*"))]
    const prefix = `ff-snap-${++serial}-`
    nodes.forEach((el) => {
        if (el.id) {
            const id = prefix + el.id
            ids.set(el.id, id)
            el.id = id
        }
    })
    nodes.forEach((el) => {
        Array.from(el.attributes).forEach(({ name, value }) => {
            if (/^(aria-(controls|labelledby|describedby|owns|activedescendant|details|errormessage)|for|headers)$/i.test(name) || /^on/i.test(name)) {
                el.removeAttribute(name)
            } else if (name !== "id") {
                const local = value.replace(/url\((['"]?)#([^)'"\s]+)\1\)/g,
                    (all, quote: string, id: string) => ids.has(id) ? `url(${quote}#${ids.get(id)}${quote})` : all)
                el.setAttribute(name, (name === "href" || name === "xlink:href") && local.startsWith("#") && ids.has(local.slice(1))
                    ? "#" + ids.get(local.slice(1)) : local)
            }
        })
    })
    // canvases (Glow plates) don't copy their pixels with cloneNode
    const sc = stage.querySelectorAll("canvas")
    const cc = clone.querySelectorAll("canvas")
    sc.forEach((c, i) => {
        const d = cc[i] as HTMLCanvasElement | undefined
        const x = d && d.getContext("2d")
        if (x) {
            try {
                x.drawImage(c as HTMLCanvasElement, 0, 0)
            } catch {}
        }
    })
    clone.style.position = "absolute"
    clone.style.left = "0"
    clone.style.top = "0"
    clone.style.margin = "0"
    const wrap = document.createElement("div") as Snapshot
    wrap.id = SNAP_ID
    wrap.inert = true
    wrap.setAttribute("aria-hidden", "true")
    wrap.__section = section
    wrap.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;z-index:5;pointer-events:none;overflow:hidden`
    wrap.appendChild(clone)
    document.body.appendChild(wrap)
    const onHidden = () => {
        if (document.visibilityState === "hidden") wrap.__dispose?.()
    }
    const timeout = window.setTimeout(() => releaseSnapshot(400, wrap), 3000)
    wrap.__dispose = () => {
        window.clearTimeout(timeout)
        wrap.__cancelFade?.()
        window.removeEventListener("resize", wrap.__dispose!)
        document.removeEventListener("visibilitychange", onHidden)
        wrap.remove()
    }
    window.addEventListener("resize", wrap.__dispose)
    document.addEventListener("visibilitychange", onHidden)
    // nothing adopted it (a page without the device): let it go
    return wrap
}
export const releaseSnapshot = (ms: number, snapshot?: Snapshot) => {
    if (typeof document === "undefined") return
    const w = snapshot || document.getElementById(SNAP_ID) as Snapshot | null
    // Old page-mount callbacks must not adopt a newer section transition.
    if (!w || !w.isConnected || (!snapshot && w.__section)) return
    // a background tab gets no animation frames: just drop it (and never leave it behind)
    if (ms <= 0 || document.visibilityState === "hidden") {
        if (w.__dispose) w.__dispose()
        else w.remove()
        return
    }
    if (w.__fading) return
    w.__fading = true
    let raf = 0
    const dispose = () => {
        if (w.__dispose) w.__dispose()
        else w.remove()
    }
    const timeout = window.setTimeout(dispose, ms + 250)
    w.__cancelFade = () => {
        window.cancelAnimationFrame(raf)
        window.clearTimeout(timeout)
    }
    const t0 = performance.now()
    const step = (t: number) => {
        if (!w.isConnected) { dispose(); return }
        const p = Math.min(1, (t - t0) / ms)
        w.style.opacity = String(+(1 - p * p).toFixed(3))
        if (p < 1) raf = window.requestAnimationFrame(step)
        else dispose()
    }
    raf = window.requestAnimationFrame(step)
}
