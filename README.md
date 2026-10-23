# Foldfolio — Nguyen Hoang Long

Portfolio Việt/Anh trong một thiết bị gập, dùng React + TypeScript + Vite.

```sh
pnpm install
pnpm dev
```

Mở địa chỉ Vite in ra terminal (mặc định `http://localhost:5173/`). Chạm thông báo để mở kinh nghiệm hoặc VinQA, cuộn để khám phá và xem thêm từng dự án. Đồng hồ hiển thị giờ Việt Nam và tự cập nhật. Nút VI/EN lưu ngôn ngữ; email và mạng xã hội dùng link thật từ portfolio cũ.

- **Thêm/sửa dữ liệu:** các file trong `src/features/portfolio/data/`, mỗi section có bản `vi` và `en`.
- **Thay avatar mẫu:** sửa `data/portrait.ts`, đặt ảnh mới trong `public/portrait/`, đổi `src`/`alt` và bỏ `referenceCrop`. Cả ba màn hình tự dùng ảnh mới.
- **Cấu hình máy:** `src/app/config/device.ts`. Idle Float đang tắt theo yêu cầu để chữ đứng yên khi không cuộn.
- **Ghép các màn hình:** `src/app/App.tsx`.
- **Bản đồ mã nguồn:** [TREE.md](TREE.md). **Hướng dẫn agent:** [AGENTS.md](AGENTS.md).

Chân dung hiện là ảnh mẫu từ screenshot trong `public/tmp/`, không phải ảnh của chủ portfolio. Font Sofia Sans Extra Condensed, Geist và Geist Mono được đối chiếu với Foldfolio gốc, self-host kèm giấy phép OFL. Bản local dùng adapter Framer editor API, không cần Framer runtime hay backend.

```sh
pnpm build
pnpm lint
pnpm test
```

Test dùng Node có hỗ trợ TypeScript type stripping. Kiểm tra browser thêm: ba thông báo, bung dự án ở cả hai nửa màn, đổi ngôn ngữ, resize, giảm chuyển động và đứng yên không dịch chữ.
