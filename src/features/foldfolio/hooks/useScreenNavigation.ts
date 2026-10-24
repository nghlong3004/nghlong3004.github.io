import { useEffect, useRef } from "react"
import type { RefObject } from "react"
import type { DeviceRefs } from "./useDeviceRefs"


export function usePagePreload({
    isCanvas, rootRef, R,
}: {
    isCanvas: boolean
    rootRef: RefObject<HTMLDivElement | null>
    R: DeviceRefs
}) {
    // Pre-warm the other pages: the code and styles of every page the Nav links to are
    // fetched in the background, so switching pages is instant (the device stays, only
    // the screen content changes)
    useEffect(() => {
        if (isCanvas || typeof window === "undefined" || !rootRef.current)
            return
        const id = window.setTimeout(async () => {
            const root = rootRef.current
            if (!root) return
            const seen = new Set<string>([location.pathname])
            const hrefs: string[] = []
            // the Nav's links first, then everything else on the screen
            const nav = R.overlay.current
            const links = [
                ...(nav ? Array.from(nav.querySelectorAll("a[href]")) : []),
                ...Array.from(root.querySelectorAll("a[href]")),
            ]
            links.forEach((a) => {
                try {
                    const u = new URL(
                        (a as HTMLAnchorElement).href,
                        location.href
                    )
                    if (
                        u.origin !== location.origin ||
                        seen.has(u.pathname) ||
                        u.hash
                    )
                        return
                    if ((a as HTMLAnchorElement).target === "_blank") return
                    seen.add(u.pathname)
                    hrefs.push(u.pathname)
                } catch {}
            })
            for (const path of hrefs.slice(0, 8)) {
                try {
                    const key = "ff-warm:" + path
                    if (window.sessionStorage.getItem(key)) continue
                    const html = await (
                        await fetch(path, { credentials: "same-origin" })
                    ).text()
                    const doc = new DOMParser().parseFromString(
                        html,
                        "text/html"
                    )
                    const urls = new Set<string>()
                    doc.querySelectorAll(
                        'link[rel="modulepreload"][href], script[type="module"][src]'
                    ).forEach((el) => {
                        const u =
                            (el as HTMLLinkElement).href ||
                            (el as HTMLScriptElement).src
                        if (u) urls.add(u)
                    })
                    urls.forEach((u) => {
                        if (
                            document.querySelector(
                                `link[rel="modulepreload"][href="${u}"]`
                            )
                        )
                            return
                        const l = document.createElement("link")
                        l.rel = "modulepreload"
                        l.href = u
                        document.head.appendChild(l)
                    })
                    window.sessionStorage.setItem(key, "1")
                } catch {}
            }
        }, 2500)
        return () => window.clearTimeout(id)
    }, [isCanvas])

}



export function useScreenFilters({
    isCanvas, rootRef, R, scan, kick,
}: {
    isCanvas: boolean
    rootRef: RefObject<HTMLDivElement | null>
    R: DeviceRefs
    scan: RefObject<() => void>
    kick: RefObject<() => void>
}) {
    // Filters: pills inside the Screen that link to the page you are on filter the
    // lists below them by their label ("All" shows everything). No setup needed:
    // make a pill, link it to this page, name it like a Category value.
    const filterVal = useRef("")
    const applyFilter = useRef<(label: string) => void>(() => {})
    applyFilter.current = (label: string) => {
        if (typeof document === "undefined") return
        const v = label.trim().toLowerCase()
        const showAll = !v || /^(all|all work|everything|show all)$/.test(v)
        filterVal.current = showAll ? "" : v
        const here = window.location.pathname.replace(/\/$/, "")
        const same = (a: HTMLAnchorElement) => {
            try {
                const u = new URL(a.href, window.location.href)
                return (
                    u.origin === window.location.origin &&
                    u.pathname.replace(/\/$/, "") === here &&
                    !u.hash
                )
            } catch {
                return false
            }
        }
        const textOf = (el: Element) =>
            Array.from(
                el.querySelectorAll(
                    '[data-framer-component-type="RichTextContainer"]'
                )
            ).map((t) => (t.textContent || "").trim().toLowerCase())
        const paint = (el: HTMLElement, bg: string, col: string) => {
            el.style.backgroundColor = bg
            el.querySelectorAll("*").forEach((d) => {
                const h = d as HTMLElement
                h.style.setProperty("--framer-text-color", col)
                h.style.color = col
            })
        }
        ;[R.cL.current, R.cR.current, R.cOpen.current, R.cInteractive?.current].forEach((root) => {
            if (!root) return
            const anchors = Array.from(
                root.querySelectorAll("a")
            ) as HTMLAnchorElement[]
            const chips = anchors.filter(same)
            if (!chips.length) return
            const labels = chips.map((c) =>
                (c.innerText || "").trim().toLowerCase()
            )
            // remember the designed "on" (first pill) and "off" (second pill) looks once
            const look = (el: HTMLElement) => {
                const t = el.querySelector("p,h1,h2,h3,h4,h5,h6,span") || el
                return {
                    bg: window.getComputedStyle(el).backgroundColor,
                    col: window.getComputedStyle(t).color,
                }
            }
            const r = root as any
            if (!r.__ffLook && chips.length > 1)
                r.__ffLook = { on: look(chips[0]), off: look(chips[1]) }
            const L2 = r.__ffLook
            chips.forEach((c, i) => {
                const active = showAll
                    ? i === 0 &&
                      /^(all|all work|everything|show all)$/.test(labels[0])
                    : labels[i] === v
                if (L2)
                    paint(
                        c,
                        active ? L2.on.bg : L2.off.bg,
                        active ? L2.on.col : L2.off.col
                    )
                c.setAttribute("aria-pressed", active ? "true" : "false")
            })
            // lists = groups of 2+ sibling links (CMS lists); an item is kept when one of
            // its texts equals the chosen label
            const lists = new Map<HTMLElement, HTMLElement[]>()
            anchors.forEach((a) => {
                if (same(a)) return
                let it: HTMLElement = a
                while (
                    it.parentElement &&
                    it.parentElement !== root &&
                    it.parentElement.children.length === 1
                )
                    it = it.parentElement
                const list = it.parentElement
                if (!list || list === root || list.children.length < 2) return
                const arr = lists.get(list) || []
                if (arr.indexOf(it) < 0) arr.push(it)
                lists.set(list, arr)
            })
            lists.forEach((items) => {
                const texts = items.map(textOf)
                const filterable = texts.some((ts) =>
                    ts.some((t) => t && labels.indexOf(t) >= 0)
                )
                if (!filterable) return
                items.forEach((it, i) => {
                    const show = showAll || texts[i].indexOf(v) >= 0
                    const wasHidden = it.style.display === "none"
                    it.style.display = show ? "" : "none"
                    if (show) {
                        it.classList.remove("ffm-show")
                        void it.offsetWidth
                        it.classList.add("ffm-show")
                    } else if (!wasHidden) it.classList.remove("ffm-show")
                })
            })
        })
        window.setTimeout(() => {
            scan.current()
            kick.current()
        }, 60)
    }
    useEffect(() => {
        const root = rootRef.current
        if (!root || isCanvas) return
        const onClick = (e: MouseEvent) => {
            const tgt = e.target as HTMLElement
            const a = (
                tgt && tgt.closest ? tgt.closest("a") : null
            ) as HTMLAnchorElement | null
            if (!a) return
            const inScreen = [R.cL.current, R.cR.current, R.cOpen.current, R.cInteractive?.current].some(
                (r) => r && r.contains(a)
            )
            if (!inScreen) return
            try {
                const u = new URL(a.href, window.location.href)
                const here = window.location.pathname.replace(/\/$/, "")
                if (
                    u.origin !== window.location.origin ||
                    u.pathname.replace(/\/$/, "") !== here ||
                    u.hash
                )
                    return
            } catch {
                return
            }
            const label = (a.innerText || "").trim()
            if (!label) return
            e.preventDefault()
            e.stopPropagation()
            applyFilter.current(label)
        }
        root.addEventListener("click", onClick, true)
        return () => root.removeEventListener("click", onClick, true)
    }, [isCanvas])
}
