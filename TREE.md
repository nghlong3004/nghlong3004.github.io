# Bản đồ project

`app` ghép trang; `foldfolio` sở hữu thiết bị; `portfolio` sở hữu dữ liệu/nội dung. Cây rút gọn bỏ `.git`, `node_modules`, `dist`.

```text
.
├── AGENTS.md / TREE.md / README.md
├── .gitattributes                    # Preserve exact upstream technology asset/license bytes
├── THIRD_PARTY_NOTICES.md             # Kokonut, React Bits and icon provenance/licenses
├── .github/workflows/deploy.yml       # Build dist and publish main to GitHub Pages
├── docs/VERIFICATION.md               # Public verification summary; no session metadata
├── package.json / pnpm-lock.yaml
├── components.json                   # Official React Bits/Kokonut MCP registry discovery only
├── index.html / vite.config.ts / tsconfig*.json / .oxlintrc.json
├── .taste-skill/                       # Reference notes; generated captures stay local/ignored
├── tests/
│   ├── portfolio.test.mjs              # Điều hướng, dữ liệu, asset local, múi giờ VN
│   ├── navigation-transition.test.mjs  # Snapshot ownership, cleanup, early ref calls
│   ├── page-transitions.test.mjs       # Intro lifecycle/replay/cancellation and snapshot adoption
│   ├── portfolio-views.test.mjs        # Real active-view markup and destination resolution
│   ├── marker-text.test.mjs            # Official mark parity, scaled geometry and cleanup
│   ├── kokonut-components.test.mjs     # Official slider markup and localized keyboard labels
│   ├── screen-navigation.test.mjs      # Active-content requests and open/fold reconciliation
│   ├── device-reference.test.mjs       # Flat surface, overlay slot and signal lifecycle
│   ├── project-overlay.test.mjs        # Controlled device-local drawer
│   ├── reference-motion.test.mjs       # Shared engine markers across screen content
│   ├── status-surface.test.mjs         # Nested full-width background boundaries for status tint
│   ├── status-employer.test.mjs        # Logo contrast, outlined age and generic status API
│   ├── open-ending.test.mjs            # App stays open at content end; generic closing retained
│   ├── technology-presentation.test.mjs # One-line bilingual headings, project stack exclusions
│   ├── screen-motion-cleanup.test.mjs  # Counter/reveal timeout and rAF disposal/StrictMode
│   ├── typography.test.mjs             # Bilingual display family and actual Vietnamese font coverage
│   ├── privacy-copy.test.mjs          # Fact-only current employer and grounded bilingual copy
│   ├── brand-icons.test.mjs           # Locked library icons and honest technology aliases
│   ├── contact-validation.test.mjs    # Typed localized errors, touched/submission state
│   ├── screen-interaction.test.mjs    # Continuous native interaction, focus/viewport lifecycle
│   ├── technology-loop.test.mjs       # Shared loop timeline, pause/cleanup and public tech inputs
│   └── *-view.test.mjs                 # Home/Work/Projects/About/Contact callbacks and content
├── public/
│   ├── project/                       # Ảnh chính và gallery 4 dự án
│   │   └── vinqa/header.webp           # Supplied VinQA logo, locally downloaded bytes
│   ├── company/                       # Logo VinFast / Vinsmart Future
│   ├── technology/                    # Genuine Playwright/Promptfoo SVGs + upstream licenses/NOTICE
│   ├── portrait/reference.jpg         # Retained old screenshot reference; not rendered as avatar
│   ├── portrait/entry-wallpaper.jpg   # Original supplied JPEG; shared by ALL profile portraits
│   ├── fonts/                         # Alumni variable / Geist / Geist Mono + OFL; original Sofia retained unused
│   ├── tmp/                           # 3 screenshot tham chiếu, giữ nguyên
│   └── favicon.webp                   # Logo NL từ repo cũ
└── src/
    ├── main.tsx                       # createRoot + StrictMode
    ├── app/
    │   ├── App.tsx                    # NGHLONG3004, VI/EN, state dự án, slot, nav
    │   ├── config/
    │   │   ├── device.ts              # Image-derived Glow default; Idle Float OFF
    │   │   └── scenePreference.ts     # One-time stale-scene migration; preserve finish
    │   └── styles/globals.css
    └── features/
        ├── portfolio/
        │   ├── types.ts               # ContentBlock, model dữ liệu, Language, labels
        │   ├── data/
        │   │   ├── portfolio.ts       # Ghép Record<Language, PortfolioData>
        │   │   ├── profiles.ts        # Tên, nghề, bio, địa điểm, email
        │   │   ├── portrait.ts        # One shared image source + neutral VI/EN alt text
        │   │   ├── projects.ts        # 4 dự án, công nghệ, links, mô tả/gallery
        │   │   ├── stories.ts         # Câu chuyện và nguyên tắc
        │   │   ├── experiences.ts     # 2 nơi làm việc
        │   │   ├── honors.ts          # 3 nhóm thành tích
        │   │   ├── impacts.ts         # 4 số liệu kết quả
        │   │   ├── links.ts           # Email, GitHub, LinkedIn, Instagram
        │   │   └── labels.ts          # Nhãn giao diện và thông báo vi/en
        │   ├── hooks/                 # Language/clock plus provider-owned technology loop controller
        │   ├── lib/                   # Time/language/navigation, brand/technology maps, Contact validation
        │   ├── styles/portfolio.css   # Fonts + shared pf-* tokens, cover/final/Experience
        │   ├── styles/{home,work,projects,about,contact,project-overlay}.css # Scoped compositions
        │   ├── styles/{logo-loop,technology-loop}.css # Official line-loop styles + portfolio treatment
        │   └── components/
        │       ├── PortfolioScreen.tsx
        │       ├── views/              # Home, About, Projects, employment-only Work, Contact
        │       ├── kokonut/            # Marker Text / Slide to Confirm / ProjectOverlay adaptations
        │       ├── reactbits/          # Line-only LogoLoop adaptation + complete MIT/Commons Clause notice
        │       ├── TechnologyLoop.tsx # Public technology wrapper + one provider for all screen copies
        │       ├── PortfolioCover.tsx # Clock/portrait; job + VinQA, compact status; Instagram/LinkedIn
        │       ├── PortfolioContact.tsx
        │       ├── Icon.tsx            # Utility SVGs + scoped react-icons brands; no emoji
        │       ├── Portrait.tsx       # Shared img renderer; layout comes from each consumer
        │       ├── ContentBlocks.tsx  # Paragraph/list, không inject HTML
        │       └── sections/
        │           └── ExperienceSection.tsx
        └── foldfolio/
            ├── FoldfolioDevice.tsx    # Component điều phối
            ├── types.ts              # FoldfolioProps và FoldfolioHandle
            ├── components/            # Slot, renderDevice, renderScenes
            ├── config/constants.ts   # GEO, FINISHES, SCENES, MOTION_DEFAULTS
            ├── engine/
            │   ├── types.ts
            │   ├── createFrameRenderer.ts
            │   ├── navigation.ts      # Đổi offset section sang scroll timeline
            │   └── snapshots.ts
            ├── hooks/
            │   ├── useDeviceRefs.ts
            │   ├── useIsoLayoutEffect.ts
            │   ├── useSectionNavigation.ts # React ref scrollToSection
            │   ├── useSceneImages.ts
            │   ├── useSignalLevel.ts  # Shared simulated signal, hidden-tab pause/cleanup
            │   ├── useScreenMotion.ts
            │   ├── useScreenNavigation.ts  # Preload và filter Framer
            │   ├── useAnimationLoop.ts
            │   ├── usePageTransitions.ts
            │   └── useSwitcher.tsx
            ├── lib/                   # colors, math, storage
            ├── styles/motion.ts
            └── integrations/framer/   # preview adapter, propertyControls
```

## Query theo việc

| Việc | Điểm bắt đầu |
| --- | --- |
| Đổi tên góc trang, VI/EN, state project, nav | `src/app/App.tsx` |
| Thêm/sửa nội dung | `portfolio/data/<section>.ts`, `portfolio/types.ts` |
| Thay ảnh chân dung | `portfolio/data/portrait.ts`; ảnh mới đặt trong `public/portrait/` |
| Đổi thông báo/lockscreen | `portfolio/components/PortfolioCover.tsx`, `data/labels.ts` |
| Đổi bố cục/font/màu | `portfolio/styles/portfolio.css` |
| Mở/đóng chi tiết dự án | `portfolio/components/kokonut/ProjectOverlay.tsx`, state trong App |
| Điều hướng đúng mục trong thiết bị | `foldfolio/hooks/useSectionNavigation.ts`, `engine/navigation.ts` |
| Chữ/máy nhấp nhô khi đứng yên | `app/config/device.ts`: motion.float phải false |
| Pha gập, scroll, scale, breakpoint | `foldfolio/FoldfolioDevice.tsx`, `config/constants.ts`, `engine/createFrameRenderer.ts` |
| Intro, chuyển trang, animation loop | `foldfolio/hooks/usePageTransitions.ts`, `useAnimationLoop.ts` |
| Glow/Orbit và ảnh nền | `foldfolio/hooks/useSceneImages.ts`, `components/renderScenes.tsx` |
| Reveal, count-up, fit text | `foldfolio/hooks/useScreenMotion.ts` |

Các tiền tố `portfolio` / `foldfolio` nằm dưới `src/features/`; `app` nằm dưới `src/`.

```sh
cat AGENTS.md TREE.md
cat src/app/config/device.ts
rg -n 'portrait|entry-wallpaper' src/features/portfolio
rg -n 'scrollToSection|data-ff-section' src
rg -n 'float|needsTime|renderFrame' src/features/foldfolio src/app/config
pnpm test
```

Hai nửa phần cứng vẫn có bản render hình ảnh cùng dữ liệu khi gập. Khi phẳng, slot screenInteractive là một DOM tương tác liên tục; bản sao phần cứng inert/aria-hidden. App giữ draft/validation/project state và một TechnologyLoopProvider; Work không còn bộ lọc dự án. Đích điều hướng dùng data-ff-section trong ref nội dung hiện hành, không dùng document ID/hash.
