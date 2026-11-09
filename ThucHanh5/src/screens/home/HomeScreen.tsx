import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search, MessageSquare, Plus } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { subscribeUserChats, markChatAsRead } from '../../services/chatService';
import { ChatConversation } from '../../types';
import { RootStackParamList, ROUTES } from '../../navigation/routes';
import UserAvatar from '../../components/common/UserAvatar';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { formatTime } from '../../utils/date';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { currentUser } = useAuth();

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) return;

    setLoading(true);
    // Lắng nghe danh sách cuộc trò chuyện realtime
    const unsubscribe = subscribeUserChats(currentUser.uid, chatList => {
      setConversations(chatList);
      setLoading(false);
    });

    // Cleanup listener khi unmount để không bị hiện lặp hoặc memory leak
    return () => {
      unsubscribe();
    };
  }, [currentUser?.uid]);

  const handleOpenChat = async (conv: ChatConversation) => {
    if (!currentUser?.uid) return;

    // Đặt số tin chưa đọc về 0 khi mở cuộc trò chuyện
    await markChatAsRead(currentUser.uid, conv.otherUser.uid);

    navigation.navigate(ROUTES.CHAT, {
      receiverId: conv.otherUser.uid,
      receiverName: conv.otherUser.displayName,
      receiverAvatar: conv.otherUser.avatar,
      receiverEmail: conv.otherUser.email,
    });
  };

  const filteredConversations = conversations.filter(c =>
    c.otherUser.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatConversationTime = (timestamp: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return formatTime(date);
    }
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${d}/${m}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <UserAvatar
              name={currentUser?.displayName || 'User'}
              avatarUri={currentUser?.avatar}
              size="md"
              isOnline={true}
              showStatus={true}
            />
            <View style={styles.headerTextWrap}>
              <Text style={styles.greeting}>Xin chào,</Text>
              <Text style={styles.userName} numberOfLines={1}>
                {currentUser?.displayName || 'Người dùng'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.newChatBtn}
            onPress={() => (navigation as any).navigate(ROUTES.CONTACTS_TAB)}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm cuộc trò chuyện..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Conversations List */}
        <FlatList
          data={filteredConversations}
          keyExtractor={item => item.chatId}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const hasUnread = item.unreadCount > 0;
            const isSelf = item.lastMessage.senderId === currentUser?.uid;

            return (
              <TouchableOpacity
                style={[styles.convItem, hasUnread && styles.convItemUnread]}
                onPress={() => handleOpenChat(item)}
                activeOpacity={0.7}
              >
                <UserAvatar
                  name={item.otherUser.displayName}
                  avatarUri={item.otherUser.avatar}
                  size="md"
                  isOnline={item.otherUser.isOnline}
                  showStatus={true}
                />

                <View style={styles.convContent}>
                  <View style={styles.convHeader}>
                    <Text
                      style={[styles.convName, hasUnread && styles.convNameUnread]}
                      numberOfLines={1}
                    >
                      {item.otherUser.displayName}
                    </Text>
                    <Text
                      style={[styles.convTime, hasUnread && styles.convTimeUnread]}
                    >
                      {formatConversationTime(item.updatedAt)}
                    </Text>
                  </View>

                  <View style={styles.convBottom}>
                    <Text
                      style={[styles.convLastMsg, hasUnread && styles.convLastMsgUnread]}
                      numberOfLines={1}
                    >
                      {isSelf ? 'Bạn: ' : ''}
                      {item.lastMessage.type === 'location'
                        ? '📍 ' + item.lastMessage.text
                        : item.lastMessage.text}
                    </Text>

                    {hasUnread && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadCountText}>
                          {item.unreadCount > 99 ? '99+' : item.unreadCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <MessageSquare size={36} color={colors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>Chưa có cuộc trò chuyện nào</Text>
              <Text style={styles.emptySubtitle}>
                Vào danh bạ để tìm bạn bè và bắt đầu gửi tin nhắn ngay!
              </Text>
              <TouchableOpacity
                style={styles.goToContactsBtn}
                onPress={() => (navigation as any).navigate(ROUTES.CONTACTS_TAB)}
              >
                <Text style={styles.goToContactsText}>Xem danh bạ</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTextWrap: {
    marginLeft: spacing.sm + 4,
    flex: 1,
  },
  greeting: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  userName: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },
  newChatBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    ...typography.body,
    color: colors.text,
  },
  listContent: {
    paddingVertical: spacing.sm,
  },
  convItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  convItemUnread: {
    backgroundColor: '#F0F7FF',
  },
  convContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  convHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  convName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  convNameUnread: {
    fontWeight: '800',
    color: colors.primaryDark,
  },
  convTime: {
    ...typography.caption,
    color: colors.textMuted,
  },
  convTimeUnread: {
    color: colors.primary,
    fontWeight: '700',
  },
  convBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  convLastMsg: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
    marginRight: spacing.sm,
  },
  convLastMsgUnread: {
    color: colors.text,
    fontWeight: '700',
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 80,
  },
  emptyIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  goToContactsBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 4,
    borderRadius: 10,
  },
  goToContactsText: {
    color: '#FFFFFF',
    fontWeight: '700',
    ...typography.bodySmall,
  },
});
