import { useEffect, useState } from 'react'
import { formatVietnamTime, getCompletedAgeInVietnam } from '../lib/vietnamTime'

function readClock() {
  const date = new Date()
  return { time: formatVietnamTime(date), age: getCompletedAgeInVietnam(date) }
}

export function useVietnamClock() {
  const [clock, setClock] = useState(readClock)
  useEffect(() => {
    const update = () => {
      const next = readClock()
      setClock(current => current.time === next.time && current.age === next.age ? current : next)
    }
    const interval = window.setInterval(update, 1000)
    document.addEventListener('visibilitychange', update)
    window.addEventListener('focus', update)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', update)
      window.removeEventListener('focus', update)
    }
  }, [])
  return clock
}
