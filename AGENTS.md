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
- Glow is the configured default. `app/config/scenePreference.ts` uses `portfolio:glow-default:v1` to migrate stale scenes once, preserving finish/other fields; later explicit scene choices remain authoritative. Do not reset preferences on every render/reload. The app's optional `glowColors` palette gives a feathered bloom; reusable engine callers without it retain image-derived Glow.
- `useVietnamClock` supplies one `{ time, age }` snapshot. Age is completed years for 2005-06-06 on the Vietnam civil date; display it inside the battery-shaped pill with age/not-device-battery accessibility text. Never read the device battery API for this indicator.
- Project có summary, công nghệ, liveUrl/sourceCode tùy chọn, ảnh chính/gallery, details/role dạng `ContentBlock[]` (paragraph/list). Không đưa lại HTML thô vào dữ liệu hoặc thêm parser HTML.
- `App.tsx` giữ `expandedProject` dùng chung: hai nửa màn hình phải bung cùng dự án. `ProjectsSection` dùng `useId` để aria-controls không trùng giữa các bản sao.
- **Thay avatar:** sửa `src/features/portfolio/data/portrait.ts`: `portraits.vi/en` dùng chung một `src`, alt trung thực theo ngôn ngữ. Cả cover, About/main và final/contact nhận `data.profile.portrait` qua props; không import dữ liệu vào component hoặc tách nguồn ảnh riêng cho entry.
- Mọi portrait dùng JPEG gốc `public/portrait/entry-wallpaper.jpg`, không chỉnh/tạo lại/nhân đôi ảnh. Không khẳng định người trong ảnh là chủ portfolio. `Portrait.tsx` render img thường; cấu hình/crop SVG riêng cho screenshot đã bỏ. `public/portrait/reference.jpg` và `public/tmp/` chỉ giữ làm tham chiếu cũ, không render thành avatar.
- Chỉ `.portfolio-cover__portrait` phủ toàn bộ SCREEN bằng `inset:0`, `object-fit:cover` và focal position responsive; không phủ browser/hardware hoặc đổi About/final thành wallpaper. About giữ panel portrait, final giữ ảnh tròn nhỏ dù cùng dùng ảnh mới. Giữ scrim đủ tương phản cho clock/status và controls. Quy tắc entry-only trước đây chỉ còn đúng với layout, không còn đúng với nguồn ảnh.
- Compact entry ưu tiên card công việc VinFast hiện có → Experience/job-current. Desktop giữ cả VinFast và VinQA → Work/project-vinqa; không thay dữ liệu dự án VinQA toàn cục.
- Các ảnh `public/tmp/` là tham chiếu thiết kế của người dùng; không xóa. Không dùng ảnh chân dung stock trong repo cũ làm giải thưởng.
- Font Sofia Sans Extra Condensed (tên/đồng hồ/tiêu đề), Geist (nội dung/UI) và Geist Mono (metadata ngắn theo trang gốc) được self-host trong `public/fonts/`, có OFL đi kèm. Thiết kế bám ảnh tham chiếu: nền sáng, tên lớn, chân dung, lockscreen và thanh thông báo. Giữ thiết kế phần cứng có sẵn.
- Component slot phải nhận và chuyển `style` xuống phần tử gốc. Muốn thêm section: model → data vi/en → component → ghép trong PortfolioScreen.
- Muốn nội dung mobile khác: dùng screenPortrait/coverPortrait/callPortrait/navPortrait. Engine vẫn hỗ trợ nav, nameLeft/nameRight, sceneImages.

## Giữ hành vi của máy

- Không tự đổi timing, easing, geometry, storage key, dependency hay thiết kế khi task chỉ sửa cấu trúc/dữ liệu.
- Idle Float trong cấu hình app phải tắt: người dùng yêu cầu chữ/máy đứng yên khi không cuộn. Không tự bật lại.
- App navigation renders exactly one active portfolio view: About=introduction/story, Work=projects/results, Experience=jobs/honors, Contact=contact. The final folded screen stays separate. Changing destinations changes content state, not an anchor within concatenated views; shared project expansion stays in App.
- About uses the official Kokonut Marker Text in controlled mode for synchronized hardware copies. Refresh local ink coordinates after folding/focus and scroll completion; keep upstream strokes/timings. The light final folded screen uses official Slide to Confirm to return to entry/About, with keyboard support and no call/audio/external action. Retain GitHub-left/LinkedIn-right and THIRD_PARTY_NOTICES.md.
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
