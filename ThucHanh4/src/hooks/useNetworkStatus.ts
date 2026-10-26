import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export interface NetworkStatus {
  isOnline: boolean;
}

/**
 * Custom hook theo dõi trạng thái kết nối mạng
 * @returns { isOnline: boolean }
 */
export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // Lấy trạng thái mạng ban đầu
    NetInfo.fetch().then((state: NetInfoState) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsOnline(online);
    });

    // Lắng nghe sự kiện thay đổi mạng
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsOnline(online);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { isOnline };
}

export default useNetworkStatus;
