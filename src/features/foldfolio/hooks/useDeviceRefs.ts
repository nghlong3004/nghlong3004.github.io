import { useRef } from "react"

export function useDeviceRefs() {
    // Separate hook calls keep React Compiler from caching the calls inside an object literal.
    const stage = useRef<HTMLDivElement>(null)
    const iCur = useRef<HTMLDivElement>(null)
    const iA = useRef<HTMLDivElement>(null)
    const iB = useRef<HTMLDivElement>(null)
    const iSeam = useRef<HTMLDivElement>(null)
    const iDev = useRef<HTMLDivElement>(null)
    const iNames = useRef<HTMLDivElement>(null)
    const dev = useRef<HTMLDivElement>(null)
    const leaf = useRef<HTMLDivElement>(null)
    const cover = useRef<HTMLDivElement>(null)
    const rightH = useRef<HTMLDivElement>(null)
    const rBody = useRef<HTMLDivElement>(null)
    const rGlass = useRef<HTMLDivElement>(null)
    const rScreen = useRef<HTMLDivElement>(null)
    const cL = useRef<HTMLDivElement>(null)
    const cR = useRef<HTMLDivElement>(null)
    const cOpen = useRef<HTMLDivElement>(null)
    const shF = useRef<HTMLDivElement>(null)
    const shB = useRef<HTMLDivElement>(null)
    const shR = useRef<HTMLDivElement>(null)
    const shadow = useRef<HTMLDivElement>(null)
    const shadowC = useRef<HTMLDivElement>(null)
    const call = useRef<HTMLDivElement>(null)
    const overlay = useRef<HTMLDivElement>(null)
    const nmL = useRef<HTMLDivElement>(null)
    const nmR = useRef<HTMLDivElement>(null)
    const glow = useRef<HTMLDivElement>(null)
    const glowR = useRef<HTMLDivElement>(null)
    const orbit = useRef<HTMLDivElement>(null)
    const rig = useRef<HTMLDivElement>(null)
    const openBlk = useRef<HTMLDivElement>(null)
    const wA = useRef<HTMLDivElement>(null)
    const wB = useRef<HTMLDivElement>(null)
    return {
        stage,
        iCur,
        iA,
        iB,
        iSeam,
        iDev,
        iNames,
        dev,
        leaf,
        cover,
        rightH,
        rBody,
        rGlass,
        rScreen,
        cL,
        cR,
        cOpen,
        shF,
        shB,
        shR,
        shadow,
        shadowC,
        call,
        overlay,
        nmL,
        nmR,
        glow,
        glowR,
        orbit,
        rig,
        openBlk,
        wA,
        wB,
    }
}

export type DeviceRefs = ReturnType<typeof useDeviceRefs>
