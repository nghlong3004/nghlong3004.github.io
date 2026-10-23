import { useLayoutEffect, useEffect } from "react"

export const useIsoLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect
