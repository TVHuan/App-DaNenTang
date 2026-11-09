import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './keys';

export interface OutboxAction {
  id: string; // Unique action id
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  url: string; // Endpoint, e.g. '/assignments' or '/students/1'
  body: any;
  createdAt: string; // ISO 8601
}

/**
 * Lấy toàn bộ danh sách thao tác trong hàng đợi outbox (giữ đúng thứ tự thêm vào)
 */
export async function getAll(): Promise<OutboxAction[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.OUTBOX_QUEUE);
    if (!raw) return [];
    return JSON.parse(raw) as OutboxAction[];
  } catch (err) {
    console.warn('[outbox] Lỗi khi đọc outbox queue:', err);
    return [];
  }
}

/**
 * Thêm một thao tác mới vào cuối hàng đợi
 */
export async function enqueue(action: Omit<OutboxAction, 'id' | 'createdAt'> & { id?: string }): Promise<OutboxAction> {
  try {
    const queue = await getAll();
    const newAction: OutboxAction = {
      id: action.id || `act_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      method: action.method,
      url: action.url,
      body: action.body,
      createdAt: new Date().toISOString(),
    };
    
    queue.push(newAction);
    await AsyncStorage.setItem(STORAGE_KEYS.OUTBOX_QUEUE, JSON.stringify(queue));
    return newAction;
  } catch (err) {
    console.warn('[outbox] Lỗi khi thêm action vào outbox:', err);
    throw err;
  }
}

/**
 * Xóa một thao tác khỏi hàng đợi theo ID
 */
export async function remove(id: string): Promise<void> {
  try {
    const queue = await getAll();
    const filtered = queue.filter((act) => act.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.OUTBOX_QUEUE, JSON.stringify(filtered));
  } catch (err) {
    console.warn(`[outbox] Lỗi khi xóa action ${id} khỏi outbox:`, err);
  }
}

/**
 * Xóa toàn bộ hàng đợi
 */
export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.OUTBOX_QUEUE);
  } catch (err) {
    console.warn('[outbox] Lỗi khi clear outbox queue:', err);
  }
}

export default {
  getAll,
  enqueue,
  remove,
  clearAll,
};
