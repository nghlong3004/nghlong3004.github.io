import { useEffect, useState } from 'react'
import { formatVietnamTime } from '../lib/vietnamTime'

export function useVietnamClock() {
  const [time, setTime] = useState(formatVietnamTime)
  useEffect(() => {
    const update = () => setTime(formatVietnamTime())
    const interval = window.setInterval(update, 1000)
    document.addEventListener('visibilitychange', update)
    window.addEventListener('focus', update)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', update)
      window.removeEventListener('focus', update)
    }
  }, [])
  return time
}
