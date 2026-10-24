import assert from 'node:assert/strict'
import test from 'node:test'
import { registerHooks } from 'node:module'

// Exercise the real hook with a deterministic effect/clock boundary; actual React is browser-tested.
const data = source => 'data:text/javascript,' + encodeURIComponent(source)
const bridges = {
  react: data('export const useRef=v=>globalThis.__pageEffects.ref(v);export const useEffect=f=>globalThis.__pageEffects.passive.push(f)'),
  './useIsoLayoutEffect': data('export const useIsoLayoutEffect=f=>globalThis.__pageEffects.layout.push(f)'),
  '../engine/snapshots': data('export const SNAP_ID="ff-pagesnap";export const takeSnapshot=s=>globalThis.__pageEffects.take(s);export const releaseSnapshot=(ms,s)=>globalThis.__pageEffects.release(ms,s)'),
}
const resolver = registerHooks({ resolve(specifier, context, next) {
  return next(context.parentURL?.endsWith('/hooks/usePageTransitions.ts') && bridges[specifier]
    ? bridges[specifier] : specifier, context)
} })
const { usePageTransitions: runPageTransitions } = await import('../src/features/foldfolio/hooks/usePageTransitions.ts')
resolver.deregister()

function fixture({ seen = false, reduced = false, hidden = false, snapshot = null } = {}) {
  let now = 100, next = 0, writes = 0
  const frames = new Map(), timers = new Map(), slots = [], storage = new Map(seen ? [['ff-seen', '1']] : [])
  class Target extends EventTarget {
    listeners = new Set()
    addEventListener(type, fn, options) { this.listeners.add(fn); super.addEventListener(type, fn, options) }
    removeEventListener(type, fn, options) { this.listeners.delete(fn); super.removeEventListener(type, fn, options) }
  }
  const node = () => ({ style: new Proxy({}, { set(o,k,v) { writes++; o[k]=v; return true } }), textContent: 'NAMES', querySelectorAll: () => [], getBoundingClientRect: () => ({ top: 0 }) })
  const dots = node(), head = node(), stage = { ...node(), querySelector: () => dots }
  const R = Object.fromEntries(['iCur','iA','iB','iSeam','iDev','iNames','cL','cR','cOpen'].map(k => [k,{current:node()}]))
  R.stage = { current: stage }
  const window = new Target(), document = new Target()
  Object.assign(window, { innerWidth: 1440, innerHeight: 900, scrollY: 0, matchMedia: () => ({ matches: reduced }),
    sessionStorage: { getItem: k => storage.get(k) ?? null, setItem: (k,v) => storage.set(k,v) },
    requestAnimationFrame: fn => { const id=++next; frames.set(id,fn); return id }, cancelAnimationFrame: id => frames.delete(id),
    setTimeout: (fn,ms) => { const id=++next; timers.set(id,{fn,at:now+ms}); return id }, clearTimeout: id => timers.delete(id) })
  Object.assign(document, { visibilityState: hidden?'hidden':'visible', getElementById: () => snapshot?.isConnected?snapshot:null, querySelector: () => head })
  const original = { window:globalThis.window,document:globalThis.document,performance:globalThis.performance,__pageEffects:globalThis.__pageEffects }
  const f = { layout:[],passive:[],takes:[],releases:[],
    ref(value) { const i=slots.length; const ref={current:value}; slots[i]=ref; return ref },
    take(s) { f.takes.push(s); if(snapshot)snapshot.isConnected=false; snapshot={isConnected:true}; return snapshot },
    release(ms,s) { f.releases.push({ms,s}); if(ms===0&&s)s.isConnected=false },
    window,document,R,frames,timers,dots,head,storage,fadeIn:{current:0},geo:{current:{port:false}},
    get writes() { return writes }, get snapshot() { return snapshot },
    frame(ms) { now+=ms; const callbacks=[...frames.values()];frames.clear();callbacks.forEach(fn=>fn(now)) },
    advance(ms) { now+=ms;for(const [id,t]of [...timers])if(t.at<=now){timers.delete(id);t.fn()} },
    setup() { f.layoutCleanup=f.layout.map(fn=>fn());f.passiveCleanup=f.passive.map(fn=>fn()) },
    cleanup() { f.layoutCleanup.forEach(fn=>fn?.());f.passiveCleanup.forEach(fn=>fn?.()) },
    restore() { Object.assign(globalThis,original) },
  }
  Object.assign(globalThis,{window,document,performance:{now:()=>now},__pageEffects:f})
  runPageTransitions({R,introCfg:{on:true,speed:1},geo:f.geo,isCanvas:false,introLive:true,kick:{current:()=>{}},G:{H:660},fadeIn:f.fadeIn})
  f.setup()
  return f
}
function check(name, options, run) {
  test(name,()=>{const f=fixture(options);try{run(f)}finally{f.restore()}})
}

check('cold intro retains nominal phases and releases every owned callback on completion', {}, f=>{
  assert.equal(f.R.iDev.current.style.opacity,'0')
  assert.equal(f.R.iDev.current.style.transform,'translateY(450.0px) rotate(-5.000deg) scale(0.8200)')
  f.frame(560);assert.equal(f.R.iSeam.current.style.transform,'scaleY(1.0000)')
  f.frame(440);assert.ok(+f.R.iDev.current.style.opacity>0)
  f.frame(1300);assert.equal(f.R.iCur.current.style.display,'none')
  assert.equal(f.R.iDev.current.style.transform,'')
  assert.equal(f.frames.size,0);assert.equal(f.timers.size,0)
  assert.equal(f.window.listeners.size,0);assert.equal(f.document.listeners.size,0)
  f.cleanup();assert.equal(f.takes.length,1) // A finished page may still hand off its stage.
})

check('StrictMode cleanup/replay retries only this unfinished instance without a curtain snapshot', {}, f=>{
  f.frame(100);f.cleanup()
  assert.equal(f.takes.length,0)
  const stopped=f.writes;f.frame(50);f.advance(5000);assert.equal(f.writes,stopped)
  f.setup();assert.equal(f.R.iCur.current.style.display,'')
  assert.equal(f.storage.get('ff-seen'),'1')
  assert.equal(f.fadeIn.current,0)
  f.frame(1000);assert.ok(+f.R.iDev.current.style.opacity>0)
  f.frame(1300);assert.equal(f.R.iCur.current.style.display,'none')
  assert.equal(f.frames.size,0);assert.equal(f.timers.size,0)
})

check('a genuine seen session skips intro and keeps the existing ordinary screen-fade path', {seen:true}, f=>{
  assert.equal(f.R.iCur.current.style.display,'none')
  assert.equal(f.R.iDev.current.style.transform,undefined)
  assert.equal(f.R.cOpen.current.style.opacity,'0')
  assert.equal(f.fadeIn.current,100)
  assert.equal(f.frames.size,0)
})

check('reduced-motion seen/open content is immediately opaque without an entry fade', {seen:true,reduced:true}, f=>{
  assert.equal(f.R.iCur.current.style.display,'none')
  for(const key of ['cL','cR','cOpen'])assert.equal(f.R[key].current.style.opacity,'1')
  assert.equal(f.fadeIn.current,0)
  assert.equal(f.frames.size,0);assert.equal(f.timers.size,0)
})

for(const event of ['scroll','resize','visibilitychange'])check(event+' interruption resets entry and cannot replay it later', {}, f=>{
  f.frame(1000)
  if(event==='scroll')f.window.scrollY=70
  if(event==='visibilitychange')f.document.visibilityState='hidden'
  ;(event==='visibilitychange'?f.document:f.window).dispatchEvent(new Event(event))
  assert.equal(f.R.iCur.current.style.display,'none')
  assert.equal(f.R.iDev.current.style.transform,'')
  assert.equal(f.dots.style.opacity,'');assert.equal(f.head.style.translate,'')
  assert.equal(f.frames.size,0);assert.equal(f.timers.size,0)
  const stopped=f.writes;f.frame(1000);f.advance(5000);assert.equal(f.writes,stopped)
})

check('unmount while running leaves no post-cleanup style writes or exit curtain snapshot', {}, f=>{
  f.frame(900);f.cleanup()
  const stopped=f.writes
  f.frame(5000);f.advance(5000)
  assert.equal(f.writes,stopped);assert.equal(f.takes.length,0)
  assert.equal(f.frames.size,0);assert.equal(f.timers.size,0)
  assert.equal(f.window.listeners.size,0);assert.equal(f.document.listeners.size,0)
})

check('adopted-page frame/fallback cleanup targets its old node, never a newer section snapshot', {seen:true,snapshot:{isConnected:true}}, f=>{
  f.advance(60);f.frame(16)
  f.cleanup()
  const replacement=f.snapshot
  replacement.__section=true
  const releases=f.releases.length
  f.frame(16);f.advance(1000)
  assert.equal(f.releases.length,releases)
  assert.ok(f.releases.every(r=>r.s!==replacement))
  assert.equal(f.frames.size,0);assert.equal(f.timers.size,0)
})

check('a section snapshot remains navigation-owned rather than being adopted by page entry', {seen:true,snapshot:{isConnected:true,__section:true}}, f=>{
  assert.equal(f.releases.length,0)
  assert.equal(f.timers.size,0);assert.equal(f.frames.size,0)
  assert.equal(f.R.cOpen.current.style.opacity,undefined)
})
