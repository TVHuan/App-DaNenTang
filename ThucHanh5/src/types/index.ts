export type MessageType = 'text' | 'location';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: number;
  createdAt?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  type: MessageType;
  location?: LocationData;
  createdAt: number;
}

export interface ChatConversation {
  chatId: string;
  otherUser: {
    uid: string;
    displayName: string;
    email?: string;
    avatar?: string;
    isOnline?: boolean;
    lastSeen?: number;
  };
  lastMessage: {
    text: string;
    senderId: string;
    createdAt: number;
    type: MessageType;
  };
  unreadCount: number;
  updatedAt: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timeAgo: string;
  timestamp: number;
  isRead: boolean;
  type: 'message' | 'user' | 'system';
  avatar?: string;
}
