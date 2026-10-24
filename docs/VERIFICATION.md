# Portfolio verification

## Reload-jitter repair

Warm reloads could paint the placeholder 1200×820 geometry before measuring the actual
viewport. On mobile this also briefly chose landscape layout. The animation loop then aligned
retained scroll in a passive effect, after a closed/zero-offset frame could already be visible.
StrictMode's page snapshot could preserve the earlier geometry until its normal fade completed.

The local repair initializes viewport state from the browser dimensions (retaining SSR/editor
fallbacks) and establishes the existing animation loop in an isomorphic layout effect, before
paint. Timings, dependency arrays, smoothing, intro, preloads, reveals, storage and idle-float
policy are unchanged; no animation or reduced-motion shortcut was introduced.

Production build and 53 tests pass. The new loop regression was red before the lifecycle fix
and green afterward; it verifies retained-scroll alignment, StrictMode setup/cleanup/replay,
one active frame loop, later user-scroll smoothing, hidden-tab behavior and final cleanup.
Lint: 0 errors, 39 warnings; the existing bundle-size warning remains.

Actual Chromium traces compare desktop 1440×900 and mobile 390×844 in development StrictMode
and production. Before: seen reloads had two or three distinct physical device positions.
After: the 24 repeated-reload traces each retain one device position and correct first-frame
viewport; six cold traces retain the intended moving intro, including reduced-motion emulation.
Four additional native reloads restore scrollY=650 and keep the device stable from its first
render. Some quick reload attempts returned to zero on both baseline and candidate without an
app scroll command; these were not counted as successful retained-scroll restoration.
Local storage preferences and the session intro policy remain unchanged in the captured runs.
Four VI/EN actual-app cases also pass across desktop/mobile: shared original portraits and alt
text/layout, localized card logos/text, VinFast job destination/focus, final keyboard slider return;
mobile cases cover all four views and language changes. Direct desktop VinQA focus passes on this
path, but does not close the separate longer-sequence limitation below. Open-mode long-Work
fixtures smoke-check Basic/Glow/Orbit rendering, reload and resize; their reloads return to zero,
so retained-scroll preservation is not claimed for those reusable-mode fixtures.

Publication must be verified separately through the exact-commit Pages result and live checks.
The separately documented inconsistent desktop VinQA focus remains unresolved; stable reload
geometry does not establish its repair. Physical devices, other browser engines, SSR hydration
and the embedded Framer editor remain untested.

## Portrait consistency correction

The earlier entry-only image-source exception is superseded. All three portrait consumers—
entry cover, About/main and final/contact—now use the existing original JPEG at
`/portrait/entry-wallpaper.jpg` through the localized shared profile data. Only entry uses
wallpaper sizing; About's panel and final's small circular image keep their existing layouts.
VI/EN alt text neutrally describes a user-supplied portrait photograph, not the owner's identity.
The screenshot-only SVG crop/type and separate entry-image override were removed. Old screenshot
assets and `public/tmp/` references are preserved, not rendered as current profile portraits.
The compact VinFast notification correction below is preserved. Deployment status must be verified
separately through the exact-head Actions/Pages result and live application checks.

Implementation paths changed: `src/features/portfolio/data/portrait.ts` (shared source/localized
alts), `data/profiles.ts` (VI/EN wiring), `components/Portrait.tsx` (plain image renderer),
`components/PortfolioCover.tsx` and `src/app/App.tsx` (remove entry override), and portfolio
`types.ts` (remove screenshot-crop field). AboutView and PortfolioContact already consumed the
shared profile portrait and required no edits. Tests and current instructions were reconciled.

Build and 52 tests pass; lint has 0 errors/40 warnings and the known 506 kB bundle warning remains.
Eight actual Chromium cases at 320×740, 390×844, 768×1024 and 1440×900, VI/EN, verify every
mounted portrait's loaded 1080×1073 source/alt and no old screenshot source, then visibly open
About and the final screen. Entry edge coverage stays exact; About panels remain 380/660px high;
final circles remain 74/130px. Language changes synchronize all alts while open; slider return,
all views and compact VinFast navigation still work. Original JPEG bytes and prior compact CSS
are unchanged; old reference assets are retained. Physical devices/non-Chromium/AT remain untested.

## Compact-notification correction

Compact entry now shows the existing localized VinFast employment card/logo instead of the
VinQA card. Its existing handler opens Experience at the current VinFast job. Desktop retains
both notifications and their destinations; the actual VinQA project remains unchanged.
Only the compact notification visibility selector changes in application code.

Verified locally in Chromium at 320×740, 390×844 and 768×1024 compact, plus 1440×900 desktop,
each in VI/EN: card/text fit, company/project assets, no overflow, wallpaper retained, employment
activation/focus at `job-current`, desktop VinQA activation/focus at `project-vinqa`, and VinQA
content still present in Work. Build and 52 tests pass; lint remains 0 errors/40 warnings and
the known 506 kB bundle warning remains. Source/test verification alone is not deployment proof.

## Published 8ebca83 verification (historical)

The initial Home/entry screen uses the supplied original 1080×1073 JPEG as a full-screen
device wallpaper. The local asset is byte-identical to the attachment (SHA-256
`0f51f12fbfdd28f6f0d091a0eb2fdf5f9b3440bdb6bf0246157c266fddb34df2`). Responsive cover cropping
and focal positioning keep the face visible; a top scrim supports white clock/status text.
At that release, both wallpaper layout and the new source were scoped to entry while About/final
retained the screenshot sample. That source exception is now superseded by the local correction
above; only the entry-specific wallpaper layout remains. No pictured identity is asserted.

Distinct About/Work/Experience/Contact views replace concatenated navigation destinations.
Only the active view is mounted; the existing device still unfolds and scrolls that view's
content. Motion now intentionally runs with `prefers-reduced-motion: reduce`; prior bypass
requirements below describe the historical published baseline only and are superseded in this release.
This is an explicit accessibility limitation for motion-sensitive visitors. Focus, keyboard,
labels, lifecycle cleanup and no-idle-float remain required. The following local checks apply
to these new interactions; the older published baseline is recorded separately below.

Official Kokonut Marker Text and Slide to Confirm retain their source designs. Slide completion
returns the initial entry/About state with no call/audio/external action; the final screen is
light and separate from the new entry wallpaper, retaining GitHub-left/LinkedIn-right. Component dependencies are `motion`
and `lucide-react`; see THIRD_PARTY_NOTICES.md. Official React Bits/Kokonut discovery registries
are in components.json; MCP is configured in the local client, not claimed connected here.

Local verification (Chromium, Node 24.22.0, pnpm 12.14.0):

- Production build and all 52 tests pass. Lint has zero errors and 40 warnings, including
  upstream component/imperative-engine ref/effect patterns; no rules were disabled.
- Accepted before the wallpaper follow-up: eight actual-app cases at 1440×900 and 390×844,
  VI/EN, normal/reduced-motion media. Each checks
  active-only view groups, folded opening, open switching, repeated/rapid requests, focus,
  shared expansion across views/language changes/resize, and both job/VinQA notifications.
- Both hardware copies retain aligned Marker Text. Final controls are inert/ARIA-hidden at
  entry and while open, active at the final light surface, and hidden again after return.
  GitHub remains left and LinkedIn right. Keyboard return passes; mobile partial drag cancels
  and full drag returns to entry. Returning resets About and scroll without replaying the intro.
- Cold visits animate under both media preferences; same-session reloads skip the staged intro.
  Tests cover StrictMode cleanup/replay, obsolete navigation cancellation, content growth/shrink,
  resize position mapping, snapshot ownership, marker observers/frames/timers and slider unmount.
- New wallpaper: 320, 390, 768, 1024 and 1440px widths, VI/EN, checking edge-to-edge coverage,
  loaded original asset, visible focal region, no page overflow and retained About/final portrait.
  Sampled image/scrim contrast is about 5.9–6.6:1 for white clock/status text, not a full
  accessibility audit. Desktop/mobile four-view navigation and keyboard slider return-to-wallpaper
  were rechecked with the new image. Notifications and social controls remain above the wallpaper.

The main JavaScript chunk is about 506 kB minified (165 kB gzip), producing Vite's 500 kB warning.
No chunk-splitting redesign was included. Deployment success must be checked separately through
the exact-head GitHub Actions run and live assets, not inferred from these local checks.

The generic design inspector was also run at 1440, 768 and 390px: it reports 9 failures and
9 warnings, not a clean pass. These include the retained hardware gradients/shadows, metadata
monospace, staged title timing, the intentionally superseded reduced-motion policy, and its
measurement of clipped/hidden duplicate hardware content as ordinary page layout. The focused
interaction checks above remain separate. Inspector motion sampling saw 38/38/41 moving elements,
with no horizontal overflow or broken images. Its generic layout/style findings were not used to
redesign the approved device or add unrelated imagery/video.

## Historical published baseline (6e103db)

### Automated checks

The accepted portfolio changes were checked with Node 24.22.0 and pnpm 12.14.0:

- TypeScript/Vite production build passes.
- All 27 Node tests pass: navigation scaling, safe snapshot ownership, early imperative
  navigation, intro lifecycle/StrictMode replay/cancellation, bilingual data/assets, Vietnam
  time and completed-years age boundaries, language precedence, and one-time Glow migration.
- Lint has no errors. Existing imperative-engine React warnings remain; no production rule
  was disabled to make the checks pass.

Run `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm test` and `pnpm lint` to reproduce
the code checks. Raw browser captures, local source snapshots and session diagnostics remain
local rather than being bundled into the repository or the deployed site.

### Browser and reference coverage

The reference was investigated with REA and supplemental Chromium observations. Fresh normal
entry follows seam → curtains/names → device lift → controls. Same-session reloads and fresh
reduced-motion loads skip the staged sequence. This is a timed entry animation, not a network
progress meter. The local timeline was retained; lifecycle cleanup was repaired without
changing its nominal timing/easing. The portfolio retains single-page section navigation,
not invented copies of template routes.

- Actual app: development StrictMode and production, desktop 1440×900 and portrait 390×844,
  normal/reduced motion, cold load followed by same-session reload. Intro resets, no unfinished
  curtain snapshot remains, and reduced-motion content stays readable. The existing short
  normal-motion development warm fade clears; production warm reload does not replay the intro.
- Real Device fixture: scroll, trusted tab visibility and real desktop-to-portrait resize
  interruption, plus unmount with zero asynchronous detached animation writes.
- VI/EN Glow/CTA matrix: 1440×900, 1024×768, 768×1024 and 390×844, normal/reduced motion.
  Hidden selectors retain handlers; CTA unfolding, social labels/colors, overflow and idle
  device stability were checked. Idle Float remains OFF.
- Mobile Basic outer-name spacing: 320, 390, 430 and 768px widths. At 390px, measured visible
  cap-to-phone gaps changed from about 76.5/39.6px to 57.8/58.3px. Glow retains the reference's
  name-free outer scene; HOANG LONG remains the main content display name.
- Language: stored VI/EN wins, otherwise ordered supported browser preference, then Vietnamese;
  unsupported/empty preferences and blocked storage were checked. Automatic selection is not
  saved as an explicit preference.
- Age pill: before/on the 6 June birthday, next birthday and year rollover, using Vietnam civil
  dates. Duplicate rendered values share the same clock snapshot, text fits inside the pill,
  and accessible labels distinguish age from device battery level. No battery API is read.
- One-time stale scene migration preserves finish and later explicit selections. Local VinQA
  imagery, real social URLs, aligned navigation and the icon-only final social area were retained.

## Limits

Chromium coverage is not a physical-device, cross-browser or assistive-technology audit.
Dynamic OS motion-preference changes during the intro and the exhaustive hardware/scene/finish
cross-product were not tested. Reference captures are not frame-complete or proof of identical
upstream source/pre-JavaScript pixels. The shared supplied photograph is not asserted to depict
the owner; unused screenshot/reference assets remain preserved. Instagram's local recognizable gradient is not certified downloaded brand
artwork and does not provide uniform text-contrast ratios; labels, focus styles and white link
surfaces remain. Deployment status must be checked separately from local build verification.
