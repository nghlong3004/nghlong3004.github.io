# Project map

Rules: [AGENTS.md](../AGENTS.md). Open only the relevant files and guide section; paths below are repo-relative.

```text
src/main.tsx → src/app/App.tsx
src/app/                  # Composition, config/device.ts, rain, global CSS
src/features/portfolio/   # types, data, components/views, hooks, lib, styles
src/features/foldfolio/   # Reusable device, public types, components, engine, hooks
```

## Task → files and notes

`P` = `src/features/portfolio`, `F` = `src/features/foldfolio`. Unprefixed filenames share the preceding directory in that row.

| Task | Start here | Read only these notes |
| --- | --- | --- |
| Content/language | `P/types.ts`, `P/data/portfolio.ts`, relevant section file; `P/hooks/usePortfolioLanguage.ts` | [Data/language](PORTFOLIO.md#data-and-language) |
| Portrait | `P/data/portrait.ts`, `P/components/Portrait.tsx` | [Portraits](PORTFOLIO.md#portraits) |
| Fonts | `P/styles/portfolio.css`, `public/fonts/` | [Typography](PORTFOLIO.md#typography) |
| View layout/navigation | `src/app/App.tsx`, `P/components/PortfolioScreen.tsx`, matching `views/*View.tsx` / `styles/<view>.css`, `P/lib/navigation.ts` | [Views](APP.md#views-and-navigation) |
| Cover/notifications; reusable final | `P/components/PortfolioCover.tsx`, `P/data/labels.ts`; `P/components/PortfolioContact.tsx` | [Views](APP.md#views-and-navigation), [final](APP.md#about-and-reusable-final) |
| Contact | `P/components/views/ContactView.tsx`, `P/lib/contactValidation.ts`, App state | [Contact](APP.md#contact) |
| Project drawer | `P/components/kokonut/ProjectOverlay.tsx`, App state | [Drawer](APP.md#project-drawer) |
| Technology loop/icons | `P/components/TechnologyLoop.tsx`, `reactbits/LogoLoop.tsx`; `P/hooks/useTechnologyLoop.tsx`, `technologyLoopController.ts`; `P/lib/{brandIcons,technologyIcons}.ts` | [Technology](PORTFOLIO.md#technology-presentation) |
| Rain | `src/app/components/kokonut/RainGlassBackground.tsx`, `src/app/styles/globals.css`, `src/app/config/device.ts` | [Background](APP.md#rain-background) |
| Vietnam clock/age | `P/hooks/useVietnamClock.ts`, `P/lib/vietnamTime.ts` | [Clock](APP.md#clock) |
| Device settings/API | `src/app/config/device.ts`, `F/types.ts` | [API](DEVICE.md#api-and-integration) |
| Focus/selection/navigation | `F/components/renderDevice.tsx`, `F/hooks/useSectionNavigation.ts`, `F/engine/navigation.ts` | [Interaction](DEVICE.md#interactive-surface-and-navigation) |
| Cellular/Wi-Fi/status tint | `F/hooks/useSignalLevel.ts`, `F/components/renderDevice.tsx`, `F/engine/createFrameRenderer.ts` | [Status](DEVICE.md#status) |
| Fold/scroll/geometry | `F/FoldfolioDevice.tsx`, `F/config/constants.ts`, `F/engine/createFrameRenderer.ts` | [Engine](DEVICE.md#animation-and-lifecycle) |
| Intro/motion/snapshots/scenes | Relevant `F/hooks/usePageTransitions.ts`, `useAnimationLoop.ts`, `useScreenMotion.ts`, `useSceneImages.ts`; `F/engine/snapshots.ts`, `F/components/renderScenes.tsx` | [Engine](DEVICE.md#animation-and-lifecycle) |

## Supporting files

- `tests/`: behavior/view tests; [selection and commands](../tests/README.md).
- `public/`: project galleries, company/technology logos, shared original portrait, fonts/licenses and user references.
- [THIRD_PARTY_NOTICES](THIRD_PARTY_NOTICES.md): provenance/licenses. [VERIFICATION](VERIFICATION.md): historical archive, read only for a specific past revision.
- `package.json` / `pnpm-lock.yaml`, Vite/TypeScript/oxlint configs: tooling; `.github/workflows/deploy.yml`: GitHub Pages; `.gitattributes`: preserve upstream asset/license bytes; `components.json`: registry discovery; `.taste-skill/`: design notes, ignored captures.

Find symbols with `rg -n 'symbol' <relevant-directory>`; list files with `rg --files <directory>`. Feature subfolders: components (JSX), hooks (React lifecycle), engine (animation/internal types), lib (helpers), config, styles, integrations (adapters).
