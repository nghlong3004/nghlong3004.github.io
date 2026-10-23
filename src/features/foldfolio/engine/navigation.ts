import type { GeometryState } from './types'

export function getSectionScrollY(
  rootTop: number,
  sectionTop: number,
  geometry: Pick<GeometryState, 'mode' | 'U1' | 's' | 'innerMax'>,
) {
  const inner = Math.max(0, Math.min(sectionTop - 48, geometry.innerMax))
  return rootTop + (geometry.mode === 'fold' ? geometry.U1 : 0) + inner * geometry.s
}
