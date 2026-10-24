import type { FoldfolioProps } from '../../features/foldfolio/types'
import { formatVietnamTime } from '../../features/portfolio/lib/vietnamTime'

export const deviceConfig = {
  mode: 'fold',
  scene: 'glow',
  glowColors: ['#95b8ad', '#b6c2de', '#dbc6b6'],
  finish: 'titanium',
  customFinish: '#C9D3E0',
  screenColor: '#f5f6f4',
  switcher: { show: true, scenesAt: 'header', top: 15, right: 28, bottom: 18 },
  status: { show: true, time: formatVietnamTime(), live: false, tone: 'auto' },
  layout: { orientation: 'auto', portraitBelow: 700, top: 72, bottom: 32, maxScale: 1.3 },
  motion: { openLength: 1.15, closeLength: 1.1, holdLength: 0.4, smoothing: 0.12, float: false, glass: false },
  screenMotion: { on: true, headlines: true, images: true, counters: true, hover: true, duration: 1, distance: 26, stagger: 0.06 },
  preview: 30,
} satisfies FoldfolioProps
