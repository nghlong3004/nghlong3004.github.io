import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { transformWithOxc } from 'vite'
import { readFile } from 'node:fs/promises'

test('official slide keeps its track/thumb design, localized labels and real keyboard button', async () => {
  const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { default: SlideToConfirm } = await server.ssrLoadModule('/src/features/portfolio/components/kokonut/SlideToConfirm.tsx')
    const html = renderToStaticMarkup(createElement(SlideToConfirm, { label: 'Trượt để về màn hình đầu', confirmingLabel: 'Đang trở về', doneLabel: 'Đã trở về', keyboardHint: 'Nhấn Enter hoặc phím cách để xác nhận.', onConfirm() {} }))
    assert.ok(html.includes('data-phase="idle"'))
    assert.ok(html.includes('height:56px') && html.includes('width:48px'))
    assert.ok(html.includes('bg-zinc-100') && html.includes('rounded-full'))
    assert.ok(html.includes('type="button"') && html.includes('aria-live="polite"'))
    assert.ok(html.includes('aria-label="Trượt để về màn hình đầu. Nhấn Enter hoặc phím cách để xác nhận."'))
    assert.ok(!html.includes('motion-reduce:'))
  } finally { await server.close() }
})

test('unmount cancels slider timers and motion without late confirmation or tap writes', async () => {
  const source = await readFile(new URL('../src/features/portfolio/components/kokonut/SlideToConfirm.tsx', import.meta.url), 'utf8')
  const { code } = await transformWithOxc(source, 'SlideToConfirm.tsx', { jsx: { runtime: 'automatic' } })
  const data = text => 'data:text/javascript,' + encodeURIComponent(text)
  const jsx = data('export const jsx=(type,props)=>({type,props});export const jsxs=jsx')
  const react = data(`
    export const useRef=v=>({current:v});
    export const useState=v=>[v,()=>globalThis.__slide.writes++];
    export const useLayoutEffect=()=>{};
    export const useEffect=fn=>globalThis.__slide.effect=fn;
  `)
  const motion = data(`
    export const motion={div:'div',span:'span',button:'button'};
    export const AnimatePresence='presence';
    export const useTransform=()=>({});
    export function useMotionValue(value){const v={get:()=>value,set:n=>value=n,stop:()=>globalThis.__slide.stops++};return v}
    export function animate(){const f=globalThis.__slide;f.animations++;return new Promise(resolve=>f.landings.push(resolve))}
  `)
  const icons = data('export const ArrowRight="arrow";export const Check="check"')
  const classes = data('export const cn=(...v)=>v.filter(Boolean).join(" ")')
  const { default: Slide } = await import(data(code
    .replaceAll('"react/jsx-runtime"', JSON.stringify(jsx))
    .replaceAll('"react"', JSON.stringify(react))
    .replaceAll('"motion/react"', JSON.stringify(motion))
    .replaceAll('"lucide-react"', JSON.stringify(icons))
    .replaceAll('"../../lib/classes"', JSON.stringify(classes))))
  const findButton = node => {
    if (!node || typeof node !== 'object') return
    if (node.type === 'button') return node
    return [node.props?.children].flat().map(findButton).find(Boolean)
  }
  const previousWindow = globalThis.window
  try {
    for (const detail of [0, 1]) {
      const f = globalThis.__slide = { writes: 0, stops: 0, animations: 0, landings: [], timers: new Map() }
      let id = 0
      globalThis.window = { setTimeout: fn => { f.timers.set(++id, fn); return id }, clearTimeout: key => f.timers.delete(key) }
      const button = findButton(Slide({}))
      const stop = f.effect()
      const action = button.props.onClick({ detail })
      assert.equal(f.timers.size, detail === 0 ? 2 : 0)
      const writes = f.writes, animations = f.animations
      stop()
      assert.equal(f.timers.size, 0)
      assert.equal(f.stops, 2)
      f.landings.forEach(resolve => resolve())
      await action
      await Promise.resolve(); await Promise.resolve()
      assert.equal(f.writes, writes)
      assert.equal(f.animations, animations)
    }
  } finally { globalThis.window = previousWindow; delete globalThis.__slide }
})
