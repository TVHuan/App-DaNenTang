import {
  ref,
  push,
  set,
  onValue,
  off,
  update,
  get,
} from 'firebase/database';
import { database, isFirebaseConfigured } from './firebaseConfig';
import { ChatMessage, ChatConversation, LocationData, MessageType, UserProfile } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEMO_CHATS_PREFIX = '@th5_demo_chats_';
const DEMO_USER_CHATS_PREFIX = '@th5_demo_user_chats_';

/**
 * Sinh chatId duy nhất và chuẩn hóa từ 2 uid
 */
export function getChatId(uid1: string, uid2: string): string {
  return [uid1, uid2].sort().join('_');
}

/**
 * Gửi tin nhắn (tin nhắn văn bản hoặc tin nhắn vị trí)
 */
export async function sendMessage(
  sender: UserProfile,
  receiver: { uid: string; displayName: string; avatar?: string; email?: string },
  text: string,
  type: MessageType = 'text',
  location?: LocationData
): Promise<ChatMessage> {
  const content = text.trim();
  if (type === 'text' && !content) {
    throw new Error('Không được gửi tin nhắn rỗng');
  }

  const chatId = getChatId(sender.uid, receiver.uid);
  const now = Date.now();
  const displayMsgText = type === 'location' ? (location?.address || '📍 Vị trí bản đồ') : content;

  if (isFirebaseConfigured()) {
    const messagesRef = ref(database, `chats/${chatId}/messages`);
    const newMsgRef = push(messagesRef);
    const messageId = newMsgRef.key || `msg_${now}`;

    const newMsg: ChatMessage = {
      id: messageId,
      senderId: sender.uid,
      senderName: sender.displayName,
      receiverId: receiver.uid,
      text: displayMsgText,
      type,
      location: location || undefined,
      createdAt: now,
    };

    // 1. Lưu tin nhắn vào node chats
    await set(newMsgRef, newMsg);

    // 2. Cập nhật cuộc trò chuyện của người gửi (unreadCount = 0)
    const senderChatRef = ref(database, `userChats/${sender.uid}/${receiver.uid}`);
    await set(senderChatRef, {
      chatId,
      otherUser: {
        uid: receiver.uid,
        displayName: receiver.displayName,
        avatar: receiver.avatar || '',
        email: receiver.email || '',
      },
      lastMessage: {
        text: displayMsgText,
        senderId: sender.uid,
        createdAt: now,
        type,
      },
      unreadCount: 0,
      updatedAt: now,
    });

    // 3. Cập nhật cuộc trò chuyện của người nhận (tăng unreadCount)
    const receiverChatRef = ref(database, `userChats/${receiver.uid}/${sender.uid}`);
    const receiverSnapshot = await get(receiverChatRef);
    const currentUnread = receiverSnapshot.exists() ? (receiverSnapshot.val().unreadCount || 0) : 0;

    await set(receiverChatRef, {
      chatId,
      otherUser: {
        uid: sender.uid,
        displayName: sender.displayName,
        avatar: sender.avatar || '',
        email: sender.email || '',
      },
      lastMessage: {
        text: displayMsgText,
        senderId: sender.uid,
        createdAt: now,
        type,
      },
      unreadCount: currentUnread + 1,
      updatedAt: now,
    });

    return newMsg;
  }

  // Fallback demo cục bộ qua AsyncStorage
  const demoMsg: ChatMessage = {
    id: 'demo_msg_' + now,
    senderId: sender.uid,
    senderName: sender.displayName,
    receiverId: receiver.uid,
    text: displayMsgText,
    type,
    location,
    createdAt: now,
  };

  const msgsKey = DEMO_CHATS_PREFIX + chatId;
  const existingMsgsRaw = await AsyncStorage.getItem(msgsKey);
  const msgsList: ChatMessage[] = existingMsgsRaw ? JSON.parse(existingMsgsRaw) : [];
  msgsList.push(demoMsg);
  await AsyncStorage.setItem(msgsKey, JSON.stringify(msgsList));

  // Cập nhật recent chats cho sender
  const senderKey = DEMO_USER_CHATS_PREFIX + sender.uid;
  const senderRaw = await AsyncStorage.getItem(senderKey);
  const senderChats: Record<string, ChatConversation> = senderRaw ? JSON.parse(senderRaw) : {};
  senderChats[receiver.uid] = {
    chatId,
    otherUser: {
      uid: receiver.uid,
      displayName: receiver.displayName,
      avatar: receiver.avatar,
      email: receiver.email,
    },
    lastMessage: {
      text: displayMsgText,
      senderId: sender.uid,
      createdAt: now,
      type,
    },
    unreadCount: 0,
    updatedAt: now,
  };
  await AsyncStorage.setItem(senderKey, JSON.stringify(senderChats));

  // Cập nhật recent chats cho receiver
  const receiverKey = DEMO_USER_CHATS_PREFIX + receiver.uid;
  const receiverRaw = await AsyncStorage.getItem(receiverKey);
  const receiverChats: Record<string, ChatConversation> = receiverRaw ? JSON.parse(receiverRaw) : {};
  const prevUnread = receiverChats[sender.uid]?.unreadCount || 0;
  receiverChats[sender.uid] = {
    chatId,
    otherUser: {
      uid: sender.uid,
      displayName: sender.displayName,
      avatar: sender.avatar,
      email: sender.email,
    },
    lastMessage: {
      text: displayMsgText,
      senderId: sender.uid,
      createdAt: now,
      type,
    },
    unreadCount: prevUnread + 1,
    updatedAt: now,
  };
  await AsyncStorage.setItem(receiverKey, JSON.stringify(receiverChats));

  return demoMsg;
}

/**
 * Đặt số tin chưa đọc về 0 khi mở cuộc trò chuyện
 */
export async function markChatAsRead(userId: string, otherUserId: string): Promise<void> {
  if (!userId || !otherUserId) return;

  if (isFirebaseConfigured()) {
    try {
      const userChatRef = ref(database, `userChats/${userId}/${otherUserId}`);
      const snap = await get(userChatRef);
      if (snap.exists() && (snap.val().unreadCount || 0) > 0) {
        await update(userChatRef, { unreadCount: 0 });
      }
    } catch (err) {
      console.warn('Lỗi khi markChatAsRead:', err);
    }
    return;
  }

  // Demo fallback
  try {
    const key = DEMO_USER_CHATS_PREFIX + userId;
    const raw = await AsyncStorage.getItem(key);
    if (raw) {
      const chats = JSON.parse(raw);
      if (chats[otherUserId]) {
        chats[otherUserId].unreadCount = 0;
        await AsyncStorage.setItem(key, JSON.stringify(chats));
      }
    }
  } catch (err) {
    console.warn('Lỗi khi markChatAsRead demo:', err);
  }
}

/**
 * Lắng nghe tin nhắn của một cuộc trò chuyện theo thời gian thực
 * Cleanup function được trả về để hủy lắng nghe trong useEffect
 */
export function subscribeMessages(
  chatId: string,
  onUpdate: (messages: ChatMessage[]) => void
): () => void {
  if (isFirebaseConfigured()) {
    const messagesRef = ref(database, `chats/${chatId}/messages`);

    const unsubscribe = onValue(
      messagesRef,
      snapshot => {
        const data = snapshot.val();
        if (!data) {
          onUpdate([]);
          return;
        }

        const messagesList: ChatMessage[] = Object.keys(data).map(key => ({
          ...data[key],
          id: key,
        }));

        // Sắp xếp tin nhắn theo thời gian tăng dần
        messagesList.sort((a, b) => a.createdAt - b.createdAt);
        onUpdate(messagesList);
      },
      error => {
        console.warn('Lỗi khi lắng nghe messages:', error);
      }
    );

    // Hủy lắng nghe trong cleanup của useEffect
    return () => {
      off(messagesRef);
    };
  }

  // Fallback demo polling
  let timer: any = null;
  const loadDemoMsgs = async () => {
    const raw = await AsyncStorage.getItem(DEMO_CHATS_PREFIX + chatId);
    const list: ChatMessage[] = raw ? JSON.parse(raw) : [];
    list.sort((a, b) => a.createdAt - b.createdAt);
    onUpdate(list);
  };
  loadDemoMsgs();
  timer = setInterval(loadDemoMsgs, 1500);

  return () => {
    if (timer) clearInterval(timer);
  };
}

/**
 * Lắng nghe danh sách các cuộc trò chuyện gần đây (Home Screen)
 * Cuộc trò chuyện mới nhất nằm trên cùng
 */
export function subscribeUserChats(
  userId: string,
  onUpdate: (conversations: ChatConversation[]) => void
): () => void {
  if (!userId) {
    onUpdate([]);
    return () => {};
  }

  if (isFirebaseConfigured()) {
    const userChatsRef = ref(database, `userChats/${userId}`);

    const unsubscribe = onValue(
      userChatsRef,
      snapshot => {
        const data = snapshot.val();
        if (!data) {
          onUpdate([]);
          return;
        }

        const convList: ChatConversation[] = Object.keys(data).map(key => data[key]);
        // Cuộc trò chuyện mới nhất nằm trên cùng
        convList.sort((a, b) => b.updatedAt - a.updatedAt);
        onUpdate(convList);
      },
      error => {
        console.warn('Lỗi khi lắng nghe userChats:', error);
      }
    );

    // Hủy lắng nghe
    return () => {
      off(userChatsRef);
    };
  }

  // Fallback demo
  let timer: any = null;
  const loadDemoUserChats = async () => {
    const raw = await AsyncStorage.getItem(DEMO_USER_CHATS_PREFIX + userId);
    if (!raw) {
      onUpdate([]);
      return;
    }
    const map = JSON.parse(raw);
    const list: ChatConversation[] = Object.keys(map).map(k => map[k]);
    list.sort((a, b) => b.updatedAt - a.updatedAt);
    onUpdate(list);
  };
  loadDemoUserChats();
  timer = setInterval(loadDemoUserChats, 2000);

  return () => {
    if (timer) clearInterval(timer);
  };
}

