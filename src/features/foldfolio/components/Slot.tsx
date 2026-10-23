import * as React from "react"

// Render a connected frame at the width we decide (height stays the frame's own).
export function Slot({
    node,
    width,
    style,
}: {
    node: React.ReactElement | null
    width?: number | string
    style?: React.CSSProperties
}) {
    if (!node) return null
    const s = (node.props && (node.props as any).style) || {}
    return React.cloneElement(node as React.ReactElement<any>, {
        style: {
            ...s,
            position: "relative",
            left: 0,
            top: 0,
            width: width === undefined ? s.width : width,
            ...style,
        },
    })
}
