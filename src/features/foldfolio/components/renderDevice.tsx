import type * as React from "react"
import type { RefObject } from "react"
import type { DeviceRefs } from "../hooks/useDeviceRefs"
import type { FoldfolioProps } from "../types"
import type { Geometry, GeometryState, LiveState } from "../engine/types"
import { Slot } from "./Slot"
import { abs, fill } from "../styles/motion"

export function renderDevice({
    G, b, F, status, port, clock, R, halfW, halfH, Ws, mode, measureRef, screenNode, land, inner,
    screenColor, coverNode, rootRef, live, geo, callNode, cRight, cLeaf, hingeBleed, cAll, Ro, Hs,
    navNode,
}: {
    G: Geometry
    b: number
    F: string[]
    status: FoldfolioProps["status"]
    port: boolean
    clock: string
    R: DeviceRefs
    halfW: number
    halfH: number
    Ws: number
    mode: FoldfolioProps["mode"]
    measureRef: RefObject<HTMLDivElement | null>
    screenNode: React.ReactElement | null
    land: boolean
    inner: GeometryState["inner"]
    screenColor: string
    coverNode: React.ReactElement | null
    rootRef: RefObject<HTMLDivElement | null>
    live: RefObject<LiveState>
    geo: RefObject<GeometryState>
    callNode: React.ReactElement | null
    cRight: string
    cLeaf: string
    hingeBleed: number
    cAll: string
    Ro: number
    Hs: number
    navNode: React.ReactElement | null
}) {
    // ---------------------------------------------------------------- styles
    const Ri = G.R - b
    const slabBg = `linear-gradient(145deg, ${F[2]} 0%, ${F[0]} 30%, ${F[1]} 55%, ${F[0]} 75%, ${F[3]} 100%)`
    const slabShadow =
        "inset 0 1px 1px rgba(255,255,255,.82), inset 0 -1px 1px rgba(0,0,0,.3), inset 0 0 0 1px rgba(255,255,255,.25)"
    // status bar colour: fixed, or "auto" (reads the screen under it and picks dark/light)
    const tint =
        status.tone === "dark"
            ? "#111"
            : status.tone === "light"
              ? "#fff"
              : "#fff"
    const autoTint = status.tone !== "dark" && status.tone !== "light"

    const statusBar = (part: "all" | "left" | "right") =>
        status.show ? (
            <div
                data-ffsb={autoTint ? part : undefined}
                style={{
                    ...abs,
                    left: 0,
                    right: 0,
                    top: 0,
                    height: port ? 36 : 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        part === "right" ? "flex-end" : "space-between",
                    padding: port ? "0 22px" : "0 26px",
                    font: "600 13px/1 'Geist', system-ui, sans-serif",
                    color: tint,
                    letterSpacing: "-.01em",
                    textShadow:
                        status.tone === "light"
                            ? "0 1px 6px rgba(0,0,0,.25)"
                            : "none",
                    pointerEvents: "none",
                    zIndex: 6,
                }}
            >
                {part !== "right" && <span>{clock}</span>}
                {part !== "left" && (
                    <span
                        style={{
                            display: "flex",
                            gap: 6,
                            alignItems: "center",
                            fontSize: 12,
                        }}
                    >
                        <span>5G</span>
                        {status.batteryText !== undefined ? (
                            <svg data-ff-battery="" width="32" height="18" viewBox="0 0 32 18"
                                role="img" aria-label={status.batteryLabel || status.batteryText}
                                style={{ display: "block" }}>
                                <rect width="32" height="18" rx="9" fill="currentColor" opacity="0.8" />
                                <path d="M9 0a9 9 0 0 0 0 18Z" fill="currentColor" />
                                <text x="19" y="9" textAnchor="middle" dominantBaseline="central"
                                    fontSize="11" fontWeight="600" style={{ fontVariantNumeric: "tabular-nums" }}
                                    fill={autoTint ? "var(--ffsb-contrast, #111)" : status.tone === "dark" ? "#fff" : "#111"}>
                                    {status.batteryText}
                                </text>
                            </svg>
                        ) : (
                        <svg
                            width="25"
                            height="12"
                            viewBox="0 0 25 12"
                            style={{ display: "block", opacity: 0.95 }}
                            aria-hidden="true"
                        >
                            <rect
                                x="0.75"
                                y="0.75"
                                width="21.5"
                                height="10.5"
                                rx="3.25"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <rect
                                x="2.75"
                                y="2.75"
                                width="13.5"
                                height="6.5"
                                rx="1.5"
                                fill="currentColor"
                            />
                            <rect
                                x="23.25"
                                y="4.25"
                                width="1.5"
                                height="3.5"
                                rx="0.75"
                                fill="currentColor"
                                opacity="0.55"
                            />
                        </svg>
                        )}
                    </span>
                )}
            </div>
        ) : null

    // Realistic crease: soft depression + highlight, blends with anything underneath.
    const crease = (side: "left" | "right" | "top" | "bottom" | "center") => {
        // barely-there, like a real foldable in daylight: a soft dip with a faint sheen
        // a wide, very soft dip only (no line, no highlight): you sense the fold, you don't see a seam
        const w = 72
        const grad = (dir: string) =>
            `linear-gradient(${dir}, rgba(0,0,0,0) 0%, rgba(0,0,0,.008) 35%, rgba(0,0,0,.016) 50%, rgba(0,0,0,.008) 65%, rgba(0,0,0,0) 100%)`
        const base: React.CSSProperties = {
            ...abs,
            pointerEvents: "none",
            zIndex: 7,
        }
        if (!port) {
            const left =
                side === "left"
                    ? `calc(100% - ${w / 2}px)`
                    : side === "right"
                      ? `${-w / 2}px`
                      : `calc(50% - ${w / 2}px)`
            return (
                <div
                    data-crease="1"
                    style={{
                        ...base,
                        top: 0,
                        bottom: 0,
                        width: w,
                        left,
                        background: grad("90deg"),
                    }}
                />
            )
        }
        const top =
            side === "top"
                ? `calc(100% - ${w / 2}px)`
                : side === "bottom"
                  ? `${-w / 2}px`
                  : `calc(50% - ${w / 2}px)`
        return (
            <div
                style={{
                    ...base,
                    left: 0,
                    right: 0,
                    height: w,
                    top,
                    background: grad("180deg"),
                }}
            />
        )
    }
    // one sheen across the whole display: each half shows its part of a device-wide gradient
    const sheen = (part?: "L" | "R") => (
        <div
            style={{
                ...fill,
                pointerEvents: "none",
                zIndex: 8,
                background:
                    "linear-gradient(118deg, rgba(255,255,255,.08) 0%, rgba(255,255,255,.025) 22%, rgba(255,255,255,0) 38%)",
                backgroundSize: part
                    ? port
                        ? "100% 200%"
                        : "200% 100%"
                    : "100% 100%",
                backgroundPosition:
                    part === "R" ? (port ? "50% 100%" : "100% 50%") : "0 0",
            }}
        />
    )

    // Screen content copies
    const contentCopy = (which: "L" | "R" | "open") => {
        const ref = which === "L" ? R.cL : which === "R" ? R.cR : R.cOpen
        const offX = !port && which === "R" ? -halfW : 0
        const offY = port && which === "R" ? -halfH : 0
        return (
            <div
                ref={ref}
                aria-hidden={which === "L" ? true : undefined}
                style={{
                    ...abs,
                    left: offX,
                    top: offY,
                    width: Ws,
                }}
            >
                <div
                    ref={
                        which === (mode === "fold" ? "R" : "open")
                            ? measureRef
                            : undefined
                    }
                    style={{ width: Ws }}
                >
                    <Slot node={screenNode} width={Ws} />
                </div>
            </div>
        )
    }

    // ---------------------------------------------------------------- device (v7: flat pieces)
    // The phone is made of three flat pieces: the right half (never moves), the left half
    // (turns over the hinge while it opens) and the cover (the back of the left half, seen
    // when the phone is closed). Each piece is a single element with its own simple
    // perspective turn — no nested 3D scene — and when the phone is open everything is plain
    // 2D. That keeps every browser/GPU drawing the whole screen reliably.
    const leafBox: React.CSSProperties = land
        ? {
              ...abs,
              left: 0,
              top: 0,
              width: G.W / 2,
              height: G.H,
              transformOrigin: "100% 50%",
          }
        : {
              ...abs,
              left: 0,
              top: 0,
              width: G.W,
              height: G.H / 2,
              transformOrigin: "50% 100%",
          }
    const rightBox: React.CSSProperties = land
        ? {
              ...abs,
              left: G.W / 2,
              top: 0,
              width: G.W / 2,
              height: G.H,
              transformOrigin: "0% 50%",
          }
        : {
              ...abs,
              left: 0,
              top: G.H / 2,
              width: G.W,
              height: G.H / 2,
              transformOrigin: "50% 0%",
          }
    // insets for glass / screen; the hinge side has none so the two screens meet
    const insets = (
        v: number,
        hinge: "L" | "R" | "T" | "B" | "none",
        bleed = 0
    ) => ({
        top: hinge === "T" ? -bleed : v,
        bottom: hinge === "B" ? -bleed : v,
        left: hinge === "L" ? -bleed : v,
        right: hinge === "R" ? -bleed : v,
    })
    const hingeOfLeaf = land ? "R" : "B"
    const hingeOfRight = land ? "L" : "T"
    const cornerT = "border-radius .35s cubic-bezier(.2,.7,.2,1)"
    const body = (
        corners: string,
        hinge: "L" | "R" | "T" | "B" | "none",
        children: React.ReactNode,
        refs?: [any, any, any],
        extra?: React.ReactNode,
        bleed = 0
    ) => (
        <>
            <div
                ref={refs && refs[0]}
                style={{
                    ...abs,
                    ...insets(0, hinge, bleed),
                    borderRadius: corners,
                    background: slabBg,
                    boxShadow: slabShadow,
                    transition: refs ? cornerT : undefined,
                }}
            />
            <div
                ref={refs && refs[1]}
                style={{
                    ...abs,
                    ...insets(G.f, hinge, bleed),
                    borderRadius: inner(corners, G.f),
                    background: "#050505",
                    transition: refs ? cornerT : undefined,
                }}
            />
            <div
                ref={refs && refs[2]}
                style={{
                    ...abs,
                    ...insets(b, hinge, bleed),
                    borderRadius: inner(corners, b),
                    background: screenColor,
                    overflow: "hidden",
                    contain: "paint",
                    transition: refs ? cornerT : undefined,
                }}
            >
                {children}
            </div>
            {extra}
        </>
    )
    const shadeGrad = (dir: "front" | "back" | "right") => {
        const d = land ? "90deg" : "180deg"
        if (dir === "front")
            return `linear-gradient(${d}, rgba(0,0,0,.05) 0%, rgba(0,0,0,.55) 100%)`
        if (dir === "back")
            return `linear-gradient(${d}, rgba(0,0,0,.5) 0%, rgba(0,0,0,.05) 100%)`
        return `linear-gradient(${d}, rgba(0,0,0,.6) 0%, rgba(0,0,0,0) 70%)`
    }
    // Side buttons (volume + power) on the outer frame
    const sideButtons = (
        <>
            {[
                [0.17, 0.1],
                [0.31, 0.06],
            ].map(([top, h], i) => (
                <div
                    key={i}
                    style={{
                        ...abs,
                        right: -3,
                        width: 5,
                        borderRadius: 3,
                        top: land
                            ? `${top * 100}%`
                            : `${(top * 0.8 + 0.05) * 100}%`,
                        height: `${h * (land ? 100 : 160)}%`,
                        background: `linear-gradient(90deg, ${F[3]}, ${F[2]} 45%, ${F[1]})`,
                        boxShadow: "0 0 0 .5px rgba(0,0,0,.2)",
                    }}
                />
            ))}
        </>
    )

    const foldMode = mode === "fold"

    const floorShadows = (
        <>
            <div
                ref={R.shadow}
                style={{
                    ...abs,
                    left: "50%",
                    top: "100%",
                    marginTop: G.H * 0.045,
                    height: G.H * 0.09,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(closest-side, rgba(0,0,0,.16), rgba(0,0,0,.06) 50%, rgba(0,0,0,0))",
                    width: G.W * 1.05,
                    transform: "translateX(-50%)",
                    transformOrigin: "50% 50%",
                    pointerEvents: "none",
                }}
            />
            <div
                ref={R.shadowC}
                style={{
                    ...abs,
                    left: "50%",
                    top: "100%",
                    marginTop: G.H * 0.012,
                    height: G.H * 0.03,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(closest-side, rgba(0,0,0,.22), rgba(0,0,0,.07) 55%, rgba(0,0,0,0))",
                    width: G.W * 0.86,
                    transform: "translateX(-50%)",
                    transformOrigin: "50% 50%",
                    pointerEvents: "none",
                }}
            />
        </>
    )

    const coverInner = (
        <>
            {coverNode && (
                <div
                    style={{ ...fill, cursor: "pointer" }}
                    onClick={(e) => {
                        // tap the closed phone to unfold it
                        const tg = e.target as HTMLElement
                        if (
                            tg &&
                            tg.closest &&
                            tg.closest("a,button,input,select,textarea")
                        )
                            return
                        const el = rootRef.current
                        if (!el || live.current.k < 0.9) return
                        const top0 =
                            el.getBoundingClientRect().top + window.scrollY
                        window.scrollTo({
                            top: top0 + geo.current.U1 + 2,
                            behavior: "smooth",
                        })
                    }}
                >
                    <Slot
                        node={coverNode}
                        width="100%"
                        style={{ height: "100%" }}
                    />
                </div>
            )}
            {callNode && (
                <div
                    ref={R.call}
                    style={{
                        ...fill,
                        opacity: 0,
                        zIndex: 4,
                    }}
                >
                    <Slot
                        node={callNode}
                        width="100%"
                        style={{ height: "100%" }}
                    />
                </div>
            )}
            {sheen()}
        </>
    )

    const device = (
        <div
            ref={R.dev}
            style={{
                ...abs,
                left: -G.W / 2,
                top: -G.H / 2,
                width: G.W,
                height: G.H,
            }}
        >
            {floorShadows}
            {foldMode ? (
                <>
                    {/* right / bottom half: never moves */}
                    <div ref={R.rightH} style={rightBox}>
                        {body(
                            cRight,
                            hingeOfRight,
                            <>
                                {contentCopy("R")}
                                {land && statusBar("right")}
                                {crease(land ? "right" : "bottom")}
                                {sheen("R")}
                            </>,
                            [R.rBody, R.rGlass, R.rScreen],
                            <>
                                {sideButtons}
                                <div
                                    ref={R.shR}
                                    style={{
                                        ...fill,
                                        borderRadius: cRight,
                                        background: shadeGrad("right"),
                                        opacity: 0,
                                        pointerEvents: "none",
                                        zIndex: 9,
                                        transition: cornerT,
                                    }}
                                />
                            </>
                        )}
                    </div>
                    {/* left / top half: turns over the hinge */}
                    <div ref={R.leaf} style={{ ...leafBox }}>
                        {body(
                            cLeaf,
                            hingeOfLeaf,
                            <>
                                {contentCopy("L")}
                                {statusBar(land ? "left" : "all")}
                                {crease(land ? "left" : "top")}
                                {sheen("L")}
                            </>,
                            undefined,
                            <div
                                ref={R.shF}
                                style={{
                                    ...fill,
                                    borderRadius: cLeaf,
                                    background: shadeGrad("front"),
                                    opacity: 0,
                                    pointerEvents: "none",
                                    zIndex: 9,
                                }}
                            />,
                            hingeBleed
                        )}
                    </div>
                    {/* cover: the outside of the left half, lies on the right half when closed */}
                    <div
                        ref={R.cover}
                        style={{ ...rightBox, visibility: "hidden" }}
                    >
                        <div
                            style={{
                                ...fill,
                                borderRadius: cAll,
                                background: slabBg,
                                boxShadow: slabShadow,
                            }}
                        />
                        <div
                            style={{
                                ...abs,
                                inset: G.f,
                                borderRadius: Ro - G.f,
                                background: "#050505",
                            }}
                        />
                        <div
                            style={{
                                ...abs,
                                inset: b,
                                borderRadius: Ro - b,
                                background: screenColor,
                                overflow: "hidden",
                                contain: "paint",
                            }}
                        >
                            {coverInner}
                        </div>
                        {sideButtons}
                        <div
                            ref={R.shB}
                            style={{
                                ...fill,
                                borderRadius: cAll,
                                background: shadeGrad("back"),
                                opacity: 0,
                                pointerEvents: "none",
                                zIndex: 9,
                            }}
                        />
                    </div>
                </>
            ) : (
                /* Open mode: one continuous display */
                <div ref={R.openBlk} style={{ ...fill }}>
                    {body(
                        cAll,
                        "none",
                        <>
                            {contentCopy("open")}
                            {crease("center")}
                            {sheen()}
                        </>,
                        undefined,
                        sideButtons
                    )}
                </div>
            )}

            {/* nav + status on top of the open display */}
            <div
                ref={R.overlay}
                style={{
                    ...abs,
                    left: b,
                    top: b,
                    width: Ws,
                    height: Hs,
                    borderRadius: Ri,
                    overflow: "hidden",
                    pointerEvents: "none",
                    opacity: foldMode ? 0 : 1,
                    zIndex: 10,
                }}
            >
                {!foldMode && statusBar("all")}
                {navNode && (
                    <div
                        style={{
                            ...abs,
                            left: 0,
                            right: 0,
                            bottom: port ? 16 : 20,
                            display: "flex",
                            justifyContent: "center",
                            pointerEvents: "auto",
                        }}
                    >
                        <Slot node={navNode} />
                    </div>
                )}
            </div>
        </div>
    )


    return { device }
}
