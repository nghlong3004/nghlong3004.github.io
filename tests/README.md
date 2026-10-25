# Focused verification

Choose the smallest set that covers the changed behavior and affected callers. A helper change does not automatically require every view, device scene or browser matrix.

Run named files directly from the repo root (Node 24, as used by CI):

```sh
node --experimental-strip-types --test tests/contact-validation.test.mjs
```

Add `tests/contact-view.test.mjs` when form rendering/state integration is affected. Optional `--test-name-pattern='age|clock'` before file paths narrows cases within a file. `pnpm test` runs all files; appending a filename to that script does not remove its existing wildcard.

| Changed behavior | Start with |
| --- | --- |
| Data, local assets, language or Vietnam clock | `portfolio.test.mjs` (use a name filter for a narrow change) |
| Employment, public narrative or metrics | `privacy-copy.test.mjs` |
| One view | Matching `home/work/projects/about/contact-view.test.mjs` |
| Contact validation helper | `contact-validation.test.mjs` |
| View selection/App navigation/shared composition | `portfolio-views.test.mjs` |
| Project drawer | `project-overlay.test.mjs` |
| Native focus/selection/viewport integration | `screen-interaction.test.mjs` |
| Technology display/controller | `technology-presentation.test.mjs` / `technology-loop.test.mjs`, according to the change |
| Engine lifecycle, navigation or scenes | Locate the matching file with `rg --files tests`; follow changed callers |

View tests own their local content/actions; `portfolio-views` owns selection/composition. Run both when that boundary changes, not for every local edit. Vite SSR is needed for TSX/CSS imports; pure TypeScript helpers should import directly using Node type stripping.

Test behavior and explicit contracts: bilingual parity, unique IDs, validation, focus, privacy and truthful public metrics. Avoid freezing dataset size, CSS formatting, incidental spacing or full markup unless the requirement fixes it. Keep approved privacy facts and original asset/license integrity checks.

For broad changes or release: `pnpm build`, `pnpm lint`, `pnpm test`. Build includes TypeScript. Browser checks should exercise only affected views, sizes and interactions; Node/SSR tests do not prove painted layout or native focus. See [verification policy](../AGENTS.md#verification) for when to stop or expand.
