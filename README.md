# Foldfolio — Nguyen Hoang Long

A Vietnamese/English portfolio inside a foldable device, built with React, TypeScript and Vite. Five views share one device-local project drawer; Contact prepares an email draft without a backend.

## Run locally

Use Node 24 and pnpm 12.14.0, matching CI. On first setup:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the URL printed by Vite (normally http://localhost:5173/). On later runs, start with `pnpm dev`; reinstall only when dependencies need updating.

## Make a change

1. Use [TREE](docs/TREE.md) to find the relevant source files and maintenance section.
2. Follow [repository rules](AGENTS.md), including privacy and feature boundaries.
3. Run [focused checks](tests/README.md) for the changed behavior. A local feature edit does not require every test or scene/viewport combination.

Versions and scripts live in [package.json](package.json). [Third-party notices](docs/THIRD_PARTY_NOTICES.md) document asset/component licenses. [Verification history](docs/VERIFICATION.md) is an archive of past revisions, not a current checklist.

## Deploy

[GitHub Actions](.github/workflows/deploy.yml) installs the frozen lockfile, builds `dist` and deploys pushes to `main` or manual dispatch to GitHub Pages. Set Settings → Pages → Source to GitHub Actions. This user-site repo uses Vite's default `/` base.

Before release, run `pnpm build`, `pnpm lint` and `pnpm test`. Build includes TypeScript. Verify the workflow's deploy job/environment URL separately; a local pass or successful push alone does not establish deployment.
