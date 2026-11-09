import { useState, useEffect, useCallback, useRef } from 'react';
import { getCache, setCache } from '../storage/cache';
import { ApiError } from '../api/client';

export interface CachedQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | Error | null;
  refreshing: boolean;
  lastUpdated: string | null;
  refresh: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

/**
 * Custom hook thực thi chiến lược "cache trước, mạng sau"
 * @param key Khóa cache AsyncStorage
 * @param fetcher Hàm async gọi API lấy dữ liệu mới nhất
 */
export function useCachedQuery<T>(
  key: string,
  fetcher: () => Promise<T>
): CachedQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | Error | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Giữ tham chiếu ổn định đến fetcher
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // Thực hiện tải dữ liệu
  const loadData = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setRefreshing(true);
      }

      let hasLocalCache = false;

      // 1. Đọc dữ liệu từ cache trước
      try {
        const cached = await getCache<T>(key);
        if (cached && cached.data !== null && cached.data !== undefined) {
          setData(cached.data);
          setLastUpdated(cached.savedAt);
          hasLocalCache = true;
          if (!isManualRefresh) {
            setLoading(false);
          }
        }
      } catch (cacheErr) {
        console.warn(`[useCachedQuery] Lỗi đọc cache (${key}):`, cacheErr);
      }

      // 2. Gọi API để cập nhật dữ liệu mới nhất nếu có mạng
      try {
        const remoteData = await fetcherRef.current();
        setData(remoteData);
        setError(null);
        const now = new Date().toISOString();
        setLastUpdated(now);
        await setCache(key, remoteData);
      } catch (apiErr: any) {
        console.warn(`[useCachedQuery] Lỗi fetch API (${key}):`, apiErr);
        // Nếu chưa có cache thì mới hiển thị màn hình lỗi toàn cục
        if (!hasLocalCache) {
          setError(apiErr);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [key]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = useCallback(async () => {
    await loadData(true);
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refreshing,
    lastUpdated,
    refresh,
    setData,
  };
}

export default useCachedQuery;
