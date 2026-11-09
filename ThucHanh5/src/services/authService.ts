import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { ref, set, update } from 'firebase/database';
import { auth, database, isFirebaseConfigured } from './firebaseConfig';
import { UserProfile } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEMO_USER_KEY = '@th5_demo_current_user';
const DEMO_USERS_LIST_KEY = '@th5_demo_users_list';

/**
 * Danh sách người dùng mẫu mặc định để demo khi chưa cấu hình Firebase Key
 */
export const DEFAULT_DEMO_USERS: UserProfile[] = [
  {
    uid: 'demo_user_1',
    displayName: 'Nguyễn Văn An',
    email: 'an.nguyen@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    isOnline: true,
    lastSeen: Date.now(),
  },
  {
    uid: 'demo_user_2',
    displayName: 'Trần Thị Bình',
    email: 'binh.tran@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    isOnline: true,
    lastSeen: Date.now() - 5 * 60 * 1000,
  },
  {
    uid: 'demo_user_3',
    displayName: 'Lê Hoàng Long',
    email: 'long.le@example.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    isOnline: false,
    lastSeen: Date.now() - 3600 * 1000,
  },
];

/**
 * Đăng ký tài khoản mới bằng Email/Password
 */
export async function registerWithFirebase(
  displayName: string,
  email: string,
  password: string
): Promise<UserProfile> {
  const trimmedName = displayName.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName) throw new Error('Vui lòng nhập họ và tên');
  if (!trimmedEmail) throw new Error('Vui lòng nhập email');
  if (password.length < 6) throw new Error('Mật khẩu tối thiểu 6 ký tự');

  try {
    if (isFirebaseConfigured()) {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: trimmedName });

      const newUserProfile: UserProfile = {
        uid: firebaseUser.uid,
        displayName: trimmedName,
        email: trimmedEmail,
        avatar: `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(trimmedName)}`,
        isOnline: true,
        lastSeen: Date.now(),
        createdAt: Date.now(),
      };

      // Lưu thông tin người dùng vào Realtime Database tại /users/{uid}
      await set(ref(database, `users/${firebaseUser.uid}`), newUserProfile);
      return newUserProfile;
    }
  } catch (error: any) {
    console.warn('Firebase register error, checking fallback:', error.code || error.message);
    if (error.code && error.code !== 'auth/api-key-not-valid' && error.code !== 'auth/network-request-failed') {
      throw new Error(getFriendlyErrorMessage(error));
    }
  }

  // Chế độ mô phỏng / demo offline khi chưa có Firebase credentials
  const demoUid = 'user_' + Date.now().toString(36);
  const demoProfile: UserProfile = {
    uid: demoUid,
    displayName: trimmedName,
    email: trimmedEmail,
    avatar: `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(trimmedName)}`,
    isOnline: true,
    lastSeen: Date.now(),
    createdAt: Date.now(),
  };

  // Lưu demo user vào danh sách cục bộ
  const storedList = await AsyncStorage.getItem(DEMO_USERS_LIST_KEY);
  const usersList: UserProfile[] = storedList ? JSON.parse(storedList) : DEFAULT_DEMO_USERS;
  usersList.push(demoProfile);
  await AsyncStorage.setItem(DEMO_USERS_LIST_KEY, JSON.stringify(usersList));
  await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoProfile));

  return demoProfile;
}

/**
 * Đăng nhập bằng Email/Password
 */
export async function loginWithFirebase(
  email: string,
  password: string
): Promise<UserProfile> {
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail) throw new Error('Vui lòng nhập email');
  if (!password) throw new Error('Vui lòng nhập mật khẩu');

  try {
    if (isFirebaseConfigured()) {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      const firebaseUser = userCredential.user;

      // Cập nhật trạng thái online
      const now = Date.now();
      await update(ref(database, `users/${firebaseUser.uid}`), {
        isOnline: true,
        lastSeen: now,
      });

      const userProfile: UserProfile = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || trimmedEmail.split('@')[0],
        email: trimmedEmail,
        avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(firebaseUser.uid)}`,
        isOnline: true,
        lastSeen: now,
      };

      return userProfile;
    }
  } catch (error: any) {
    console.warn('Firebase login error:', error.code || error.message);
    if (error.code && error.code !== 'auth/api-key-not-valid' && error.code !== 'auth/network-request-failed') {
      throw new Error(getFriendlyErrorMessage(error));
    }
  }

  // Demo fallback
  const storedList = await AsyncStorage.getItem(DEMO_USERS_LIST_KEY);
  const usersList: UserProfile[] = storedList ? JSON.parse(storedList) : DEFAULT_DEMO_USERS;
  const found = usersList.find(u => u.email.toLowerCase() === trimmedEmail);

  if (found) {
    found.isOnline = true;
    found.lastSeen = Date.now();
    await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(found));
    return found;
  }

  // Nếu là demo và nhập bất kỳ email nào hợp lệ, tạo profile demo
  const fallbackUser: UserProfile = {
    uid: 'user_' + trimmedEmail.replace(/[^a-zA-Z0-9]/g, '_'),
    displayName: trimmedEmail.split('@')[0],
    email: trimmedEmail,
    avatar: `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(trimmedEmail)}`,
    isOnline: true,
    lastSeen: Date.now(),
  };
  await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(fallbackUser));
  return fallbackUser;
}

/**
 * Đăng xuất tài khoản
 */
export async function logoutFirebase(currentUid?: string): Promise<void> {
  try {
    if (currentUid && isFirebaseConfigured()) {
      // Cập nhật trạng thái offline trong database
      await update(ref(database, `users/${currentUid}`), {
        isOnline: false,
        lastSeen: Date.now(),
      });
    }
    await signOut(auth);
  } catch (err) {
    console.warn('Lỗi khi sign out Firebase:', err);
  }

  await AsyncStorage.removeItem(DEMO_USER_KEY);
}

/**
 * Chuyển mã lỗi Firebase Auth thành thông báo tiếng Việt thân thiện
 */
export function getFriendlyErrorMessage(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'Địa chỉ email không đúng định dạng.';
    case 'auth/user-disabled':
      return 'Tài khoản này đã bị khóa.';
    case 'auth/user-not-found':
      return 'Không tìm thấy tài khoản với email này.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Sai email hoặc mật khẩu. Vui lòng kiểm tra lại.';
    case 'auth/email-already-in-use':
      return 'Email này đã được đăng ký tài khoản khác.';
    case 'auth/weak-password':
      return 'Mật khẩu quá ngắn, vui lòng nhập tối thiểu 6 ký tự.';
    case 'auth/too-many-requests':
      return 'Quá nhiều lần thử không thành công. Vui lòng thử lại sau.';
    case 'auth/network-request-failed':
      return 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối Internet.';
    default:
      return error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.';
  }
}

