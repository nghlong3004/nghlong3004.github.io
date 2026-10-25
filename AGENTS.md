# Hướng dẫn làm việc trong repo

## Khôi phục context

1. Đọc [TREE.md](TREE.md) để chọn module theo việc cần làm.
2. Thêm/sửa nội dung: đọc `src/features/portfolio/data/portfolio.ts` và `src/features/portfolio/types.ts`.
3. Đổi cấu hình máy: đọc `src/app/config/device.ts`.
4. Xem cách ghép trang/slot: đọc `src/app/App.tsx`.
5. Chỉ đọc engine khi sửa hoạt động của máy; dùng `rg -n 'tênSymbol' src/features/foldfolio` để tìm đúng vùng.

## Kiến trúc và ranh giới

- Stack: Vite 8, React 19, TypeScript 7, Tailwind CSS 4; phiên bản trong `package.json` và `pnpm-lock.yaml`.
- Entry: `index.html` → `src/main.tsx` → `src/app/App.tsx`.
- `app/`: ghép các feature, cấu hình sử dụng thực tế và CSS toàn trang.
- `features/foldfolio/`: máy gập tái sử dụng. Component thật là `FoldfolioDevice.tsx`, public props là `FoldfolioProps` trong `types.ts`.
- `features/portfolio/`: dữ liệu và component nội dung. Component nhận dữ liệu qua props; không import trực tiếp file dữ liệu.
- Hướng phụ thuộc: `app` ghép hai feature; `foldfolio` không biết `portfolio` hay `app`; `portfolio` không sửa engine.
- Bên trong feature: `components/` cho JSX, `hooks/` cho vòng đời React, `engine/` cho xử lý animation và kiểu dữ liệu nội bộ, `lib/` cho helper, `config/` cho hằng số, `styles/` cho CSS, `integrations/` cho adapter bên ngoài.
- Import trực tiếp file cần dùng. Không thêm barrel/re-export để bọc một file khác; `src/FolderFolio.tsx` cũ đã được xóa có chủ đích.
- Framer editor API được mô phỏng trong `features/foldfolio/integrations/framer/preview.ts`. Đây không phải runtime/CMS đầy đủ của Framer. Metadata editor không tự điền default props trong Vite.

## Dữ liệu, ngôn ngữ và avatar

- Dữ liệu thật đã được chuyển từ repo cũ: 4 dự án, 2 nơi làm việc, câu chuyện, 3 nhóm giải thưởng, 4 số liệu kết quả và liên hệ. Repo cũ chỉ được đọc.
- `data/portfolio.ts` ghép dữ liệu theo `vi`/`en`; sửa từng section trong các file `profiles`, `projects`, `stories`, `experiences`, `honors`, `impacts`, `labels`. `links.ts` dùng chung cho hai ngôn ngữ.
- Đồng hồ dùng chung `useVietnamClock`/`formatVietnamTime`, múi giờ `Asia/Ho_Chi_Minh`, đồng bộ cover và status bar; tự cập nhật khi qua phút/quay lại tab. Không dùng giờ cố định của template trong UI app.
- Initial language: a valid stored `lang` choice wins; otherwise use the first supported browser preference (VI/EN), falling back to Vietnamese. Only explicit changes persist `lang`; automatic detection does not become a stored choice. Language/scene selectors are temporarily hidden, not deleted. Content, notifications, HTML lang and description stay synchronized.
- Glow is the configured default. `app/config/scenePreference.ts` uses `portfolio:glow-default:v1` to migrate stale scenes once, preserving finish/other fields; later explicit scene choices remain authoritative. Do not reset preferences on every render/reload. The app omits `glowColors` to restore original image-derived Glow; the optional engine palette API remains for other callers.
- `useVietnamClock` supplies one `{ time, age }` snapshot. Age is completed years for 2005-06-06 on the Vietnam civil date; display it inside the battery-shaped pill with age/not-device-battery accessibility text. Never read the device battery API for this indicator.
- Status employer branding is logo-only: `status.employerLogo` receives the existing light/dark VinFast assets and fact-only accessible label from App. Choose the asset using the right status group's resolved tint. The clock stays left; logo, simulated cellular signal, decorative Wi-Fi and age stay right. Wi-Fi replaces 5G and derives its active arcs from the same shared simulated level/cadence, never a network API or separate timer. Time/right groups have a common fixed 22px height; verify painted icon bounds, not only SVG boxes. The battery-like outline contains age, not charge. This is an iPhone 18 Pro/iOS-inspired adaptation, not an exact Apple UI; five simulated bars deliberately differ from Apple's four.
- Project có summary, công nghệ, liveUrl/sourceCode tùy chọn, ảnh chính/gallery, details/role dạng `ContentBlock[]` (paragraph/list). Không đưa lại HTML thô vào dữ liệu hoặc thêm parser HTML.
- Technology headings use Vietnamese `Công nghệ sử dụng` on one line; keep appropriate English labels and existing display/metadata roles. Exclude OAuth2/JWT, WebSocket and A* Pathfinding only from project `techStack` presentation and derived loops; retain unrelated narrative and past-experience data.
- `App.tsx` owns shared `expandedProject` and Contact draft/validation. Project triggers open ONE `ProjectOverlay` in the device's continuous overlay slot, not a dialog per half/body portal. IDs use `useId`; obsolete inline `ProjectsSection` and Work project-filter state are removed.
- App supplies the active PortfolioScreen through `screenInteractive`/`screenInteractivePortrait` for ALL views. This canonical DOM owns native caret/selection/focus when flat; screen/screenPortrait copies remain folding visuals and are inert/aria-hidden. Keep the canonical node stable across orientation changes, clip-only ancestry and engine-backed `focusScreenElement` reveal with preventScroll. The ProjectOverlay remains a separate higher focus-trapped slot.
- Automatic focus reveal skips nontabbable containers such as the full-page view root; visual-viewport callbacks follow only a still-focused editable. Keep explicit validation/imperative focus reveal, viewport remapping and genuine fold focus fallback. An outside tap must not scroll the view root back to its own top.
- One `TechnologyLoopProvider` surrounds the entire device, never one per screen copy. TechnologyLoop uses unique public-project techStack labels only, truthful library-logo/text mapping and a shared phase/pause controller. Preserve full React Bits MIT + Commons Clause notice; this is a documented line-only adaptation, not the full upstream API.
- **Thay avatar:** sửa `src/features/portfolio/data/portrait.ts`: `portraits.vi/en` dùng chung một `src`, alt trung thực theo ngôn ngữ. Cả cover, About/main và final/contact nhận `data.profile.portrait` qua props; không import dữ liệu vào component hoặc tách nguồn ảnh riêng cho entry.
- Mọi portrait dùng JPEG gốc `public/portrait/entry-wallpaper.jpg`, không chỉnh/tạo lại/nhân đôi ảnh. Không khẳng định người trong ảnh là chủ portfolio. `Portrait.tsx` render img thường; cấu hình/crop SVG riêng cho screenshot đã bỏ. `public/portrait/reference.jpg` và `public/tmp/` chỉ giữ làm tham chiếu cũ, không render thành avatar.
- Chỉ `.portfolio-cover__portrait` phủ toàn bộ SCREEN bằng `inset:0`, `object-fit:cover` và focal position responsive; không phủ browser/hardware hoặc đổi About/final thành wallpaper. About giữ panel portrait, final giữ ảnh tròn nhỏ dù cùng dùng ảnh mới. Giữ scrim đủ tương phản cho clock/status và controls. Quy tắc entry-only trước đây chỉ còn đúng với layout, không còn đúng với nguồn ảnh.
- Compact entry ưu tiên card công việc VinFast hiện có → Experience/job-current. Desktop giữ cả VinFast và VinQA → Work/project-vinqa; không thay dữ liệu dự án VinQA toàn cục.
- Các ảnh `public/tmp/` là tham chiếu thiết kế của người dùng; không xóa. Không dùng ảnh chân dung stock trong repo cũ làm giải thưởng.
- Alumni Sans variable (tên/đồng hồ/tiêu đề, cùng dùng cho VI/EN) đã được chấp nhận về hình ảnh; Geist (nội dung/UI) và Geist Mono (metadata) vẫn giữ nguyên. Font self-host trong `public/fonts/`, có OFL. Giữ display800 cho clock/900 cho headings, không thêm font riêng theo ngôn ngữ. Sofia gốc/OFL vẫn giữ nhưng không render. Không suy diễn rằng đổi font đã chứng minh hoặc sửa mọi vấn đề rasterization. Giữ phần cứng có sẵn.
- Quyền riêng tư: chỉ công bố chủ portfolio đang làm việc tại VinFast. Không đưa mô tả công việc đang làm, nhiệm vụ, chi tiết nội bộ hoặc số liệu gắn với nơi làm việc hiện tại vào UI, dữ liệu client, metadata, tài liệu hay test công khai. Giữ thông tin dự án độc lập/lịch sử công khai; không chép lại nội dung đã gỡ vào ghi chú kiểm chứng. Thay đổi local không xóa lịch sử Git hay nội dung bản đã phát hành.
- Component slot phải nhận và chuyển `style` xuống phần tử gốc. Muốn thêm section: model → data vi/en → component → ghép trong PortfolioScreen.
- Muốn nội dung mobile khác: dùng screenPortrait/coverPortrait/callPortrait/navPortrait. Engine vẫn hỗ trợ nav, nameLeft/nameRight, sceneImages.

## Giữ hành vi của máy

- Không tự đổi timing, easing, geometry, storage key, dependency hay thiết kế khi task chỉ sửa cấu trúc/dữ liệu.
- Idle Float stays OFF. Only the decorative cellular/Wi-Fi indicators and explicitly requested technology LogoLoop animate while idle. Both indicators use one shared random level2–5 every~2s (Wi-Fi: dot plus0–3 active arcs), no real network/battery API. Loops use real public-project technology data, shared phase/pause across hardware copies, hover/focus and hidden/offscreen cleanup; no visible pause control or bullet separators. Missing library logos require genuine official/credible assets with provenance/license (including Playwright/promptfoo), not arbitrary text-only or unrelated-logo substitution. Generic concepts need no invented brand. Do not animate every compact badge.
- Exactly one active view. Home retains its identity header, then content sections in this order: Experience → Technologies used → Working approach → Featured projects → Awards and achievements. Existing truthful metrics belong to the last section, not a separate preceding section. Work contains EMPLOYMENT HISTORY ONLY (fact-only current VinFast and safe past history), never project grids/filters, metrics or honors. Projects remains a LIGHT overview with ONE tile per project and the shared drawer; independent project records are retained. About retains introduction/story/achievements; Contact retains its brief form. Legacy `experience` and VinFast destinations resolve to employment-only Work; honors remain Home/About.
- Bottom nav order is Home → About → Projects → Work → Contact in both languages. Initial/return view is Home; project notifications select Projects + shared dialog ID. No concatenated-view anchor navigation. This portfolio ends OPEN after active content: omit terminal closing/hold/final ending phases while retaining initial cover/unfold and reusable engine closing/call capabilities. Do not apply the superseded final-screen centering/Instagram alternative.
- Home and Work end with a semantic localized Contact footer using the existing About/Projects heading/action conventions. It is separate from Home's five content sections and Work's employment history, not a restored terminal folding screen. Keep the mobile hero unchanged until a product choice resolves name/CTA placement.
- Shared `pf-*` tokens/primitives in portfolio.css load BEFORE screen-specific styles. Work and Projects use the shared light theme; About retains its split hero. Contact VIEW has a full-width statement and no portrait; entry, About and separate final folded portraits remain unchanged. Contact keeps semantic input types but uses typed VI/EN inline validation with `noValidate`, shared touched/submitted state, field-error descriptions and safe first-invalid focus, not native validation popups. Submit only prepares an encoded mailto draft; no delivery claim, backend or server storage/transmission.
- Contact's four social icons share one row, with email centered on its own row. Use the shared scoped brand-icon mapping rather than copied brand SVG paths. Entry Instagram/LinkedIn and final GitHub/LinkedIn placements stay separate and unchanged.
- Mark nested full-width background boundaries with `data-ff-surface` for scan-time status tint. Narrow desktop panels are excluded from whole-screen surface selection. Screen-motion callbacks must remain owned/cancellable, detached-target guarded and StrictMode-rearmable; retain nominal reveal/counter timings.
- About uses official Kokonut Marker Text in controlled mode for synchronized copies. Refresh ink after folding/focus/scroll; keep upstream strokes/timings. Final Slide to Confirm returns to entry/Home, keyboard-enabled, no call/audio/external action. Retain GitHub-left/LinkedIn-right and THIRD_PARTY_NOTICES.md.
- `screenOverlay`/`screenOverlayPortrait` render once in the existing clipped screen overlay above nav, only when flat/open. Official Kokonut Smooth Drawer adaptation retains peek/expanded/easing, with existing Motion/device-local focus and scroll instead of Vaul/body portals/drag-to-snap. Trap focus, close/Escape/backdrop and restore previous focus/inert/overflow on cleanup. Fold shading remains; decorative crease disappears when flat.
- `screenNavigation?: { key: string; target?: string }` requests opening/resetting already-rendered content; undefined initially preserves the cover. New request keys reset to the active view's top or intra-view `data-ff-section` target, keeping an open device open. `FoldfolioHandle.scrollToSection(key)` remains a reusable intra-view API. Do not use native hashes/scrollIntoView for slots or remount the whole device.
- `fold`: cuộn mở máy → cuộn nội dung → đóng máy → call screen. `open`: máy luôn mở, cuộn trang di chuyển nội dung.
- Orientation `auto` dựa trên độ rộng/tỉ lệ viewport. Screen thiết kế landscape `976 × 660`, portrait `358 × 718`; xem `config/constants.ts`.
- `renderDevice` và `renderScenes` là hàm trả JSX gọi trực tiếp. Giữ DOM, slot và ref: scanner/filter/tint dựa vào cấu trúc này. Không tự thêm wrapper hoặc đổi thành component.
- `geo`, `live`, `R` và callback ref `renderFrame`, `scan`, `motionTick`, `paintScenes`, `kick` giữ trạng thái engine. rAF ghi DOM qua `S`, không set state mỗi frame.
- Giữ cách gán callback ref trong render và dependency array hiện tại nếu chưa kiểm chứng thay đổi vòng đời.
- `useDeviceRefs`: từng `useRef` phải khai báo riêng, ngoài object literal; React Compiler từng cache nhầm hook call nằm trong object literal.
- Current explicit motion policy: do NOT bypass intro, smoothing, reveals, snapshots or view transitions for `prefers-reduced-motion: reduce`. The obsolete reduced-motion hook/branches are removed, not replaced with a false stub. This intentionally does not honor motion-sensitive OS preferences; retain keyboard/focus/labels, no flashes/strobes, no idle float, and complete lifecycle cleanup.
- Giữ cleanup listener/observer/timer/rAF; kiểm tra cả StrictMode, resize và chuyển tab.
- Key: `foldfolio:style` cho localStorage/custom event; `ff-seen`, `ff-warm:*` cho sessionStorage; `ff-pagesnap` cho snapshot DOM.
- Dùng `import type` vì `verbatimModuleSyntax` bật. Không thêm package Framer để chạy local.

## Lệnh và kiểm tra

```sh
pnpm install
pnpm dev --host 0.0.0.0
pnpm build
pnpm lint
pnpm test
```

Dev mặc định ở `http://localhost:5173/`. Build chạy TypeScript trước Vite. Lint còn warning về refs/effects của engine; không tắt rule hàng loạt hoặc đổi animation chỉ để hết warning.

- Đổi nội dung: kiểm tra đủ Việt/Anh, desktop/mobile, screen/cover/call; thông báo mở đúng kinh nghiệm/VinQA và email.
- Check idle stability, shared project expansion across both halves/view switches/language changes, genuine per-view DOM separation and scrolling, folded/open navigation, notifications and focus. Verify motion actually runs under both normal and reduce media preferences.
- Đổi engine/render: kiểm tra `fold` đầu/giữa/cuối và `open`, Basic/Glow/Orbit, finish, header/bottom switcher, resize/reload.
- Kiểm tra motion/filter bằng nội dung dài, heading/counter/ảnh/link lọc; màn hình trống không kiểm chứng được chúng.
- Thêm/bớt/di chuyển file: cập nhật `TREE.md` và toàn bộ import. Xóa file hết caller thay vì giữ re-export dự phòng.
