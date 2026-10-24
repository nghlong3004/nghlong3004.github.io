const MIGRATION_KEY = 'portfolio:glow-default:v1'

export function applyGlowDefault(storage: Pick<Storage, 'getItem' | 'setItem'>) {
  try {
    if (storage.getItem(MIGRATION_KEY) === '1') return
    let saved
    try { saved = JSON.parse(storage.getItem('foldfolio:style') || '{}') } catch { saved = {} }
    const style = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {}
    storage.setItem('foldfolio:style', JSON.stringify({ ...style, scene: 'glow' }))
    storage.setItem(MIGRATION_KEY, '1')
  } catch { /* Without storage, the configured Glow default still applies. */ }
}
