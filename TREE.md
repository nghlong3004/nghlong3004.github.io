# Bản đồ project

`app` ghép trang; `foldfolio` sở hữu thiết bị; `portfolio` sở hữu dữ liệu/nội dung. Cây rút gọn bỏ `.git`, `node_modules`, `dist`.

```text
.
├── AGENTS.md / TREE.md / README.md
├── THIRD_PARTY_NOTICES.md             # Official Kokonut component attribution and MIT license
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
│   └── screen-navigation.test.mjs      # Active-content requests and open/fold reconciliation
├── public/
│   ├── project/                       # Ảnh chính và gallery 4 dự án
│   │   └── vinqa/header.webp           # Supplied VinQA logo, locally downloaded bytes
│   ├── company/                       # Logo VinFast / Vinsmart Future
│   ├── portrait/reference.jpg         # Shared About/final screenshot sample, unchanged
│   ├── portrait/entry-wallpaper.jpg   # Original supplied JPEG; initial SCREEN wallpaper only
│   ├── fonts/                         # Sofia Sans Extra Condensed 800/900 / Geist / Geist Mono + OFL
│   ├── tmp/                           # 3 screenshot tham chiếu, giữ nguyên
│   └── favicon.webp                   # Logo NL từ repo cũ
└── src/
    ├── main.tsx                       # createRoot + StrictMode
    ├── app/
    │   ├── App.tsx                    # NGHLONG3004, VI/EN, state dự án, slot, nav
    │   ├── config/
    │   │   ├── device.ts              # Glow palette/default; Idle Float OFF
    │   │   └── scenePreference.ts     # One-time stale-scene migration; preserve finish
    │   └── styles/globals.css
    └── features/
        ├── portfolio/
        │   ├── types.ts               # ContentBlock, model dữ liệu, Language, labels
        │   ├── data/
        │   │   ├── portfolio.ts       # Ghép Record<Language, PortfolioData>
        │   │   ├── profiles.ts        # Tên, nghề, bio, địa điểm, email
        │   │   ├── portrait.ts        # Shared portrait + separate entryPortrait wallpaper
        │   │   ├── projects.ts        # 4 dự án, công nghệ, links, mô tả/gallery
        │   │   ├── stories.ts         # Câu chuyện và nguyên tắc
        │   │   ├── experiences.ts     # 2 nơi làm việc
        │   │   ├── honors.ts          # 3 nhóm thành tích
        │   │   ├── impacts.ts         # 4 số liệu kết quả
        │   │   ├── links.ts           # Email, GitHub, LinkedIn, Instagram
        │   │   └── labels.ts          # Nhãn giao diện và thông báo vi/en
        │   ├── hooks/                     # usePortfolioLanguage, useVietnamClock
        │   ├── lib/                    # vietnamTime, language, navigation destinations, class helper
        │   ├── styles/portfolio.css   # Font local + UI màn chính/lockscreen/contact
        │   └── components/
        │       ├── PortfolioScreen.tsx
        │       ├── views/              # About, Work, Experience, Contact; only active view mounted
        │       ├── kokonut/            # Official Marker Text / Slide to Confirm source adaptations
        │       ├── PortfolioCover.tsx # Clock/portrait; job + VinQA, compact status; Instagram/LinkedIn
        │       ├── PortfolioContact.tsx
        │       ├── Icon.tsx                # SVG nét 1.5px, không dùng emoji cho nút
        │       ├── Portrait.tsx       # Crop tham chiếu bằng viewBox hoặc ảnh thật
        │       ├── ContentBlocks.tsx  # Paragraph/list, không inject HTML
        │       └── sections/
        │           ├── ProjectsSection.tsx
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
| Bung/đóng chi tiết dự án | `portfolio/components/sections/ProjectsSection.tsx`, state trong App |
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
rg -n 'portrait|referenceCrop' src/features/portfolio
rg -n 'scrollToSection|data-ff-section' src
rg -n 'float|needsTime|renderFrame' src/features/foldfolio src/app/config
pnpm test
```

Hai nửa màn hình là hai bản render của cùng dữ liệu. State tương tác phải ở App, aria ID phải riêng từng bản, đích điều hướng dùng data-ff-section và được tìm trong screen ref thay vì document ID/hash.
