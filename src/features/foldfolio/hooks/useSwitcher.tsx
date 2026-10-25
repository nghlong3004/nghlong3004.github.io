import { useState, useEffect } from "react"
import type * as React from "react"
import { createPortal } from "react-dom"
import { SCENES, FINISH_KEYS, FINISHES } from "../config/constants"
import { abs } from "../styles/motion"
import type { FoldfolioProps, Scene, Finish } from "../types"

export function useSwitcher({
    vp, switcher, scene, choose, isCanvas, pick,
}: {
    vp: { w: number; h: number }
    switcher: FoldfolioProps["switcher"]
    scene: Scene
    choose: (pick: Partial<{ scene: Scene; finish: Finish }>) => void
    isCanvas: boolean
    pick: { scene: Scene; finish: Finish }
}) {
    // ---------------------------------------------------------------- live switcher
    const compact = vp.w < 560
    const glass: React.CSSProperties = {
        display: "flex",
        borderRadius: 999,
        background: "rgba(255,255,255,.92)",
        boxShadow:
            "inset 0 0 0 1px rgba(0,0,0,.06), 0 10px 30px -12px rgba(0,0,0,.25)",
    }
    // Split / Glow / Orbit: in the site header (top right) or under the device
    const scenesInHeader = (switcher.scenesAt || "header") === "header"
    const scenePill = (inHeader: boolean) => (
        <div
            role="radiogroup"
            aria-label="Background"
            style={{
                ...glass,
                gap: 2,
                padding: inHeader ? 3 : 4,
                font: "500 12px/1 'Geist', system-ui, sans-serif",
                color: "#111",
            }}
        >
            {SCENES.map((sc) => (
                <button
                    key={sc.key}
                    role="radio"
                    aria-checked={scene === sc.key}
                    onClick={() => choose({ scene: sc.key })}
                    style={{
                        all: "unset",
                        cursor: "pointer",
                        padding: inHeader
                            ? compact
                                ? "7px 10px"
                                : "8px 13px"
                            : compact
                              ? "8px 10px"
                              : "9px 13px",
                        borderRadius: 999,
                        background: scene === sc.key ? "#111" : "transparent",
                        color: scene === sc.key ? "#fff" : "#111",
                        transition: "background .3s, color .3s",
                    }}
                >
                    {sc.label}
                </button>
            ))}
        </div>
    )
    // header placement lives on the page itself (above Framer's fixed header), not in the stage
    const [portalOn, setPortalOn] = useState(false)
    useEffect(() => {
        if (!isCanvas && typeof document !== "undefined") setPortalOn(true)
    }, [isCanvas])
    const hTop = switcher.top ?? 15
    const hRight = switcher.right ?? 28
    const headerSwitcher =
        switcher.show && scene !== "none" && scenesInHeader ? (
            isCanvas ? (
                <div style={{ ...abs, top: hTop, right: hRight, zIndex: 30 }}>
                    {scenePill(true)}
                </div>
            ) : portalOn ? (
                createPortal(
                    <div
                        data-ff-switcher=""
                        style={{
                            position: "fixed",
                            top: hTop,
                            right: hRight,
                            zIndex: 60,
                            pointerEvents: "auto",
                        }}
                    >
                        {scenePill(true)}
                    </div>,
                    document.body
                )
            ) : null
        ) : null
    const dotsLeft = compact && scenesInHeader
    const switcherUI = switcher.show ? (
        <div
            data-ff-dots=""
            style={{
                ...abs,
                left: dotsLeft ? (switcher.right ?? 28) : "50%",
                bottom: switcher.bottom,
                transform: dotsLeft ? "none" : "translateX(-50%)",
                display: "flex",
                gap: 8,
                alignItems: "center",
                zIndex: 20,
                pointerEvents: "auto",
                font: "500 12px/1 'Geist', system-ui, sans-serif",
                color: "#111",
            }}
        >
            {scene !== "none" && !scenesInHeader && scenePill(false)}
            <div
                role="radiogroup"
                aria-label="Finish"
                style={{ ...glass, gap: 8, padding: "8px 10px" }}
            >
                {FINISH_KEYS.map((fk) => (
                    <button
                        key={fk}
                        role="radio"
                        aria-checked={pick.finish === fk}
                        aria-label={FINISHES[fk].label}
                        title={FINISHES[fk].label}
                        onClick={() => choose({ finish: fk })}
                        style={{
                            all: "unset",
                            cursor: "pointer",
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, ${FINISHES[fk].c[2]}, ${FINISHES[fk].c[1]})`,
                            boxShadow:
                                pick.finish === fk
                                    ? "0 0 0 2px #fff, 0 0 0 3.5px #111"
                                    : "inset 0 0 0 1px rgba(0,0,0,.15)",
                            transition: "box-shadow .3s",
                        }}
                    />
                ))}
            </div>
        </div>
    ) : null


    return { switcherUI, headerSwitcher }
}
