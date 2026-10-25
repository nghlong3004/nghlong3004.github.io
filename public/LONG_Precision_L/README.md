# LONG — Precision L brand assets

Personal brand: Nguyễn Hoàng Long • Software Engineer

## Main exports

| Asset | Vector | Raster |
|---|---|---|
| Primary logo, graphite background, ivory foreground | `primary-logo-dark.svg` | `primary-logo-dark.png` (2340 × 750) |
| Primary logo, ivory background, graphite foreground | `primary-logo-light.svg` | `primary-logo-light.png` (2340 × 750) |
| Primary logo, transparent (ivory) | `primary-logo-transparent-ivory.svg` | `primary-logo-transparent-ivory.png` (2340 × 750) |
| Primary logo, transparent (graphite) | `primary-logo-transparent-graphite.svg` | `primary-logo-transparent-graphite.png` (2340 × 750) |
| Profile icon (graphite) | `icon.svg` | `icon-512.png` (512 × 512) |
| Profile icon (ivory) | `icon-light.svg` | `icon-light-512.png` (512 × 512) |
| Favicon | `favicon.svg` | `favicon.ico` and `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png` |

`favicon.ico` is a multi-resolution Windows/browser icon with 16, 32 and 48 pixel entries. `asset-preview.png` is a raster contact sheet. `original-concept-board.png` is the initial AI-generated concept image, included for comparison. The SVGs here are clean geometric rebuilds based on that design; they are not automatic pixel-perfect vector tracings. The wordmark is converted to hand-authored geometric shapes, so there are no font dependencies.

## Brand palette

- Graphite `#161B22`
- Soft Ivory `#F4F1EB`
- Titanium `#9DA7B1`
- Deep Navy `#243B53`

## Website example

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<img src="/primary-logo-dark.svg" alt="LONG" width="312" height="100">
```

For a site with light background, use `primary-logo-transparent-graphite.svg`. For a dark background, use `primary-logo-transparent-ivory.svg`. `primary-logo-dark.svg` and `primary-logo-light.svg` have their own filled backgrounds.

## Usage notes

Keep visual proportions unchanged. Prefer SVG wherever possible. Do not stretch or apply gradient, bevel, shadow, or glow to the logo. The favicon has slightly expanded separation in its geometry for better legibility at 16 px, while preserving the same Precision L construction.
