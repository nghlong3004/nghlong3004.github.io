export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)

export const eio = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
export const eo = (t: number) => 1 - Math.pow(1 - t, 3)

export const easeOut = (p: number) => 1 - Math.pow(1 - p, 3)
