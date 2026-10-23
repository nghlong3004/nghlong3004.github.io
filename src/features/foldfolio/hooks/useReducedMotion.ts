import { useSyncExternalStore } from 'react'

const query = '(prefers-reduced-motion: reduce)'
const read = () => window.matchMedia(query).matches
const serverValue = () => false
const subscribe = (callback: () => void) => {
  const media = window.matchMedia(query)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, read, serverValue)
}
