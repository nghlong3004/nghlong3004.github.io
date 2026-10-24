# Foldfolio — Nguyen Hoang Long

A Vietnamese/English portfolio inside a foldable device, built with React, TypeScript and Vite.

```sh
pnpm install
pnpm dev
```

Open the URL printed by Vite (normally `http://localhost:5173/`). Notifications open experience or VinQA; scroll to explore and expand projects. The clock updates in Vietnam time. The battery-shaped age pill shows completed years since 6 June 2005, not device battery charge. A valid saved language choice wins; otherwise the browser's first supported VI/EN preference is used, with Vietnamese as fallback. Language and scene selectors are temporarily hidden; their handlers, translations and stored preferences remain intact. Email and social links use the portfolio's real contact data.

Glow is the default scene, with a restrained sage/blue/stone bloom. Existing scene preferences migrate to Glow once without changing the device finish; subsequent explicit selections remain persistent. The entry CTA reads “Cuộn để mở” / “Scroll to unfold” and keeps its existing unfolding action. Instagram and LinkedIn use local brand-colored SVG treatments; profile URLs and final GitHub/LinkedIn positions are unchanged.

- **Content:** `src/features/portfolio/data/`, with `vi` and `en` variants for each section.
- **Portraits:** `data/portrait.ts` keeps the About/final screenshot sample separate from `entryPortrait`. The entry uses the supplied original JPEG as an edge-to-edge device-screen wallpaper, with responsive cover cropping and a top contrast scrim. Neither image is asserted to depict the portfolio owner. Replace a local asset and its neutral alt/config deliberately; remove `referenceCrop` for ordinary photographs.
- **Device configuration:** `src/app/config/device.ts`. Idle Float remains OFF so the device and text stay still without scrolling.
- **Screen composition:** `src/app/App.tsx`.
- **Source map:** [TREE.md](TREE.md). **Agent instructions:** [AGENTS.md](AGENTS.md).

The About/final portrait is a sample from a screenshot in `public/tmp/`; the entry wallpaper is a separate supplied photograph. Neither is claimed to portray the portfolio owner. Sofia Sans Extra Condensed, Geist and Geist Mono match the Foldfolio reference and are self-hosted with OFL licenses. The local app uses a Framer editor adapter; no Framer runtime or backend is required.

```sh
pnpm build
pnpm lint
pnpm test
```

Navigation selects distinct About, Work, Experience and Contact views inside the same device;
only the selected view's content is mounted and scrolled. About contains introduction/story,
Work projects/results, Experience employment/honors, and Contact the contact content. The final
folded GitHub/LinkedIn screen remains separate. No separate URL routes are required.
About uses Kokonut's Marker Text on the introduction. The light final folded screen adds
Kokonut's Slide to Confirm: slide or press Enter/Space to return to the entry/About state.
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
