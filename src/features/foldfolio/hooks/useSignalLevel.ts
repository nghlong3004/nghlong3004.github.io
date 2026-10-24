import { useEffect, useState } from "react"

export function useSignalLevel(active: boolean) {
    const [level, setLevel] = useState(4)

    useEffect(() => {
        if (!active || typeof document === "undefined") return
        let timer: number | undefined
        const tick = () => {
            setLevel(2 + Math.floor(Math.random() * 4))
            timer = window.setTimeout(tick, 2000)
        }
        const visibility = () => {
            window.clearTimeout(timer)
            timer = undefined
            if (document.visibilityState === "visible")
                timer = window.setTimeout(tick, 2000)
        }
        document.addEventListener("visibilitychange", visibility)
        visibility()
        return () => {
            window.clearTimeout(timer)
            document.removeEventListener("visibilitychange", visibility)
        }
    }, [active])

    return level
}
