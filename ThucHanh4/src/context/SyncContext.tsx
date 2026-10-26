import React, { createContext, useContext, ReactNode } from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useOutboxSync } from '../hooks/useOutboxSync';

export interface SyncContextType {
  isOnline: boolean;
  pendingCount: number;
  syncing: boolean;
  syncNow: () => Promise<number>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export interface SyncProviderProps {
  children: ReactNode;
  onSynced?: () => void;
}

export const SyncProvider: React.FC<SyncProviderProps> = ({ children, onSynced }) => {
  const { isOnline } = useNetworkStatus();
  const { pendingCount, syncing, syncNow } = useOutboxSync(onSynced);

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        pendingCount,
        syncing,
        syncNow,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = (): SyncContextType => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync phải được sử dụng bên trong SyncProvider');
  }
  return context;
};

export default SyncContext;
