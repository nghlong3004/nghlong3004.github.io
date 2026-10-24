# Portfolio verification

## Automated checks

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

## Browser and reference coverage

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
upstream source/pre-JavaScript pixels. The portrait remains a supplied screenshot sample, not
the owner's photo. Instagram's local recognizable gradient is not certified downloaded brand
artwork and does not provide uniform text-contrast ratios; labels, focus styles and white link
surfaces remain. Deployment status must be checked separately from local build verification.
