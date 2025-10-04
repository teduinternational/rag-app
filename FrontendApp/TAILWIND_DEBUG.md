# Hướng dẫn Kiểm tra và Sửa lỗi Tailwind CSS

## Vấn đề: Tailwind CSS không hoạt động (styles không được apply)

### Bước 1: Kiểm tra Browser
1. Mở http://localhost:5173 trong browser
2. Mở DevTools (F12)
3. Kiểm tra Elements tab - xem các class có được thêm vào HTML không
4. Kiểm tra Network tab - xem file CSS có được load không

### Bước 2: Kiểm tra Console Errors
- Xem có error nào về CSS hoặc Tailwind trong Console không

### Bước 3: Test Component
File `TestTailwind.tsx` đã được tạo để test.  
Nếu bạn thấy:
- ✅ **Background xanh, text trắng, button styled** → Tailwind hoạt động!
- ❌ **Text đen, không có styling** → Tailwind KHÔNG hoạt động

### Nếu Tailwind KHÔNG hoạt động:

#### Solution 1: Sử dụng Tailwind CSS v3 (Recommended)

```powershell
cd C:\SourceCodes\rag-app\FrontendApp

# Remove Tailwind v4
npm uninstall tailwindcss @tailwindcss/vite @tailwindcss/postcss

# Install Tailwind v3
npm install -D tailwindcss@^3 postcss autoprefixer

# Init Tailwind
npx tailwindcss init -p
```

Sau đó cập nhật `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom CSS here */
```

Cập nhật `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

Cập nhật `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### Solution 2: Sử dụng CDN (Quick Test)

Thêm vào `index.html`:
```html
<head>
  ...
  <script src="https://cdn.tailwindcss.com"></script>
</head>
```

### Bước 4: Restart Dev Server

```powershell
# Stop current server (Ctrl+C)
npm run dev
```

### Bước 5: Clear Browser Cache

1. Hard refresh: Ctrl + Shift + R (hoặc Cmd + Shift + R trên Mac)
2. Hoặc clear cache in DevTools

### Bước 6: Verify

Sau khi áp dụng solution, kiểm tra lại:
1. Test component có styled không
2. Chat UI có gradient background không
3. Buttons có hover effects không

## Current Setup (Tailwind v4)

Hiện tại project đang dùng:
- `@tailwindcss/vite` v4.1.14
- `tailwindcss` v4.1.14  
- Vite plugin: `tailwindcss()` in vite.config.ts
- CSS: `@import "tailwindcss"` in index.css

Tailwind v4 là version mới và có thể có issues. Nếu không hoạt động, khuyến nghị dùng v3.

## Verification Checklist

- [ ] Dev server đang chạy
- [ ] Không có errors trong console
- [ ] File CSS được load trong Network tab
- [ ] Test component hiển thị với styling
- [ ] Chat UI có background gradient
- [ ] Buttons có colors và hover effects
- [ ] Dark mode toggle hoạt động

## Contact & Support

Nếu vẫn gặp vấn đề sau khi thử các solutions trên, có thể:
1. Xóa `node_modules` và chạy `npm install` lại
2. Restart VS Code
3. Check Tailwind CSS docs: https://tailwindcss.com/docs/installation