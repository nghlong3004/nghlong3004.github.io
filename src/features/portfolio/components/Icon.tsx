import type { CSSProperties } from 'react'

type IconName = 'arrow' | 'up' | 'plus' | 'minus' | 'mail' | 'phone'
const paths: Record<IconName, string[]> = {
  arrow: ['M7 17 17 7', 'M7 7h10v10'],
  up: ['M12 19V5', 'm5 12 7-7 7 7'],
  plus: ['M12 5v14', 'M5 12h14'],
  minus: ['M5 12h14'],
  mail: ['M4 5h16v14H4z', 'm4 6 8 7 8-7'],
  phone: ['M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-7-7l2-2-2-5Z'],
}

export function Icon({ name = 'arrow', size = 18, style }: { name?: IconName; size?: number; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" style={style}>
    {paths[name].map((path) => <path key={path} d={path} />)}
  </svg>
}
