# App maintenance

Read only the relevant section. Composition and shared state live in `src/app/App.tsx`; portfolio views receive data and callbacks through props.

## Views and navigation

- Exactly one active view. Nav: Home → About → Projects → Work → Contact; initial/return: Home. No concatenated-view anchors.
- Home: identity header → Experience → Technologies used → Working approach → Featured projects → Awards and achievements (includes existing truthful metrics). Work: employment history only, fact-only current VinFast plus safe history; no projects/filters, metrics or honors. Projects: light overview, one tile per independent project, shared drawer. About: introduction/story/achievements. Contact: brief form.
- Legacy experience/VinFast destinations resolve to Work; honors stay Home/About. Project notifications select Projects + shared dialog ID. Compact cover prioritizes current-job card; desktop keeps job + VinQA. Keep VinQA project data independent. Leave mobile hero name/CTA placement unchanged pending a product decision.
- Home/Work end with localized semantic Contact footers using About/Projects heading/action conventions. App ends OPEN after content: retain cover/unfold, omit terminal closing/hold/final phases; retain reusable engine closing/call.
- Load shared `pf-*` tokens/primitives in portfolio.css before view CSS. Work/Projects use shared light theme; About keeps split hero. Contact view: full-width statement, no portrait; other portrait layouts stay.

## Contact

- App owns shared expandedProject, Contact draft and typed VI/EN touched/submitted validation. Use semantic input types, `noValidate`, inline errors/descriptions and safe first-invalid focus. Submit only prepares encoded mailto; no backend, delivery claim or server storage/transmission. Contact: four social icons in one row, centered email in another; use shared scoped brand icons. Keep entry Instagram/LinkedIn, final GitHub-left/LinkedIn-right.

Focus/selection changes also follow the [canonical interactive surface](DEVICE.md#interactive-surface-and-navigation).

## Project drawer

- One App-controlled ProjectOverlay with `useId` IDs in higher clipped `screenOverlay`/`screenOverlayPortrait` slot above nav, rendered once only when flat/open. Preserve Kokonut Smooth Drawer peek/expanded/easing, Motion, device-local focus/scroll; no body portal, Vaul or drag-to-snap. Trap focus, support close/Escape/backdrop, restore focus/inert/overflow on cleanup. Keep fold shading; hide decorative crease when flat.

## About and reusable final

- Controlled official Kokonut Marker Text synchronizes About copies; refresh ink after fold/focus/scroll, retain upstream strokes/timings. Keyboard-enabled final Slide to Confirm returns to entry/Home, no call/audio/external action. Preserve THIRD_PARTY_NOTICES.

## Rain background

- Sole app background: Rain Glass, `scene: 'none'`, transparent stage, one fixed official Kokonut layer behind hardware, pointer-transparent. Reuse unchanged local portrait behind fog; no default Unsplash fetch/new dependencies. Own shader/image/observer/listener/rAF cleanup, hidden/offscreen pause and context restoration.
- No app scene selector, stored Basic/Glow/Orbit restore, scene-image/name wiring or Glow migration. Preserve finish/other mixed preferences, never clear all storage. Retain reusable engine scenes.

Rain follows the [motion policy](DEVICE.md#animation-and-lifecycle), including reduced-motion media.

RainGlassBackground requires a same-origin/CORS-enabled `src`; `rain` is 0–1 (default 0.6). Optional `interactive` defaults true; App sets false. It also accepts title, children and className. WebGL2/image failure shows a neutral fallback. Source/license provenance: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md#rain-glass-background).

## Clock

- Shared useVietnamClock/formatVietnamTime: `Asia/Ho_Chi_Minh`, minute-boundary/tab-return updates, one `{ time, age }` snapshot for cover/status. Age: completed years since 2005-06-06 on Vietnam civil date, in battery-shaped pill with age/not-battery accessibility text. No fixed template time or battery API.
