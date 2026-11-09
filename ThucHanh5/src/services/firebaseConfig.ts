import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  Auth,
} from 'firebase/auth';
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * CẤU HÌNH FIREBASE CHO BÀI THỰC HÀNH 5
 * =====================================
 * Học viên / Giảng viên có thể dán thông tin Firebase Project của mình vào đây.
 * Các bước lấy config từ Firebase Console:
 * 1. Vào console.firebase.google.com -> Tạo project.
 * 2. Bật Authentication -> Sign-in method -> Email/Password -> Enable.
 * 3. Bật Realtime Database -> Create Database -> Chọn chế độ Test mode (hoặc nhập Security Rules).
 * 4. Project settings -> General -> Web apps -> Copy firebaseConfig dán vào dưới đây.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyB3hP9X_EXAMPLE_REPLACE_WITH_YOUR_KEY",
  authDomain: "thuchanh5-chat-realtime.firebaseapp.com",
  databaseURL: "https://thuchanh5-chat-realtime-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "thuchanh5-chat-realtime",
  storageBucket: "thuchanh5-chat-realtime.appspot.com",
  messagingSenderId: "109876543210",
  appId: "1:109876543210:web:abcdef1234567890abcdef",
};

export const isFirebaseConfigured = () => {
  return (
    Boolean(firebaseConfig.apiKey) &&
    !firebaseConfig.apiKey.includes('EXAMPLE') &&
    Boolean(firebaseConfig.databaseURL) &&
    !firebaseConfig.databaseURL.includes('EXAMPLE')
  );
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let authInstance: Auth;
try {
  if (typeof getReactNativePersistence === 'function') {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } else {
    authInstance = getAuth(app);
  }
} catch (e) {
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const database: Database = getDatabase(app);
