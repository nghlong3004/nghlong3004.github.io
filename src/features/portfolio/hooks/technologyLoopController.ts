export interface LoopFrame { distance: number; intro: number }
interface Subscriber {
  paint: (frame: LoopFrame) => void
  active: () => boolean
}
interface LoopClock {
  request: (callback: FrameRequestCallback) => number
  cancel: (id: number) => void
}

// One logical timeline per provider/key, never one independent clock per hardware copy.
export function createTechnologyLoopController(clock: LoopClock = {
  request: callback => requestAnimationFrame(callback),
  cancel: id => cancelAnimationFrame(id),
}) {
  const subscribers = new Set<Subscriber>()
  const pauses = new Set<symbol>()
  let raf = 0
  let last: number | null = null
  let elapsed = 0
  let distance = 0

  const paused = () => pauses.size > 0
  const paint = () => {
    const frame = { distance, intro: paused() ? 1 : Math.min(1, elapsed / 0.7) }
    for (const subscriber of subscribers) subscriber.paint(frame)
  }
  const stop = () => {
    if (raf) clock.cancel(raf)
    raf = 0
    last = null
  }
  const running = () => !paused() && [...subscribers].some(subscriber => subscriber.active())
  const tick = (now: number) => {
    raf = 0
    if (!running()) { last = null; return }
    const dt = last === null ? 0 : Math.min(0.05, Math.max(0, (now - last) / 1000))
    last = now
    elapsed += dt
    distance += dt * 100
    paint()
    raf = clock.request(tick)
  }
  const refresh = () => {
    if (!running()) stop()
    else if (!raf) raf = clock.request(tick)
    paint()
  }

  return {
    refresh,
    register(subscriber: Subscriber) {
      subscribers.add(subscriber)
      refresh()
      return () => {
        subscribers.delete(subscriber)
        if (!subscribers.size) stop()
        else refresh()
      }
    },
    pause(token: symbol, value: boolean) {
      if (value) pauses.add(token)
      else pauses.delete(token)
      refresh()
    },
    destroy() { stop(); subscribers.clear(); pauses.clear() },
  }
}

export type TechnologyLoopController = ReturnType<typeof createTechnologyLoopController>
