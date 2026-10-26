# Portfolio maintenance

Read only the section relevant to the change. Paths are under `src/features/portfolio/`.

## Data and language

- `data/portfolio.ts` assembles VI/EN section files; `links.ts` is shared. New sections: model → bilingual data → component → PortfolioScreen. Projects use summary, techStack, optional live/source links, images/gallery and paragraph/list `ContentBlock[]` details/role; no raw HTML/parser.
- Language: valid stored `lang` → first supported browser VI/EN preference → VI. Persist explicit choices only. Selector stays hidden; synchronize content, notifications, HTML lang/description.

## Portraits

- All portraits use unchanged original `public/portrait/entry-wallpaper.jpg`, wired through `data/portrait.ts` → `data.profile.portrait` props. Share VI/EN src with truthful localized alt; do not identify the subject as the owner. Portrait renders a normal img; no copies, regeneration or screenshot-specific SVG crops.
- Only `.portfolio-cover__portrait` fills the SCREEN (`inset:0`, `object-fit:cover`, responsive focal point); preserve scrims, About's panel and final's small circle. Never cover browser/hardware. Keep any legacy `public/portrait/reference.jpg` and `public/tmp/` assets as unrendered references; no old stock portraits as awards.

## Typography

- Self-hosted Alumni Sans variable: bilingual name/clock/headings (clock 800, headings 900); Geist: UI/body, controls and metadata. These are the only active authored families. Keep OFL and unused original Sofia/Geist Mono assets; no per-language fonts or claims that font changes alone prove rasterization fixes; preserve hardware.

## Technology presentation

- Technology heading: VI `Công nghệ sử dụng`, one line; retain EN labels/display roles. Exclude OAuth2/JWT, WebSocket and A* Pathfinding only from project techStack presentation/derived loops, not narrative or past employment.
- One TechnologyLoopProvider surrounds the device. Use unique public-project techStack labels, truthful logo mappings, shared phase/pause across copies, hover/focus/hidden/offscreen cleanup; no pause button, bullets or animation on every compact badge. Branded logos need genuine assets/provenance/licenses (including Playwright/promptfoo); generic concepts need no invented brand. Preserve full React Bits MIT + Commons Clause notice and documented line-only scope.
