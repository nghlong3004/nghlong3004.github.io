# Foldfolio — Nguyen Hoang Long

A Vietnamese/English portfolio inside a foldable device, built with React, TypeScript and Vite.

```sh
pnpm install
pnpm dev
```

Open the URL printed by Vite (normally `http://localhost:5173/`). Notifications open experience or VinQA; scroll to explore and expand projects. The clock updates in Vietnam time. The battery-shaped age pill shows completed years since 6 June 2005, not device battery charge. A valid saved language choice wins; otherwise the browser's first supported VI/EN preference is used, with Vietnamese as fallback. Language and scene selectors are temporarily hidden; their handlers, translations and stored preferences remain intact. Email and social links use the portfolio's real contact data.

Glow is the default scene, with a restrained sage/blue/stone bloom. Existing scene preferences migrate to Glow once without changing the device finish; subsequent explicit selections remain persistent. The entry CTA reads “Cuộn để mở” / “Scroll to unfold” and keeps its existing unfolding action. Instagram and LinkedIn use local brand-colored SVG treatments; profile URLs and final GitHub/LinkedIn positions are unchanged.

- **Content:** `src/features/portfolio/data/`, with `vi` and `en` variants for each section.
- **Replace the sample portrait:** edit `data/portrait.ts`, put the image in `public/portrait/`, update `src`/`alt` and remove `referenceCrop`. All three screens share it.
- **Device configuration:** `src/app/config/device.ts`. Idle Float remains OFF so the device and text stay still without scrolling.
- **Screen composition:** `src/app/App.tsx`.
- **Source map:** [TREE.md](TREE.md). **Agent instructions:** [AGENTS.md](AGENTS.md).

The portrait is a sample from a screenshot in `public/tmp/`, not a photograph of the portfolio owner. Sofia Sans Extra Condensed, Geist and Geist Mono match the Foldfolio reference and are self-hosted with OFL licenses. The local app uses a Framer editor adapter; no Framer runtime or backend is required.

```sh
pnpm build
pnpm lint
pnpm test
```

Tests require Node with TypeScript type stripping. Browser checks cover notifications, shared project expansion, automatic/stored language, age boundaries, resizing, reduced motion and idle stability. See [verification notes](docs/VERIFICATION.md) for coverage and limitations.

## GitHub Pages

`.github/workflows/deploy.yml` builds with Node 24 and pnpm 12.14.0, installs the frozen
lockfile, and deploys only `dist` on pushes to `main` or manual dispatch. The user-site
repository `nghlong3004.github.io` uses Vite's default `/` base; no repository-name prefix
is needed. In repository Settings → Pages, the publishing source must be GitHub Actions.
A successful push is not proof of deployment: check the workflow's deploy job/environment URL.
Generated browser captures and private local work-status updates are not release artifacts.
