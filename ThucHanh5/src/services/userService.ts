import {
  ref,
  onValue,
  off,
  set,
  update,
  onDisconnect,
  serverTimestamp,
} from 'firebase/database';
import { database, isFirebaseConfigured } from './firebaseConfig';
import { UserProfile } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_DEMO_USERS } from './authService';

const DEMO_USERS_LIST_KEY = '@th5_demo_users_list';

/**
 * Thiết lập cơ chế theo dõi Online / Offline tự động qua .info/connected
 */
export function setupPresenceTracking(userId: string): () => void {
  if (!isFirebaseConfigured() || !userId) {
    return () => {};
  }

  const connectedRef = ref(database, '.info/connected');
  const userStatusRef = ref(database, `users/${userId}/isOnline`);
  const lastSeenRef = ref(database, `users/${userId}/lastSeen`);

  const unsubscribe = onValue(connectedRef, snapshot => {
    if (snapshot.val() === true) {
      // Khi ngắt kết nối (tắt app, mất mạng), Firebase tự động đặt offline và ghi nhận thời gian
      onDisconnect(userStatusRef).set(false);
      onDisconnect(lastSeenRef).set(serverTimestamp());

      // Khi đang kết nối, đánh dấu online
      set(userStatusRef, true);
      set(lastSeenRef, Date.now());
    }
  });

  return () => {
    off(connectedRef);
    // Khi component unmount hoặc đăng xuất
    update(ref(database, `users/${userId}`), {
      isOnline: false,
      lastSeen: Date.now(),
    }).catch(() => {});
  };
}

/**
 * Lắng nghe danh sách người dùng realtime từ /users
 * Loại trừ người dùng hiện tại (currentUserId)
 */
export function subscribeUsers(
  currentUserId: string,
  onUpdate: (users: UserProfile[]) => void
): () => void {
  if (isFirebaseConfigured()) {
    const usersRef = ref(database, 'users');

    const unsubscribe = onValue(
      usersRef,
      snapshot => {
        const data = snapshot.val();
        if (!data) {
          onUpdate([]);
          return;
        }

        const userList: UserProfile[] = Object.keys(data)
          .map(key => ({
            ...data[key],
            uid: key,
          }))
          .filter(user => user.uid !== currentUserId);

        onUpdate(userList);
      },
      error => {
        console.warn('Lỗi khi lắng nghe danh sách users:', error);
      }
    );

    return () => {
      off(usersRef);
    };
  }

  // Chế độ mô phỏng offline demo
  let timer: any = null;
  const loadDemo = async () => {
    const stored = await AsyncStorage.getItem(DEMO_USERS_LIST_KEY);
    const list: UserProfile[] = stored ? JSON.parse(stored) : DEFAULT_DEMO_USERS;
    onUpdate(list.filter(u => u.uid !== currentUserId));
  };
  loadDemo();

  // Polling nhẹ mô phỏng cập nhật realtime cho demo
  timer = setInterval(loadDemo, 3000);

  return () => {
    if (timer) clearInterval(timer);
  };
}

/**
 * Lắng nghe thông tin và trạng thái online/offline của một người dùng cụ thể
 */
export function subscribeUserProfile(
  userId: string,
  onUpdate: (user: UserProfile | null) => void
): () => void {
  if (!userId) {
    onUpdate(null);
    return () => {};
  }

  if (isFirebaseConfigured()) {
    const userRef = ref(database, `users/${userId}`);

    const unsubscribe = onValue(
      userRef,
      snapshot => {
        const val = snapshot.val();
        if (val) {
          onUpdate({ ...val, uid: userId });
        } else {
          onUpdate(null);
        }
      },
      error => {
        console.warn(`Lỗi khi lắng nghe user ${userId}:`, error);
      }
    );

    return () => {
      off(userRef);
    };
  }

  // Fallback demo
  const fetchDemo = async () => {
    const stored = await AsyncStorage.getItem(DEMO_USERS_LIST_KEY);
    const list: UserProfile[] = stored ? JSON.parse(stored) : DEFAULT_DEMO_USERS;
    const found = list.find(u => u.uid === userId);
    onUpdate(found || null);
  };
  fetchDemo();

  return () => {};
}

