import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CacheEntry<T> {
  data: T;
  savedAt: string; // ISO 8601
}

/**
 * Lấy dữ liệu từ bộ nhớ đệm AsyncStorage
 * @param key Tên khóa cache
 */
export async function getCache<T>(key: string): Promise<CacheEntry<T> | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry<T>;
  } catch (err) {
    console.warn(`[getCache] Lỗi khi đọc cache với key: ${key}`, err);
    return null;
  }
}

/**
 * Lưu dữ liệu vào bộ nhớ đệm AsyncStorage kèm thời điểm lưu savedAt
 * @param key Tên khóa cache
 * @param data Dữ liệu cần lưu
 */
export async function setCache<T>(key: string, data: T): Promise<void> {
  try {
    const entry: CacheEntry<T> = {
      data,
      savedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch (err) {
    console.warn(`[setCache] Lỗi khi ghi cache với key: ${key}`, err);
  }
}

/**
 * Xóa cache theo key
 */
export async function removeCache(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.warn(`[removeCache] Lỗi khi xóa cache với key: ${key}`, err);
  }
}

export default {
  getCache,
  setCache,
  removeCache,
};
