# nghlong3004.github.io

Personal portfolio website of Nguyen Hoang Long — Backend Developer.

**Live:** [nghlong3004.github.io](https://nghlong3004.github.io)

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- GSAP + ScrollTrigger (animations)
- Lenis (smooth scroll)
- react-i18next (EN/VI)
- react-router v7

## Getting Started

```bash
pnpm install
pnpm run dev
```

## Build

```bash
pnpm run build
pnpm run preview
```

## Deployment

Deploys automatically to GitHub Pages via GitHub Actions on push to `main`.

## Project Structure

```
src/
  components/    # Reusable UI components
  contexts/      # Theme context provider
  i18n/          # Translation files (en.json, vi.json)
  layouts/       # Root layout with nav, footer, transitions
  lib/           # Data, utilities
  pages/         # Route pages (Home, Project)
  sections/      # Page sections (Banner, About, Skills, etc.)
  types/         # TypeScript interfaces
public/
  projects/      # Project screenshots (webp)
```

## License

MIT
