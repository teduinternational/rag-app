# RAG Chat Frontend

Giao diện người dùng đẹp mắt cho hệ thống RAG Chat Assistant, được xây dựng với React, TypeScript và Tailwind CSS.

## Tính năng

- 🎨 **Giao diện đẹp mắt**: Thiết kế hiện đại với Tailwind CSS
- 🌙 **Dark Mode**: Chế độ sáng/tối có thể chuyển đổi
- ⚙️ **Cài đặt tùy chỉnh**: Điều chỉnh Top K và Min Score cho tìm kiếm
- 📱 **Responsive**: Tương thích với mọi kích thước màn hình
- 🔄 **Real-time API Status**: Hiển thị trạng thái kết nối API
- ✨ **Typing Indicator**: Hiệu ứng loading khi AI đang trả lời
- 📖 **Source Citations**: Hiển thị nguồn tài liệu tham khảo

## Công nghệ sử dụng

- **React 19** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Fetch API** - HTTP client

## Cài đặt và chạy

### Yêu cầu
- Node.js 18+
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### Build production
```bash
npm run build
```

## Cấu hình API

Frontend được cấu hình để kết nối với backend API tại `https://localhost:5154`. 

Để thay đổi URL API, chỉnh sửa file `src/services/chatService.ts`:

```typescript
const API_BASE_URL = 'https://your-api-url';
```

## Cấu trúc project

```
src/
├── components/           # React components
│   ├── Chat.tsx         # Component chính
│   ├── ChatMessage.tsx  # Hiển thị tin nhắn
│   ├── ChatInput.tsx    # Input và settings
│   ├── SettingsPanel.tsx # Panel cài đặt
│   └── ApiStatus.tsx    # Hiển thị trạng thái API
├── services/            # API services
│   └── chatService.ts   # Chat API client
├── types/               # TypeScript types
│   └── chat.ts         # Chat-related types
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

## API Endpoints

Frontend tương tác với các endpoints sau:

- `POST /chat/assist` - Gửi tin nhắn và nhận phản hồi
- `GET /Health` - Kiểm tra trạng thái API

## Features trong UI

### 1. Chat Interface
- Giao diện chat trực quan với bubble messages
- Phân biệt rõ ràng giữa tin nhắn người dùng và AI
- Hiển thị timestamp cho mỗi tin nhắn

### 2. Dark Mode
- Toggle dark/light mode trong settings panel
- Persistent theme preferences
- Smooth transitions

### 3. Search Settings
- **Top K**: Số lượng tài liệu liên quan nhất (1-20)
- **Min Score**: Điểm similarity tối thiểu (-1 đến 1)
- Cài đặt với slider và number input

### 4. Source Citations
- Hiển thị nguồn tài liệu được tham khảo
- Score relevance cho mỗi nguồn
- Format đẹp mắt trong tin nhắn

### 5. Error Handling
- Hiển thị lỗi kết nối API
- Retry mechanism
- User-friendly error messages

## Tùy chỉnh

### Thay đổi theme colors
Chỉnh sửa `tailwind.config.js` để tùy chỉnh màu sắc:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        // ...
      }
    }
  }
}
```

### Thêm animations
Tailwind CSS hỗ trợ nhiều animations có sẵn. Ví dụ:
- `animate-pulse` - Loading effect
- `animate-bounce` - Typing indicator
- `animate-spin` - Loading spinner

## License

MIT License