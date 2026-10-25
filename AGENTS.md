# Repository instructions

## Scope first

Use [docs/TREE.md](docs/TREE.md) to locate the task's files and relevant maintenance section. Follow changed symbols to direct callers/imports and tests; widen only when a shared contract is affected. Do not read every guide, scan the whole repo or replay historical verification by default.

## Shared rules

- `app` composes independent `portfolio` content and reusable `foldfolio` hardware. Neither feature imports app; foldfolio knows nothing about portfolio; portfolio never modifies the engine. Content components receive data through props.
- Import files directly; no wrapper barrels/re-exports. Use `import type`. Preserve timing, easing, geometry, storage keys, dependencies and design outside the requested change.
- Privacy: disclose only current VinFast employment, never current duties, internal details or employer-linked metrics in UI, client data, metadata, docs or tests. Keep safe historical/independent content; do not repeat removed private copy. Old repo is read-only.
- Keep asset/license notices and original portrait bytes. Do not delete user reference assets. Update TREE/imports when adding/moving/removing files; delete unused files rather than compatibility re-exports.

## Verification

Choose checks from the changed behavior, not a fixed command sequence. [tests/README.md](tests/README.md) maps tests and focused commands.

| Change | Default scope |
| --- | --- |
| Docs only | Diff and changed links/paths; no app build/tests |
| Content | Relevant data tests and VI/EN; privacy tests for employment, narrative or metrics |
| One feature/helper | Its tests and affected direct consumers |
| One view's layout | Relevant view tests and desktop/mobile visual check of that view |
| Shared API/navigation/engine | Affected callers and lifecycle/integration tests; full suite for broad impact |
| Release or explicit full verification | Build, lint, full tests; relevant browser coverage |

- Install dependencies only for initial setup, missing packages or dependency/lockfile changes.
- Start dev server only for browser checks. Build for compilation/bundling changes or release; it already runs TypeScript, so do not duplicate typecheck.
- Lint changed source files with `pnpm exec oxlint <files>`; full lint for shared tooling changes/release. Existing engine ref/effect warnings do not justify disabling rules or changing animation.
- Stop when relevant checks pass. Expand/rerun only for new edits, failures or concrete unresolved concerns. Report checks actually run and material limits; do not append routine feature results to the historical verification archive.
