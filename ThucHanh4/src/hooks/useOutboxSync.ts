import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useNetworkStatus } from './useNetworkStatus';
import { getAll, remove, OutboxAction } from '../storage/outbox';
import { request } from '../api/client';

export interface OutboxSyncState {
  pendingCount: number;
  syncing: boolean;
  syncNow: () => Promise<number>;
}

/**
 * Custom hook tự động đồng bộ hàng đợi offline khi có mạng lại và xử lý xung đột
 */
export function useOutboxSync(onSyncedCallback?: () => void): OutboxSyncState {
  const { isOnline } = useNetworkStatus();
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [syncing, setSyncing] = useState<boolean>(false);

  // Lưu trạng thái online trước đó để bắt sự kiện chuyển đổi offline -> online
  const prevOnlineRef = useRef<boolean>(isOnline);
  const syncingRef = useRef<boolean>(false);

  // Đếm số lượng thay đổi chưa đồng bộ
  const refreshPendingCount = useCallback(async () => {
    try {
      const queue = await getAll();
      setPendingCount(queue.length);
      return queue.length;
    } catch {
      return 0;
    }
  }, []);

  useEffect(() => {
    refreshPendingCount();
  }, [refreshPendingCount]);

  /**
   * Đồng bộ hàng đợi outbox lên server
   */
  const syncNow = useCallback(async (): Promise<number> => {
    if (syncingRef.current) return 0;
    syncingRef.current = true;
    setSyncing(true);

    let successCount = 0;
    let conflictCount = 0;

    try {
      const queue = await getAll();
      if (queue.length === 0) {
        setPendingCount(0);
        return 0;
      }

      for (const action of queue) {
        try {
          // B5. Xử lý xung đột: So sánh trường updatedAt nếu là thao tác cập nhật (PATCH/PUT)
          let hasConflict = false;
          if ((action.method === 'PATCH' || action.method === 'PUT') && action.body?.updatedAt) {
            try {
              const serverItem = await request<any>('GET', action.url);
              if (serverItem && serverItem.updatedAt) {
                const serverTime = new Date(serverItem.updatedAt).getTime();
                const offlineActionTime = new Date(action.body.updatedAt).getTime();

                // Nếu dữ liệu trên server mới hơn thao tác offline
                if (serverTime > offlineActionTime) {
                  hasConflict = true;
                  conflictCount++;
                  console.warn(
                    `[useOutboxSync] Xung đột tại ${action.url}: Server (${serverItem.updatedAt}) mới hơn Local (${action.body.updatedAt}). Ưu tiên server.`
                  );
                }
              }
            } catch {
              // Bỏ qua lỗi check conflict nếu GET thất bại
            }
          }

          if (hasConflict) {
            // Server mới hơn -> ưu tiên dữ liệu server, xóa action khỏi outbox
            await remove(action.id);
            continue;
          }

          // Gửi request lên server
          await request(action.method, action.url, action.body);
          await remove(action.id);
          successCount++;
        } catch (err) {
          console.warn(`[useOutboxSync] Lỗi khi thực thi action ${action.id}:`, err);
          // Gặp lỗi thì giữ lại để thử lại sau (không remove)
          break;
        }
      }

      await refreshPendingCount();

      // Thông báo cho người dùng
      if (conflictCount > 0) {
        Alert.alert(
          'Xung đột dữ liệu',
          `Phát hiện ${conflictCount} thay đổi có dữ liệu server mới hơn. Hệ thống đã ưu tiên giữ dữ liệu mới nhất từ server.`
        );
      }

      if (successCount > 0) {
        Alert.alert('Đồng bộ thành công', `Đã đồng bộ ${successCount} thay đổi lên máy chủ.`);
      }

      if (onSyncedCallback && (successCount > 0 || conflictCount > 0)) {
        onSyncedCallback();
      }

      return successCount;
    } catch (err) {
      console.warn('[useOutboxSync] Lỗi tổng thể khi đồng bộ:', err);
      return successCount;
    } finally {
      syncingRef.current = false;
      setSyncing(false);
    }
  }, [refreshPendingCount, onSyncedCallback]);

  // Tự động đồng bộ khi chuyển từ offline -> online
  useEffect(() => {
    if (!prevOnlineRef.current && isOnline) {
      syncNow();
    }
    prevOnlineRef.current = isOnline;
  }, [isOnline, syncNow]);

  // Tự động đồng bộ khi khởi động nếu đã online và còn hàng đợi
  useEffect(() => {
    if (isOnline && pendingCount > 0 && !syncingRef.current) {
      syncNow();
    }
  }, [isOnline, pendingCount, syncNow]);

  return {
    pendingCount,
    syncing,
    syncNow,
  };
}

export default useOutboxSync;
