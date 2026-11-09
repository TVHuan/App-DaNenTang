# BÀI THỰC HÀNH 5: CHAT 1-1 REALTIME VỚI FIREBASE

## 1. Yêu cầu chức năng

### 1.1. Đăng ký / Đăng nhập
- Tạo project Firebase, bật Authentication (Email/Password) và Realtime Database, áp dụng luật bảo mật được cung cấp.
- Màn hình Đăng ký:
  - Họ tên, email, mật khẩu (tối thiểu 6 ký tự) và nhập lại mật khẩu.
  - Kiểm tra mật khẩu trùng khớp, định dạng email, độ dài mật khẩu.
  - Lưu thông tin người dùng vào Firebase Realtime Database tại `/users/{uid}`.
- Màn hình Đăng nhập:
  - Đăng nhập bằng Firebase Authentication (`signInWithEmailAndPassword`).
  - Khi sai tài khoản hoặc mật khẩu thì hiển thị thông báo lỗi thân thiện.
- Màn hình Cài đặt:
  - Nút Đăng xuất (`signOut`) -> cập nhật trạng thái offline -> quay về màn hình Đăng nhập.

### 1.2. Danh bạ (Contacts)
- Lấy danh sách người dùng đã đăng ký từ Firebase (`/users`), loại trừ bản thân (`uid !== currentUser.uid`).
- Hiển thị trạng thái online/offline cập nhật theo thời gian thực (realtime listener).
- Có ô tìm kiếm theo tên hoặc email.
- Nhấn vào một người để mở màn hình Chat.

### 1.3. Chat 1-1
- Gửi và nhận tin nhắn ngay lập tức, không cần tải lại màn hình.
- Tin của mình nằm bên phải (bong bóng xanh), tin của đối phương nằm bên trái (bong bóng xám), mỗi tin có nhãn thời gian (giờ:phút).
- Không cho gửi tin rỗng (nút gửi disable hoặc validate khi trống).
- Danh sách tự cuộn xuống tin mới nhất khi có tin mới hoặc khi mở màn hình.
- Thanh tiêu đề hiển thị tên, avatar và trạng thái online/offline của người đang chat.
- Hỗ trợ gửi tin vị trí hiện tại (sử dụng `@react-native-community/geolocation`), hiển thị tọa độ bản đồ và nút mở Google Maps.

### 1.4. Màn hình Home (Cuộc trò chuyện gần đây)
- Hiển thị các cuộc trò chuyện đã có của người dùng, gồm ảnh đại diện, tên, tin nhắn cuối cùng và thời gian.
- Cuộc trò chuyện mới nhất nằm trên cùng (sắp xếp theo `updatedAt` giảm dần).
- Số tin chưa đọc tăng ngay khi có tin mới gửi đến, và tự động về 0 khi người dùng mở cuộc trò chuyện đó.

### 1.5. Màn hình Thông báo (Notifications)
- Giữ giao diện và tính năng Thông báo như Bài 4 (danh sách thông báo, badge loại thông báo, thời gian, đánh dấu đã đọc khi chạm vào).

---

## 2. Yêu cầu kỹ thuật
- **Framework**: React Native CLI (không dùng Expo), React Navigation.
- **Firebase**: Firebase JS SDK (`firebase/app`, `firebase/auth`, `firebase/database`).
- **Persistence**: `@react-native-async-storage/async-storage` cho Auth state persistence (`getReactNativePersistence`).
- **Geolocation**: `@react-native-community/geolocation` cho chia sẻ vị trí.
- **Cấu trúc mã nguồn**: Gom toàn bộ logic Firebase vào thư mục `src/services/`:
  - `src/services/firebaseConfig.ts`: Cấu hình Firebase App, Auth, Realtime Database.
  - `src/services/authService.ts`: Đăng nhập, đăng ký, đăng xuất, lắng nghe trạng thái đăng nhập.
  - `src/services/userService.ts`: Danh sách người dùng, tìm kiếm, quản lý presence (online/offline).
  - `src/services/chatService.ts`: Gửi/nhận tin nhắn realtime, cập nhật danh sách cuộc trò chuyện, unread count.
  - `src/services/locationService.ts`: Lấy tọa độ GPS hiện tại.
- **Cleanup listener**: Toàn bộ `onValue`, `onAuthStateChanged` đều được hủy (`unsubscribe` / `off()`) trong cleanup return của `useEffect` để tránh memory leak và không bị tin nhắn hiện lặp.

---

## 3. Cấu trúc Firebase Realtime Database & Luật bảo mật

### Cấu trúc dữ liệu
```
/users/{uid}
  - uid: string
  - displayName: string
  - email: string
  - avatar: string
  - isOnline: boolean
  - lastSeen: number (timestamp)

/chats/{chatId}/messages/{messageId}
  - id: string
  - senderId: string
  - senderName: string
  - receiverId: string
  - text: string
  - type: "text" | "location"
  - location: { latitude: number, longitude: number, address?: string }
  - createdAt: number (timestamp)

/userChats/{uid}/{otherUid}
  - chatId: string
  - otherUser: { uid, displayName, email, avatar, isOnline }
  - lastMessage: { text, senderId, createdAt, type }
  - unreadCount: number
  - updatedAt: number
```

### Firebase Realtime Database Security Rules
```json
{
  "rules": {
    "users": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null"
      }
    },
    "userChats": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null"
      }
    },
    "chats": {
      "$chatId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```
*(Đối với môi trường kiểm thử/thực hành có thể sử dụng `.read: "auth != null"`, `.write: "auth != null"` cho toàn bộ root).*

---

## 4. Hướng dẫn nộp bài
1. Mã nguồn dự án (không kèm node_modules, android/build, ios/Pods).
2. Ảnh chụp các màn hình:
   - Đăng ký tài khoản
   - Home có số tin chưa đọc
   - Danh bạ có trạng thái online/offline
   - Chat có tin thường và tin vị trí
3. Ảnh chụp Firebase Console (tab Realtime Database Data) cho thấy dữ liệu tin nhắn.
4. Video 1–2 phút quay 2 máy ảo hoặc 2 thiết bị chat với nhau, cho thấy tin nhắn hiển thị ngay lập tức.

