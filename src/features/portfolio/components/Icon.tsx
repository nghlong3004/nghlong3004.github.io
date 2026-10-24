import type { CSSProperties } from 'react'
import { brandIcons, type BrandIconName } from '../lib/brandIcons'

type UtilityIconName = 'arrow' | 'up' | 'plus' | 'minus' | 'mail'
type IconName = UtilityIconName | BrandIconName

const paths: Record<UtilityIconName, string[]> = {
  arrow: ['M7 17 17 7', 'M7 7h10v10'],
  up: ['M12 19V5', 'm5 12 7-7 7 7'],
  plus: ['M12 5v14', 'M5 12h14'],
  minus: ['M5 12h14'],
  mail: ['M4 5h16v14H4z', 'm4 6 8 7 8-7'],
}

function isBrandIcon(name: IconName): name is BrandIconName {
  return Object.hasOwn(brandIcons, name)
}

export function Icon({ name = 'arrow', size = 18, style }: { name?: IconName; size?: number; style?: CSSProperties }) {
  if (isBrandIcon(name)) {
    const BrandIcon = brandIcons[name]
    const brandStyle: CSSProperties = name === 'instagram'
      ? { color: 'white', background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)', borderRadius: size / 4, ...style }
      : name === 'linkedin'
        ? { color: '#0a66c2', background: '#fff', borderRadius: 2, ...style }
        : style ?? {}

    return <BrandIcon aria-hidden="true" focusable="false" size={size} style={brandStyle} />
  }

  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true" focusable="false">
    {paths[name].map((path) => <path key={path} d={path} />)}
  </svg>
}
