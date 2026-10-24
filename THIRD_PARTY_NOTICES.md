# Third-party notices

## React Bits LogoLoop

The line-loop treatment is adapted from David Haz's official React Bits TypeScript/CSS
LogoLoop at commit `e12c22192ac7b4b452c5e2feb9b586d74765d696`:
[source](https://github.com/DavidHDev/react-bits/tree/e12c22192ac7b4b452c5e2feb9b586d74765d696/src/ts-default/Animations/LogoLoop),
[documentation](https://reactbits.dev/animations/logo-loop).
The complete **MIT + Commons Clause** license is retained in
`src/features/portfolio/components/reactbits/LICENSE.react-bits.txt`; this is not plain MIT.

This portfolio uses a line-only adaptation: upstream list/node markup, hover scaling
and CSS are retained; provider-scoped synchronization, layout-space measurement,
keyboard-focus pause and lifecycle gating replace independent clocks. No visible pause
control or bullet separator is rendered. Unused links,
drag/advanced layouts and reduced-motion bypasses are omitted. Intro is a shared opacity
intro rather than the full upstream staggered treatment. Current upstream does provide
the advanced layouts/API; their omission here is deliberate. No React Bits package or
additional animation framework is installed. Technology names come from public project
data, with library logos or honest text fallback; logo use does not imply endorsement.

## Fonts

- **Alumni Sans** by Robert Leuschke / the Alumni Sans Project Authors, variable
  weight100–900, version1.018. Unmodified `public/fonts/alumni-sans-variable.ttf` and
  full license `public/fonts/AlumniSans-OFL.txt` are supplied under SIL OFL1.1.
  Source: [Google Fonts, pinned revision](https://github.com/google/fonts/tree/e7db6ca603fd4862010383ff17ffd6cc4ffac1c0/ofl/alumnisans);
  [designer upstream](https://github.com/googlefonts/alumni).
  Binary SHA256: `9255d5201c7aba5bf1bde1e8521f0fee691f0588b83f40db228a5f9bbaacfbc4`.
  Used for the bilingual display-font trial; no glyph outlines are modified.
- **Geist / Geist Mono**, [Vercel upstream](https://github.com/vercel/geist-font),
  remain self-hosted under the included `Geist-OFL.txt` / `GeistMono-OFL.txt`.
- Original **Sofia Sans Extra Condensed** files and `SofiaSansExtraCondensed-OFL.txt`
  from [Lettersoup](https://github.com/lettersoup/Sofia-Sans) remain preserved, but are
  no longer selected by application CSS because of incomplete Vietnamese coverage.

The font licenses are separate from the component MIT license below.

## Brand and technology icons

Scoped imports from `react-icons`5.7.0 replace hand-maintained social-brand SVG paths.
The React Icons wrapper is MIT-licensed; its license does not replace the licenses of
the included icon artwork. [React Icons sources and licenses](https://github.com/react-icons/react-icons/blob/master/packages/react-icons/src/icons/index.ts).

- Social logos and the Java logo use Font Awesome Free6 brands, ©Fonticons, Inc.,
  under [CC BY4.0](https://creativecommons.org/licenses/by/4.0/).
  [Font Awesome licensing](https://fontawesome.com/license/free).
- Other selected technology logos use Simple Icons under CC0-1.0; per-logo brand
  guidance and trademarks remain with their owners.
  [Simple Icons disclaimer](https://github.com/simple-icons/simple-icons/blob/develop/DISCLAIMER.md).

Only explicit named exports from `react-icons/fa6` and `react-icons/si` are imported.
Technologies missing from those sets can use verified official local assets below.
Generic protocol/algorithm labels remain text, never an unrelated product's logo.
These marks identify existing public project technologies and links; they imply no
endorsement, certification or ownership of the trademarks.

### Official local technology assets

- Playwright: unmodified SVG from Microsoft Playwright commit
  `91a765d1681cb3eeb0d0fb89fefec3cf0d21bd9b`,
  [official source](https://github.com/microsoft/playwright/blob/91a765d1681cb3eeb0d0fb89fefec3cf0d21bd9b/packages/web/src/assets/playwright-logo.svg).
  The full Apache-2.0 license and repository NOTICE accompany it in `public/technology/`.
  Copyright licensing does not establish trademark permission. This local candidate
  does not claim separate logo/publication clearance; review the
  [Microsoft brand guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks)
  before a future publication decision.
- Promptfoo: unmodified panda SVG from Promptfoo commit
  `c0b88a324175c60019cc80de1b2e32b4c849d4c3`, byte-identical to the
  [official press download](https://www.promptfoo.dev/press/).
  The full upstream MIT license is retained in `public/technology/`.

`public/technology/NOTICE.txt` records pins, source URLs and attribution. OAuth2/JWT,
WebSocket and A* Pathfinding remain text because they describe combined standards,
a protocol and an algorithm, not a single product whose logo can honestly stand for them.

Marker Text and Slide to Confirm are adapted from the official Kokonut UI registry:

- https://kokonutui.com/r/marker-text.json
- https://kokonutui.com/r/slide-to-confirm.json
- https://github.com/kokonut-labs/kokonutui

The component headers credit Dorian Baffier. Their original designs and normal-motion
behavior are retained. Technical adaptations are limited to this project's import helper,
localized strings, scaled-device coordinates, lifecycle safety, and the explicit project
policy of keeping animation enabled under reduced-motion media. The Marker Text demo is
omitted; the reusable component remains. React Bits components have not been copied.

## Smooth Drawer adaptation

`ProjectOverlay.tsx` adapts the official Smooth Drawer v2.0.0 (2026-10-16),
by @dorianbaffier: https://kokonutui.com/docs/navigation/smooth-drawer and
https://kokonutui.com/r/smooth-drawer.json.
The pill handle, rounded bottom sheet, two-height peek/details interaction and
`cubic-bezier(.23,1,.32,1)` / `cubic-bezier(.32,.72,0,1)` easing are retained.
Checkout items, delivery and payment are replaced by existing portfolio project
details, role, gallery and real links. The uninstalled shadcn/Vaul body-oriented
drawer is replaced by an absolute in-device React/Motion shell with local focus,
inert-sibling and scroll containment. This is an adaptation, not the upstream
Vaul implementation; drag-to-snap is not included. Motion stays enabled under
reduced-motion media per this project's explicit policy. No dependency added.
The fetched registry and upstream source, with SHA256 provenance, are retained in
the local overlay verification evidence (not shipped to the browser).

## Kokonut UI — MIT

Copyright (c) 2025 kokonutUI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
