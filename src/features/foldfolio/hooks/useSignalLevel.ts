import { useEffect, useState } from "react"

export function useSignalLevel(active: boolean, interval: number) {
    const [level, setLevel] = useState(4)

    useEffect(() => {
        if (!active || typeof document === "undefined") return
        let timer: number | undefined
        const schedule = () => window.setTimeout(tick, interval * (1 + Math.random() * 0.5))
        const tick = () => {
            setLevel(current => Math.max(2, Math.min(5, current + (Math.random() < 0.5 ? -1 : 1))))
            timer = schedule()
        }
        const visibility = () => {
            window.clearTimeout(timer)
            timer = undefined
            if (document.visibilityState === "visible")
                timer = schedule()
        }
        document.addEventListener("visibilitychange", visibility)
        visibility()
        return () => {
            window.clearTimeout(timer)
            document.removeEventListener("visibilitychange", visibility)
        }
    }, [active, interval])

    return level
}
