import { useRef } from "react"
import type { RefObject } from "react"
import type { DeviceRefs } from "./useDeviceRefs"
import { clamp } from "../lib/math"
import type { SceneImage } from "../engine/types"
// Framer image CDN: ask for a small copy (orbit cards / glow don't need 2000px photos)
const sized = (src: string, px: number) =>
    src && src.indexOf("framerusercontent.com/images/") >= 0
        ? src.split("?")[0] + "?scale-down-to=" + px
        : src

export function useSceneImages({
    sceneList, R, cardW, F, glowFlip, glowCur, kick, imgLum,
}: {
    sceneList: () => SceneImage[]
    R: DeviceRefs
    cardW: number
    F: string[]
    glowFlip: RefObject<number>
    glowCur: RefObject<string>
    kick: RefObject<() => void>
    imgLum: RefObject<Record<string, number>>
}) {
    const paintScenes = useRef<() => void>(() => {})
    paintScenes.current = () => {
        const list = sceneList()
        const box = R.orbit.current
        if (box) {
            const kids = box.children
            const px =
                cardW *
                    1.3 *
                    (typeof window !== "undefined"
                        ? window.devicePixelRatio || 1
                        : 1) >
                240
                    ? 512
                    : 256
            // one card per image, never the same picture twice (spare cards are hidden)
            const n = list.length
                ? Math.min(kids.length, list.length)
                : kids.length
            for (let i = 0; i < kids.length; i++) {
                const c = kids[i] as HTMLElement
                const bg =
                    i < n && list.length
                        ? `url("${sized(list[i].src, px)}")`
                        : list.length
                          ? ""
                          : `linear-gradient(145deg, ${F[2]}, ${F[1]})`
                c.style.display = i < n ? "" : "none"
                if (c.dataset.bg !== bg) {
                    c.dataset.bg = bg
                    c.style.backgroundColor = F[1]
                    c.style.backgroundImage = bg
                }
            }
        }
        // Glow: (re)draw the visible plates (canvases are cleared when React resizes them)
        ;[R.glow.current, R.glowR.current].forEach((g) => {
            if (!g) return
            const f = list.length ? glowFlip.current : 0
            const a = g.children[f] as HTMLCanvasElement,
                b2 = g.children[1 - f] as HTMLCanvasElement
            const want = list.length ? glowCur.current : ""
            if (a && (a.dataset.src !== want || !a.dataset.ok))
                drawGlow(a, want)
            if (a) a.style.opacity = "1"
            if (b2) b2.style.opacity = "0"
        })
        kick.current()
    }
    // Glow plates are tiny canvases (48px) that the GPU stretches: soft light, no blur filter
    const glowImgs = useRef<Record<string, HTMLImageElement>>({})
    const drawGlow = (cv: HTMLCanvasElement, src: string) => {
        cv.dataset.src = src
        cv.dataset.ok = ""
        const x = cv.getContext("2d")
        if (!x) return
        const w = cv.width,
            h = cv.height
        const mask = () => {
            // soft oval edge so the light fades out instead of ending in a rectangle
            x.globalCompositeOperation = "destination-in"
            x.save()
            x.translate(w / 2, h / 2)
            x.scale(w / 2, h / 2)
            const gr = x.createRadialGradient(0, 0, 0, 0, 0, 1)
            gr.addColorStop(0, "rgba(0,0,0,1)")
            gr.addColorStop(0.5, "rgba(0,0,0,.9)")
            gr.addColorStop(1, "rgba(0,0,0,0)")
            x.fillStyle = gr
            x.fillRect(-1, -1, 2, 2)
            x.restore()
            x.globalCompositeOperation = "source-over"
            cv.dataset.ok = "1"
        }
        if (!src) {
            x.clearRect(0, 0, w, h)
            const gr = x.createLinearGradient(0, 0, w, h)
            gr.addColorStop(0, F[2])
            gr.addColorStop(0.5, F[0])
            gr.addColorStop(1, F[1])
            x.fillStyle = gr
            x.fillRect(0, 0, w, h)
            mask()
            return
        }
        const paint = (im: HTMLImageElement) => {
            if (cv.dataset.src !== src || !im.naturalWidth) return
            x.clearRect(0, 0, w, h)
            const r = Math.max(w / im.naturalWidth, h / im.naturalHeight)
            const dw = im.naturalWidth * r,
                dh = im.naturalHeight * r
            x.drawImage(im, (w - dw) / 2, (h - dh) / 2, dw, dh)
            try {
                // saturate + soften on the pixels (48px, costs nothing)
                const id = x.getImageData(0, 0, w, h)
                const d = id.data
                for (let i = 0; i < d.length; i += 4) {
                    const l = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
                    d[i] = clamp(l + (d[i] - l) * 1.7, 0, 255)
                    d[i + 1] = clamp(l + (d[i + 1] - l) * 1.7, 0, 255)
                    d[i + 2] = clamp(l + (d[i + 2] - l) * 1.7, 0, 255)
                }
                const tmp = new Uint8ClampedArray(d.length)
                for (let pass = 0; pass < 2; pass++) {
                    for (let dir = 0; dir < 2; dir++) {
                        tmp.set(d)
                        for (let yy = 0; yy < h; yy++)
                            for (let xx = 0; xx < w; xx++) {
                                let s0 = 0,
                                    s1 = 0,
                                    s2 = 0,
                                    n = 0
                                for (let o = -2; o <= 2; o++) {
                                    const px = dir
                                        ? xx
                                        : clamp(xx + o, 0, w - 1)
                                    const py = dir
                                        ? clamp(yy + o, 0, h - 1)
                                        : yy
                                    const j = (py * w + px) * 4
                                    s0 += tmp[j]
                                    s1 += tmp[j + 1]
                                    s2 += tmp[j + 2]
                                    n++
                                }
                                const j = (yy * w + xx) * 4
                                d[j] = s0 / n
                                d[j + 1] = s1 / n
                                d[j + 2] = s2 / n
                                d[j + 3] = 255
                            }
                    }
                }
                x.putImageData(id, 0, 0)
            } catch {}
            mask()
        }
        const have = glowImgs.current[src]
        if (have && have.complete && have.naturalWidth) return paint(have)
        const load = (cors: boolean) => {
            const im = new Image()
            if (cors) im.crossOrigin = "anonymous"
            im.onload = () => {
                glowImgs.current[src] = im
                paint(im)
            }
            im.onerror = () => {
                if (cors) load(false)
            }
            im.src = sized(src, 96)
        }
        load(true)
    }
    // how bright the top of an image is (the status bar sits over it)
    const measureLum = (src: string) => {
        if (imgLum.current[src] !== undefined || typeof Image === "undefined")
            return
        imgLum.current[src] = 0.5
        const im = new Image()
        im.crossOrigin = "anonymous"
        im.onload = () => {
            try {
                const c = document.createElement("canvas")
                c.width = 24
                c.height = 24
                const x = c.getContext("2d")
                if (!x) return
                x.drawImage(im, 0, 0, 24, 24)
                const d = x.getImageData(0, 0, 24, 5).data
                let tot = 0
                for (let i = 0; i < d.length; i += 4)
                    tot += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]
                imgLum.current[src] = tot / (d.length / 4) / 255
            } catch {}
        }
        im.src = sized(src, 64)
    }
    // how colourful each image is, so Glow picks images that actually glow
    const sat = useRef<Record<string, number>>({})
    const measureSat = (src: string) => {
        if (sat.current[src] !== undefined || typeof Image === "undefined")
            return
        sat.current[src] = 0.3
        const im = new Image()
        im.crossOrigin = "anonymous"
        im.onload = () => {
            try {
                const c = document.createElement("canvas")
                c.width = c.height = 24
                const x = c.getContext("2d")
                if (!x) return
                x.drawImage(im, 0, 0, 24, 24)
                const d = x.getImageData(0, 0, 24, 24).data
                let tot = 0
                for (let i = 0; i < d.length; i += 4) {
                    const mx = Math.max(d[i], d[i + 1], d[i + 2]),
                        mn = Math.min(d[i], d[i + 1], d[i + 2])
                    tot += mx ? (mx - mn) / mx : 0
                }
                sat.current[src] = tot / (d.length / 4)
            } catch {}
        }
        im.src = sized(src, 64)
    }

    return { paintScenes, sat, drawGlow, measureSat, measureLum }
}
