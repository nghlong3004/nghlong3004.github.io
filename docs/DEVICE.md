# Device maintenance

Read only the relevant section. Paths are under `src/features/foldfolio/`; keep the reusable engine independent of app/portfolio content.

## API and integration

Public API: `FoldfolioDevice.tsx`, `FoldfolioProps`/`FoldfolioHandle` in `types.ts`. Slot components forward style to their root. Retain screenPortrait/coverPortrait/callPortrait/navPortrait and reusable nav/nameLeft/nameRight/sceneImages slots.

- Framer integration is a preview/editor shim, not a runtime/CMS; metadata does not supply Vite defaults. Do not add Framer packages.

## Interactive surface and navigation

- All views use one stable canonical `screenInteractive`/`screenInteractivePortrait` DOM across orientations for native caret/selection/focus. Folding screen copies are inert/aria-hidden. Keep clip-only ancestry, engine `focusScreenElement` reveal with preventScroll, viewport remapping and genuine fold focus fallback. Auto-reveal skips nontabbable containers; visual-viewport callbacks follow only still-focused editables. Outside taps must not reset scroll; retain explicit validation/imperative reveal.
- `screenNavigation?: { key: string; target?: string }`: undefined initially keeps cover; new keys open/reset rendered content to view top or intra-view `data-ff-section`, keeping open hardware open. Retain `FoldfolioHandle.scrollToSection(key)`; no hashes, scrollIntoView or device remounts.

## Status

- Clock left; logo-only employer branding, simulated cellular, decorative Wi-Fi, age right. App supplies existing light/dark VinFast assets + fact-only label via `status.employerLogo`; choose by resolved right-group tint. Groups: 22px tall; verify painted icon bounds. Five cellular bars intentionally adapt iOS rather than exactly copy Apple UI.
- Cellular/Wi-Fi use independent `useSignalLevel` instances with separate state/timers: cellular every 2–3s, Wi-Fi every 5–7.5s, with a newly randomized delay after each tick. Levels move one step within 2–5; Wi-Fi maps this to a dot + 0–3 active arcs. Both pause while the tab is hidden or status is disabled; no network API. Copies share each icon's level. Mark nested full-width backgrounds `data-ff-surface` for status tint; exclude narrow desktop panels from whole-screen selection.

## Animation and lifecycle

- Idle Float OFF. Rain, indicators and technology loop may animate idle. Explicit motion policy: `prefers-reduced-motion: reduce` still runs intro, smoothing, reveals, snapshots and transitions; no bypass hooks/branches or false stubs. Retain keyboard/focus/labels, no flashes/strobes, complete cleanup.
- Reusable `fold`: unfold → content → close → call; `open`: stays open while page scroll moves content. App overrides terminal phases. Auto orientation uses viewport width/aspect; designs: landscape 976×660, portrait 358×718 (config/constants.ts).
- Call JSX functions renderDevice/renderScenes directly; preserve DOM/slots/refs used by scanner/filter/tint. No extra wrappers or conversion to components.
- geo/live/R and callback refs renderFrame/scan/motionTick/paintScenes/kick own engine state. rAF writes DOM through S, never React state per frame. Preserve render-time callback-ref assignments/dependency arrays unless lifecycle changes are verified.
- `data-ff-motion="composition"` opts a screen into generic semantic header/section/footer reveals. The existing scanner groups ordinary copy/actions/media once, preserving legacy unmarked callers and counter/hover behavior. Paused GSAP timelines use the device loop's clock and scoped contexts; replacement, detach, hidden settling, StrictMode replay and unmount release inline motion state.
- Declare each useDeviceRefs useRef separately, outside object literals (React Compiler caching). Motion callbacks: owned/cancellable, detached-target guards, StrictMode rearming, nominal reveal/counter timings. Clean up listeners/observers/timers/rAF; handle resize/tab changes.
- Storage/event: `foldfolio:style`; session: `ff-seen`, `ff-warm:*`; snapshot DOM: `ff-pagesnap`.

For changed motion paths, exercise normal/reduce preferences, long content with headings/counters/images/filtered links and relevant StrictMode/resize/tab cleanup. Check fold/open when their timelines are affected; Basic/Glow/Orbit only when reusable scene behavior changes. Do not repeat an unrelated scene/finish/viewport matrix.
