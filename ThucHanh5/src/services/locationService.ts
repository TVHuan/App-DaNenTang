import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { LocationData } from '../types';

/**
 * Yêu cầu quyền truy cập vị trí trên Android
 */
export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization();
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Quyền truy cập vị trí',
        message: 'Ứng dụng cần quyền truy cập vị trí để gửi tin nhắn vị trí hiện tại.',
        buttonNeutral: 'Hỏi lại sau',
        buttonNegative: 'Từ chối',
        buttonPositive: 'Đồng ý',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Lỗi xin quyền vị trí:', err);
    return false;
  }
}

/**
 * Lấy tọa độ vị trí hiện tại của thiết bị
 */
export function getCurrentLocation(): Promise<LocationData> {
  return new Promise(async (resolve, reject) => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      // Fallback vị trí mặc định nếu không có quyền để test trên máy ảo
      resolve({
        latitude: 21.0285,
        longitude: 105.8542,
        address: 'Hà Nội, Việt Nam (Mặc định)',
      });
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        resolve({
          latitude,
          longitude,
          address: `Vị trí: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
        });
      },
      error => {
        console.warn('Không lấy được GPS thực tế, dùng fallback:', error.message);
        // Fallback tọa độ mẫu (Hà Nội) cho máy ảo không có GPS vệ tinh
        resolve({
          latitude: 21.0285,
          longitude: 105.8542,
          address: 'Hà Nội, Việt Nam (GPS mô phỏng)',
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

