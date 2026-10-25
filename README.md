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

The supplied photograph is used consistently without claiming it depicts the portfolio owner. The old `public/portrait/reference.jpg` and `public/tmp/` design references remain preserved but are not profile portraits in the UI. The accepted bilingual display family is self-hosted Alumni Sans, retaining Geist body/UI and Geist Mono metadata. Original Sofia files remain preserved but unused. Fonts and their OFL licenses live in `public/fonts/`; see [font provenance](THIRD_PARTY_NOTICES.md#fonts). The app uses a Framer editor adapter; no Framer runtime or backend is required.

```sh
pnpm build
pnpm lint
pnpm test
```

Bottom navigation selects distinct Home, About, Projects, Work and Contact views in that
order; only the selected view is mounted and scrolled. After its identity header, Home
orders Experience, Technologies used, Working approach, Featured projects, then Awards
and achievements (with existing truthful metrics). Work is employment history only;
legacy Experience/VinFast actions lead there. Projects is a light overview with one tile
per project; About retains introduction/achievements. Current employment remains fact-only.
Project details use one adapted
Kokonut drawer inside the screen, with keyboard/focus containment. Contact's shared brief form
uses typed bilingual inline validation and prepares an email draft in your mail app, without server sending/storage.
This portfolio keeps its initial cover/unfold but stays open at the end of content;
the terminal closing/final-screen phase is not part of its scrolling path. The reusable
engine and final component retain their closing/return capabilities for other callers.
No separate URL routes are required.
The Contact view has no avatar; entry, About and the separate final folded screen retain
the original portrait. Vietnamese technology headings read `Công nghệ sử dụng` on one
line. Project technology lists and their loops exclude OAuth2/JWT, WebSocket and
A* Pathfinding; unrelated project narratives and past experience remain intact.
The top status group adds logo-only current-employer branding, simulated cellular/Wi-Fi indicators,
and completed age inside a battery-like outline—not a live charge reading. It is an
iPhone 18 Pro/iOS-inspired adaptation, not an exact Apple interface.
Wi-Fi replaces the 5G text; both indicators share the existing simulated level/cadence
and hidden-tab cleanup, not network APIs. Common fixed-height rows center the status
items; painted bounds matter as well as their SVG boxes. Home and Work have localized
Contact footers after their content, matching existing footer conventions without
adding a sixth Home content section or bringing back the terminal folding screen.
About uses Kokonut's Marker Text on the introduction. The retained reusable final component
uses Kokonut's Slide to Confirm to return to entry/Home; this portfolio does not expose
that terminal screen. It never initiates a call, recording or external action.
See [component attribution](THIRD_PARTY_NOTICES.md).

Motion policy: animations intentionally run even with an OS/browser reduced-motion preference.
There is no reduced-motion bypass, which is an accessibility limitation for motion-sensitive
visitors. Idle Float stays OFF; the shared cellular signal and technology-logo loop are the only
authorized idle animation. Technology displays use official React Bits LogoLoop adapted for the
phone's copied surfaces, with real public-project technology labels, shared pause/phase,
hover/focus suspension and hidden/offscreen cleanup. There is no visible pause control or dot
separator. Genuine official/credible local logos cover technologies missing from the installed
icon set, with source/license notices; generic concepts are not given invented brand marks. Social brand icons come
from scoped React Icons imports; the Contact block keeps four icons together and email on its own row.

Privacy: current employment is disclosed only as the current-employer fact, not duties, internal
work or associated metrics. Local source changes cannot erase earlier releases, caches or Git
history; no history rewrite is performed. Review the current local candidate before publication.

Tests require Node with TypeScript type stripping. Browser checks cover notifications, shared project expansion, automatic/stored language, age boundaries, resizing, motion consistency and idle stability. See [verification notes](docs/VERIFICATION.md) for coverage and limitations.

## GitHub Pages

`.github/workflows/deploy.yml` builds with Node 24 and pnpm 12.14.0, installs the frozen
lockfile, and deploys only `dist` on pushes to `main` or manual dispatch. The user-site
repository `nghlong3004.github.io` uses Vite's default `/` base; no repository-name prefix
is needed. In repository Settings → Pages, the publishing source must be GitHub Actions.
A successful push is not proof of deployment: check the workflow's deploy job/environment URL.
Generated browser captures and private local work-status updates are not release artifacts.
