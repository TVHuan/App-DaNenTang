# BÀI THỰC HÀNH 5: CHAT 1-1 REALTIME VỚI FIREBASE (REACT NATIVE CLI)

Dự án ứng dụng di động nhắn tin 1-1 thời gian thực (Realtime Chat) được xây dựng hoàn toàn bằng **React Native CLI** (không dùng Expo), tích hợp **Firebase JS SDK** (`firebase/auth`, `firebase/database`) và thư viện định vị **@react-native-community/geolocation**.

---

## 1. Các tính năng hoàn thiện theo yêu cầu

### 1.1. Đăng ký / Đăng nhập
- **Màn hình Đăng ký (`RegisterScreen`)**:
  - Gồm đầy đủ các trường: Họ và tên, Email, Mật khẩu (tối thiểu 6 ký tự) và Nhập lại mật khẩu.
  - Kiểm tra tính hợp lệ: định dạng email, độ dài mật khẩu, mật khẩu nhập lại trùng khớp.
  - Lưu trữ thông tin người dùng vào Firebase Realtime Database tại node `/users/{uid}`.
- **Màn hình Đăng nhập (`LoginScreen`)**:
  - Đăng nhập bằng Firebase Authentication (`signInWithEmailAndPassword`).
  - Xử lý thông báo lỗi bằng tiếng Việt rõ ràng khi sai tài khoản hoặc mật khẩu (vd: "Sai email hoặc mật khẩu. Vui lòng kiểm tra lại", "Địa chỉ email không đúng định dạng", v.v.).
  - Tích hợp các nút đăng nhập nhanh (Quick Demo) giúp kiểm thử thuận tiện.
- **Đăng xuất (`SettingsScreen`)**:
  - Đăng xuất tài khoản, cập nhật trạng thái `isOnline: false` và `lastSeen` lên Firebase, tự động điều hướng quay về màn hình Đăng nhập.

### 1.2. Danh bạ (Contacts)
- Lấy danh sách toàn bộ người dùng đã đăng ký từ Firebase (`/users`), tự động lọc bỏ tài khoản của chính mình.
- Hiển thị trạng thái **Online / Offline** cập nhật theo thời gian thực (chấm tròn xanh "Đang hoạt động" khi online, hiển thị giờ hoạt động gần nhất khi offline).
- Thanh tìm kiếm theo tên hoặc email.
- Nhấn vào một người để mở ngay màn hình Chat 1-1 với người đó.

### 1.3. Chat 1-1 Realtime
- Gửi và nhận tin nhắn ngay lập tức qua Firebase Realtime Database (`onValue`), không cần tải lại trang.
- Giao diện trực quan:
  - **Tin của mình**: Nằm bên phải, bong bóng màu xanh (`#2563EB`), chữ trắng.
  - **Tin của đối phương**: Nằm bên trái, bong bóng màu xám sáng, kèm ảnh đại diện.
  - Mỗi tin nhắn đều hiển thị thời gian gửi (giờ:phút).
- **Tự động cuộn** xuống tin mới nhất khi có tin nhắn mới hoặc khi vừa mở cuộc trò chuyện.
- Không cho gửi tin rỗng (nút gửi bị vô hiệu hóa khi ô nhập trống).
- **Thanh tiêu đề (Header)**: Hiển thị avatar, họ tên và chấm trạng thái online/offline của đối phương cập nhật thời gian thực.
- **Tin nhắn chia sẻ vị trí (Geolocation)**:
  - Tích hợp nút gửi vị trí GPS sử dụng `@react-native-community/geolocation`.
  - Hiển thị tọa độ vĩ độ/kinh độ, địa chỉ và nút "Xem trên bản đồ" liên kết trực tiếp tới Google Maps.

### 1.4. Màn hình Home (Cuộc trò chuyện gần đây)
- Hiển thị danh sách các cuộc trò chuyện đã có của người dùng hiện tại tại node `/userChats/{uid}`.
- Gồm ảnh đại diện, tên, nội dung tin nhắn cuối cùng (có tiền tố "Bạn:" nếu do mình gửi, icon 📍 nếu là vị trí) và thời gian.
- **Sắp xếp theo thời gian mới nhất**: Cuộc trò chuyện có tin nhắn mới nhất tự động được đẩy lên đầu danh sách.
- **Badge số tin chưa đọc**: Tăng ngay lập tức khi đối phương gửi tin nhắn mới, và tự động về 0 ngay khi mở cuộc trò chuyện đó (`markChatAsRead`).

### 1.5. Màn hình Thông báo (Notifications)
- Giữ giao diện và tính năng Thông báo như Bài 4:
  - Danh sách thông báo với icon phân loại (tin nhắn, bạn bè, hệ thống, tương tác).
  - Badge số thông báo chưa đọc, nút "Đọc tất cả".
  - Chạm vào từng thông báo để đánh dấu đã đọc.

---

## 2. Cấu trúc thư mục dự án

Toàn bộ code Firebase được gom chuẩn hóa vào thư mục `src/services/` theo đúng yêu cầu kỹ thuật:

```
ThucHanh5/
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── AppButton.tsx        # Nút bấm tùy biến
│   │       ├── FormInput.tsx        # Ô nhập liệu có ẩn/hiện mật khẩu
│   │       ├── SearchBar.tsx        # Thanh tìm kiếm
│   │       └── UserAvatar.tsx       # Avatar kèm chấm online/offline
│   ├── context/
│   │   └── AuthContext.tsx          # Quản lý phiên đăng nhập & presence
│   ├── navigation/
│   │   ├── MainTabNavigator.tsx     # 4 Tabs: Trò chuyện, Danh bạ, Thông báo, Cài đặt
│   │   ├── RootNavigator.tsx        # Điều hướng Auth Stack & App Stack
│   │   └── routes.ts                # Định nghĩa tên routes & TypeScript types
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx      # Màn hình Đăng nhập
│   │   │   └── RegisterScreen.tsx   # Màn hình Đăng ký
│   │   ├── home/
│   │   │   └── HomeScreen.tsx       # Cuộc trò chuyện gần đây & Unread badge
│   │   ├── contacts/
│   │   │   └── ContactsScreen.tsx   # Danh bạ & Trạng thái online realtime
│   │   ├── chat/
│   │   │   └── ChatScreen.tsx       # Chat 1-1, tin thường & tin vị trí GPS
│   │   ├── notifications/
│   │   │   └── NotificationsScreen.tsx # Màn hình thông báo
│   │   └── settings/
│   │       └── SettingsScreen.tsx   # Thông tin tài khoản & Đăng xuất
│   ├── services/
│   │   ├── firebaseConfig.ts        # Cấu hình Firebase App, Auth, Database
│   │   ├── authService.ts           # Đăng nhập, đăng ký, đăng xuất, map lỗi tiếng Việt
│   │   ├── userService.ts           # Lấy danh bạ, presence tracking (.info/connected)
│   │   ├── chatService.ts           # Gửi tin nhắn, subscribe messages & userChats
│   │   └── locationService.ts       # Định vị GPS (@react-native-community/geolocation)
│   ├── theme/
│   │   ├── colors.ts                # Bảng màu giao diện chuẩn
│   │   ├── spacing.ts               # Khoảng cách padding/margin
│   │   └── typography.ts            # Kiểu chữ
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces (User, Message, Chat)
│   └── utils/
│       └── date.ts                  # Tiện ích định dạng ngày giờ
├── App.tsx                          # Root component
├── index.js                         # Entry point
└── package.json
```

---

## 3. Cấu hình Firebase & Luật bảo mật (Security Rules)

### 3.1. Thiết lập Firebase Project
1. Truy cập [Firebase Console](https://console.firebase.google.com/) và bấm **Add project** (Đặt tên: `thuchanh5-chat`).
2. **Authentication**:
   - Chọn menu **Build** > **Authentication** > **Get started**.
   - Tab **Sign-in method** > Chọn **Email/Password** > Bật **Enable** > Bấm **Save**.
3. **Realtime Database**:
   - Chọn menu **Build** > **Realtime Database** > **Create Database**.
   - Chọn khu vực (khuyến nghị: `Singapore - asia-southeast1`).
   - Chọn **Start in test mode** hoặc chuyển sang tab **Rules** và dán bộ luật bảo mật bên dưới.
4. **Lấy cấu hình Web SDK**:
   - Vào **Project Settings** (biểu tượng bánh răng) > cuộn xuống mục **Your apps** > chọn biểu tượng Web `</>`.
   - Copy các giá trị trong biến `firebaseConfig` và dán vào file:
     `src/services/firebaseConfig.ts`.

### 3.2. Cấu trúc dữ liệu trong Realtime Database
```json
{
  "users": {
    "<uid>": {
      "uid": "string",
      "displayName": "string",
      "email": "string",
      "avatar": "url",
      "isOnline": true,
      "lastSeen": 1700000000000
    }
  },
  "chats": {
    "<chatId>": {
      "messages": {
        "<messageId>": {
          "id": "string",
          "senderId": "string",
          "senderName": "string",
          "receiverId": "string",
          "text": "string",
          "type": "text | location",
          "location": { "latitude": 21.02, "longitude": 105.85, "address": "string" },
          "createdAt": 1700000000000
        }
      }
    }
  },
  "userChats": {
    "<uid>": {
      "<otherUid>": {
        "chatId": "string",
        "otherUser": { "uid": "string", "displayName": "string", "avatar": "url" },
        "lastMessage": { "text": "string", "senderId": "string", "createdAt": 1700000000000 },
        "unreadCount": 0,
        "updatedAt": 1700000000000
      }
    }
  }
}
```

### 3.3. Security Rules (Luật bảo mật)
Dán luật này vào tab **Rules** của Realtime Database trên Firebase Console:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

*(Hoặc luật phân quyền chặt chẽ theo user):*
```json
{
  "rules": {
    "users": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null"
      }
    },
    "chats": {
      "$chatId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    },
    "userChats": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null"
      }
    }
  }
}
```

---

## 4. Hướng dẫn chạy ứng dụng

### 4.1. Cài đặt phụ thuộc
```bash
cd ThucHanh5
npm install
```

### 4.2. Khởi chạy Metro Bundler
```bash
npm start
```

### 4.3. Chạy trên thiết bị Android
```bash
npm run android
```

### 4.4. Kiểm thử Chat Realtime giữa 2 máy
1. Mở 2 máy ảo Android (hoặc 1 máy ảo + 1 máy thật).
2. Thiết bị 1: Đăng nhập tài khoản A (ví dụ: `an.nguyen@example.com` / `123456`).
3. Thiết bị 2: Đăng ký hoặc đăng nhập tài khoản B (ví dụ: `binh.tran@example.com` / `123456`).
4. Thiết bị 1 mở Danh bạ -> Thấy tài khoản B có chấm xanh Online -> Bấm vào để Chat.
5. Gửi tin nhắn từ Thiết bị 1 -> Thiết bị 2 nhận ngay lập tức mà không cần reload.
6. Thử bấm icon Ghim vị trí (📍) để gửi tin nhắn vị trí GPS.

---

## 5. Sản phẩm nộp bài theo yêu cầu
1. **Mã nguồn dự án**: Nằm trong thư mục `ThucHanh5/` (loại bỏ `node_modules`, `android/build`).
2. **Ảnh chụp các màn hình**:
   - `01_DangKy.png`: Màn hình Đăng ký tài khoản mới.
   - `02_Home_Unread.png`: Màn hình Home hiển thị danh sách hội thoại có badge số tin chưa đọc.
   - `03_DanhBa_Online.png`: Màn hình Danh bạ hiển thị trạng thái online/offline.
   - `04_Chat_Thuong_Va_ViTri.png`: Màn hình Chat 1-1 gồm tin nhắn văn bản và tin nhắn vị trí kèm bản đồ.
3. **Ảnh chụp Firebase Console**:
   - `05_Firebase_Data.png`: Tab Realtime Database -> Data hiển thị các node `/users`, `/chats`, `/userChats`.
4. **Video 1-2 phút**: Quay màn hình 2 máy ảo/thiết bị chat qua lại trực tiếp cho thấy tin nhắn hiện tức thì.
