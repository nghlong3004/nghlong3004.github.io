// ---------- page change: a still copy of the stage stays on screen while the next page mounts,
// then fades out over the new screen (Framer swaps the whole page tree; without this the
// device vanished for a moment and came back empty)
export const SNAP_ID = "ff-pagesnap"
export const takeSnapshot = (stage: HTMLElement) => {
    if (typeof document === "undefined") return
    const prev = document.getElementById(SNAP_ID)
    if (prev) prev.remove()
    const r = stage.getBoundingClientRect()
    if (r.bottom <= 0 || r.top >= window.innerHeight || !r.width) return
    const clone = stage.cloneNode(true) as HTMLElement
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
    const wrap = document.createElement("div")
    wrap.id = SNAP_ID
    wrap.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;z-index:5;pointer-events:none;overflow:hidden`
    wrap.appendChild(clone)
    document.body.appendChild(wrap)
    // nothing adopted it (a page without the device): let it go
    window.setTimeout(() => releaseSnapshot(400), 3000)
}
export const releaseSnapshot = (ms: number) => {
    if (typeof document === "undefined") return
    const w = document.getElementById(SNAP_ID) as
        | (HTMLElement & { __fading?: boolean })
        | null
    if (!w || w.__fading) return
    w.__fading = true
    // a background tab gets no animation frames: just drop it (and never leave it behind)
    if (document.visibilityState === "hidden") {
        w.remove()
        return
    }
    window.setTimeout(() => w.remove(), ms + 250)
    const t0 = performance.now()
    const step = (t: number) => {
        const p = Math.min(1, (t - t0) / ms)
        w.style.opacity = String(+(1 - p * p).toFixed(3))
        if (p < 1) window.requestAnimationFrame(step)
        else w.remove()
    }
    window.requestAnimationFrame(step)
}
