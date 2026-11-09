import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, database, isFirebaseConfigured } from '../services/firebaseConfig';
import {
  loginWithFirebase,
  registerWithFirebase,
  logoutFirebase,
} from '../services/authService';
import { setupPresenceTracking } from '../services/userService';
import { UserProfile } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEMO_USER_KEY = '@th5_demo_current_user';

interface AuthContextType {
  currentUser: UserProfile | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Khôi phục phiên đăng nhập khi mở app
  useEffect(() => {
    let unsubscribePresence: (() => void) | null = null;

    if (isFirebaseConfigured()) {
      const unsubscribeAuth = onAuthStateChanged(auth, async firebaseUser => {
        if (firebaseUser) {
          try {
            // Lấy thông tin chi tiết từ Realtime Database /users/{uid}
            const snap = await get(ref(database, `users/${firebaseUser.uid}`));
            if (snap.exists()) {
              const profile = snap.val() as UserProfile;
              setCurrentUser({ ...profile, uid: firebaseUser.uid });
            } else {
              setCurrentUser({
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName || 'Người dùng',
                email: firebaseUser.email || '',
                isOnline: true,
                lastSeen: Date.now(),
              });
            }

            // Thiết lập theo dõi Online/Offline Realtime
            if (unsubscribePresence) unsubscribePresence();
            unsubscribePresence = setupPresenceTracking(firebaseUser.uid);
          } catch (err) {
            console.warn('Lỗi khi tải user profile:', err);
          }
        } else {
          setCurrentUser(null);
          if (unsubscribePresence) {
            unsubscribePresence();
            unsubscribePresence = null;
          }
        }
        setIsLoading(false);
      });

      return () => {
        unsubscribeAuth();
        if (unsubscribePresence) unsubscribePresence();
      };
    } else {
      // Khôi phục phiên đăng nhập demo
      const restoreDemo = async () => {
        try {
          const raw = await AsyncStorage.getItem(DEMO_USER_KEY);
          if (raw) {
            const user = JSON.parse(raw);
            setCurrentUser(user);
          }
        } catch (e) {
          console.warn('Lỗi khi khôi phục demo user:', e);
        } finally {
          setIsLoading(false);
        }
      };
      restoreDemo();
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const user = await loginWithFirebase(email, pass);
    setCurrentUser(user);
    if (user?.uid && isFirebaseConfigured()) {
      setupPresenceTracking(user.uid);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    const user = await registerWithFirebase(name, email, pass);
    setCurrentUser(user);
    if (user?.uid && isFirebaseConfigured()) {
      setupPresenceTracking(user.uid);
    }
  };

  const logout = async () => {
    const uid = currentUser?.uid;
    await logoutFirebase(uid);
    setCurrentUser(null);
  };

  const refreshProfile = async () => {
    if (currentUser?.uid && isFirebaseConfigured()) {
      const snap = await get(ref(database, `users/${currentUser.uid}`));
      if (snap.exists()) {
        setCurrentUser({ ...snap.val(), uid: currentUser.uid });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

