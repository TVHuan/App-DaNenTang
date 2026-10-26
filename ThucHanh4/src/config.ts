import { Platform } from 'react-native';

/**
 * Global configuration settings for StudyManager
 */

// Máy ảo Android dùng 10.0.2.2 để trỏ về localhost máy tính host
const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const BASE_URL = DEFAULT_HOST;

// Timeout cho request API (bắt buộc 10 giây theo mục A1)
export const TIMEOUT = 10000;

// Cache Time To Live (5 phút)
export const CACHE_TTL = 5 * 60 * 1000;

export default {
  BASE_URL,
  TIMEOUT,
  CACHE_TTL,
};
