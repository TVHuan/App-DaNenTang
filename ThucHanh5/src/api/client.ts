import { BASE_URL, TIMEOUT } from '../config';

export type ApiErrorType = 'network' | 'timeout' | 'http';

export interface ApiError {
  type: ApiErrorType;
  status?: number;
  message: string;
}

/**
 * Hàm chung gọi REST API với timeout 10 giây, kiểm tra mã HTTP và chuẩn hóa lỗi
 * @param method 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
 * @param endpoint Ví dụ '/courses' hoặc '/students/1'
 * @param body Dữ liệu gửi lên (nếu có)
 */
export async function request<T = any>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  endpoint: string,
  body?: any
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const options: RequestInit = {
      method,
      headers,
      signal: controller.signal,
    };

    if (body !== undefined && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = `Yêu cầu thất bại với mã lỗi HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Body không phải JSON, giữ message mặc định
      }

      const httpError: ApiError = {
        type: 'http',
        status: response.status,
        message: errorMessage,
      };
      throw httpError;
    }

    // Nếu response rỗng (ví dụ 204 No Content)
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  } catch (error: any) {
    if (error && error.type && (error.type === 'http' || error.type === 'network' || error.type === 'timeout')) {
      throw error;
    }

    if (error?.name === 'AbortError') {
      const timeoutError: ApiError = {
        type: 'timeout',
        message: 'Yêu cầu hết thời gian chờ (quá 10 giây). Vui lòng thử lại.',
      };
      throw timeoutError;
    }

    const networkError: ApiError = {
      type: 'network',
      message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng hoặc khởi động json-server.',
    };
    throw networkError;
  } finally {
    clearTimeout(timeoutId);
  }
}

export default {
  request,
};
