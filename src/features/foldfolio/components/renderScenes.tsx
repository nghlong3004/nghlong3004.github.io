import type * as React from "react"
import type { RefObject } from "react"
import type { DeviceRefs } from "../hooks/useDeviceRefs"
import type { FoldfolioProps, Scene } from "../types"
import type { IntroConfig, NameSize, Geometry } from "../engine/types"
import { clamp } from "../lib/math"
import { mixHex } from "../lib/colors"
import { Slot } from "./Slot"
import { abs, fill } from "../styles/motion"

export function renderScenes({
    props, F, introCfg, scene, pageBg, port, cy, stageH, nameL, nameR, R, nlRef, nameSize, nrRef, G, s, cardW,
}: {
    props: FoldfolioProps
    F: string[]
    introCfg: IntroConfig
    scene: Scene
    pageBg: string
    port: boolean
    cy: number
    stageH: number
    nameL: React.ReactElement | null
    nameR: React.ReactElement | null
    R: DeviceRefs
    nlRef: RefObject<HTMLDivElement | null>
    nameSize: NameSize
    nrRef: RefObject<HTMLDivElement | null>
    G: Geometry
    s: number
    cardW: number
}) {
    // ---------------------------------------------------------------- scenes
    // Basic (key "split"): one soft tint of the frame colour that follows the finish (+ your names, if connected)
    const tone = props.basicTone || "tint"
    const splitA =
        tone === "white"
            ? "#FFFFFF"
            : mixHex(F[0], "#FFFFFF", tone === "two" ? 0.84 : 0.8)
    const splitB = tone === "two" ? mixHex(F[0], "#FFFFFF", 0.6) : splitA
    // the intro curtain matches what is behind it (Basic tint, or the page colour)
    const curtainBg =
        introCfg.color || (scene === "split" ? splitA : pageBg || "#FFFFFF")
    const splitLayer =
        scene === "split" ? (
            <div
                style={{
                    ...fill,
                    pointerEvents: "none",
                    background: port
                        ? `linear-gradient(180deg, ${splitA} 0%, ${splitA} ${(cy / stageH) * 100}%, ${splitB} ${(cy / stageH) * 100}%, ${splitB} 100%)`
                        : `linear-gradient(90deg, ${splitA} 0%, ${splitA} 50%, ${splitB} 50%, ${splitB} 100%)`,
                    transition: "background .6s ease",
                }}
            />
        ) : null
    const namesLayer =
        scene === "split" && (nameL || nameR) ? (
            <div style={{ ...fill, pointerEvents: "none", overflow: "hidden" }}>
                <div
                    ref={R.nmL}
                    style={{
                        ...abs,
                        left: 0,
                        top: 0,
                    }}
                >
                    <div
                        ref={nlRef}
                        style={{
                            width:
                                nameSize.lw > 1 ? nameSize.lw : "max-content",
                            height: nameSize.lh > 1 ? nameSize.lh : "auto",
                        }}
                    >
                        <Slot node={nameL} width="max-content" />
                    </div>
                </div>
                <div
                    ref={R.nmR}
                    style={{
                        ...abs,
                        left: 0,
                        top: 0,
                    }}
                >
                    <div
                        ref={nrRef}
                        style={{
                            width:
                                nameSize.rw > 1 ? nameSize.rw : "max-content",
                            height: nameSize.rh > 1 ? nameSize.rh : "auto",
                        }}
                    >
                        <Slot node={nameR} width="max-content" />
                    </div>
                </div>
            </div>
        ) : null

    // Glow: the image on screen, blown up into soft light behind the phone
    const glowPad = clamp(Math.min(G.W, G.H) * s * 0.32, 60, 170)
    const glowW = G.W * s * (props.glowColors && !port ? 1.55 : 1.02) + glowPad * 2,
        glowH = G.H * s * 1.02 + glowPad * 2
    const glowPlates = (bh: number) =>
        [0, 1].map((i) => (
            <canvas
                key={i}
                width={48}
                height={bh}
                style={{
                    ...fill,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    transition: props.glowColors ? "none" : "opacity .6s ease",
                }}
            />
        ))
    const glowLayer =
        scene === "glow" ? (
            <div data-ff-glow="" style={{ ...fill, pointerEvents: "none", overflow: "hidden" }}>
                <div
                    ref={R.glow}
                    style={{
                        ...abs,
                        left: "50%",
                        top: cy,
                        width: glowW,
                        height: glowH,
                    }}
                >
                    {glowPlates(
                        clamp(Math.round((48 * glowH) / glowW), 16, 96)
                    )}
                </div>
                <div
                    ref={R.glowR}
                    style={{
                        ...abs,
                        left: "50%",
                        top: cy + G.H * s * 0.5,
                        width: G.W * s * 0.9 + glowPad,
                        height: G.H * s * 0.3 + glowPad,
                    }}
                >
                    {glowPlates(
                        clamp(
                            Math.round(
                                (48 * (G.H * s * 0.3 + glowPad)) /
                                    (G.W * s * 0.9 + glowPad)
                            ),
                            12,
                            96
                        )
                    )}
                </div>
            </div>
        ) : null

    // Orbit: cards with your images circling the phone
    const orbitLayer =
        scene === "orbit" ? (
            <div
                ref={R.orbit}
                style={{ ...fill, pointerEvents: "none", overflow: "hidden" }}
            >
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        data-orb={i}
                        style={{
                            ...abs,
                            left: 0,
                            top: 0,
                            width: cardW,
                            height: Math.round(cardW * 1.28),
                            borderRadius: 12,
                            opacity: 0,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            boxShadow:
                                "0 16px 30px -16px rgba(0,0,0,.35), 0 0 0 1px rgba(0,0,0,.05)",
                        }}
                    />
                ))}
            </div>
        ) : null


    return { splitLayer, namesLayer, glowLayer, orbitLayer, curtainBg }
}
