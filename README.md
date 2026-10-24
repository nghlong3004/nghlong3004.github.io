# Foldfolio — Nguyen Hoang Long

A Vietnamese/English portfolio inside a foldable device, built with React, TypeScript and Vite.

```sh
pnpm install
pnpm dev
```

Open the URL printed by Vite (normally `http://localhost:5173/`). Notifications open experience or VinQA; scroll to explore and expand projects. The clock updates in Vietnam time. The battery-shaped age pill shows completed years since 6 June 2005, not device battery charge. A valid saved language choice wins; otherwise the browser's first supported VI/EN preference is used, with Vietnamese as fallback. Language and scene selectors are temporarily hidden; their handlers, translations and stored preferences remain intact. Email and social links use the portfolio's real contact data.

Glow is restored to the original softened image-derived mode, not a fixed palette. Existing scene preferences migrate to Glow once without changing finish; later explicit choices persist. The entry CTA remains “Cuộn để mở” / “Scroll to unfold”. Instagram/LinkedIn and final GitHub/LinkedIn positions remain. A decorative cellular signal smoothly chooses a simulated2–5-bar level every~2s, without measuring the network.

- **Content:** `src/features/portfolio/data/`, with `vi` and `en` variants for each section.
- **Portraits:** `data/portrait.ts` supplies one shared image source with neutral VI/EN alt text to entry, About/main and final/contact. All use the original `public/portrait/entry-wallpaper.jpg` bytes. Only entry uses full-screen wallpaper sizing and a top contrast scrim; About retains its portrait panel and final its small circle. No pictured identity is assumed. Change the shared source once to synchronize every portrait.
- **Device configuration:** `src/app/config/device.ts`. Idle Float remains OFF so the device and text stay still without scrolling.
- **Screen composition:** `src/app/App.tsx`.
- **Source map:** [TREE.md](TREE.md). **Agent instructions:** [AGENTS.md](AGENTS.md).

The supplied photograph is used consistently without claiming it depicts the portfolio owner. The old `public/portrait/reference.jpg` and `public/tmp/` design references remain preserved but are not profile portraits in the UI. The display-font trial uses self-hosted Alumni Sans for names, clocks and headings in BOTH Vietnamese and English, retaining Geist body/UI and Geist Mono metadata. Alumni supports the Vietnamese characters missing from the original Sofia Sans Extra Condensed files; its condensed proportions differ, so publication is a visual trial, not aesthetic approval. Original Sofia files remain preserved but unused. Fonts and their OFL licenses live in `public/fonts/`; see [font provenance](THIRD_PARTY_NOTICES.md#fonts). The app uses a Framer editor adapter; no Framer runtime or backend is required.

```sh
pnpm build
pnpm lint
pnpm test
```

Navigation selects distinct Home, Work, Projects, About and Contact views; only the selected
view is mounted and scrolled. Home has real metrics/selected work/principles/employers;
Work a filtered grid/index; Projects a dark Archive gallery; About introduction/achievements.
Experience retains all jobs/honors via Home/About and VinFast. Project details use one adapted
Kokonut drawer inside the screen, with keyboard/focus containment. Contact's shared brief form
prepares an email draft in your mail app, without server sending/storage. The final folded
GitHub/LinkedIn screen remains separate; no separate URL routes are required.
About uses Kokonut's Marker Text on the introduction. The light final folded screen adds
Kokonut's Slide to Confirm: slide or press Enter/Space to return to the entry/Home state.
It does not initiate a call, recording or external action. See [component attribution](THIRD_PARTY_NOTICES.md).

Motion policy: animations intentionally run even with an OS/browser reduced-motion preference.
There is no reduced-motion bypass, which is an accessibility limitation for motion-sensitive
visitors. Idle Float stays OFF; keyboard, focus, labels and cleanup remain supported.

Tests require Node with TypeScript type stripping. Browser checks cover notifications, shared project expansion, automatic/stored language, age boundaries, resizing, motion consistency and idle stability. See [verification notes](docs/VERIFICATION.md) for coverage and limitations.

## GitHub Pages

`.github/workflows/deploy.yml` builds with Node 24 and pnpm 12.14.0, installs the frozen
lockfile, and deploys only `dist` on pushes to `main` or manual dispatch. The user-site
repository `nghlong3004.github.io` uses Vite's default `/` base; no repository-name prefix
is needed. In repository Settings → Pages, the publishing source must be GitHub Actions.
A successful push is not proof of deployment: check the workflow's deploy job/environment URL.
Generated browser captures and private local work-status updates are not release artifacts.
