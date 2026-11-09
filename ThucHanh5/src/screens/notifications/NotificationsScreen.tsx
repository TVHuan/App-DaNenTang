import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

interface NotificationItem {
  id: string;
  type: 'message' | 'friend' | 'system' | 'like';
  title: string;
  timeAgo: string;
  avatar: string;
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'message',
    title: 'Trần Thị Bình đã gửi cho bạn một tin nhắn mới.',
    timeAgo: '5 phút trước',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    isRead: false,
  },
  {
    id: '2',
    type: 'friend',
    title: 'Lê Hoàng Long đã tham gia ứng dụng Realtime Chat.',
    timeAgo: '1 giờ trước',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    isRead: false,
  },
  {
    id: '3',
    type: 'system',
    title: 'Hệ thống Firebase Realtime Database đã đồng bộ kết nối an toàn.',
    timeAgo: 'Hôm qua',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    isRead: true,
  },
  {
    id: '4',
    type: 'like',
    title: 'Nguyễn Văn An đã thích tin nhắn chia sẻ vị trí của bạn.',
    timeAgo: '2 ngày trước',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    isRead: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));
  };

  const getTypeBadge = (type: NotificationItem['type']) => {
    switch (type) {
      case 'message':
        return { icon: '💬', bg: colors.primary };
      case 'friend':
        return { icon: '👥', bg: colors.secondary };
      case 'like':
        return { icon: '👍', bg: '#1877F2' };
      case 'system':
      default:
        return { icon: '🔔', bg: colors.accent };
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Thông báo</Text>
            <Text style={styles.headerSubtitle}>
              {unreadCount > 0 ? `${unreadCount} thông báo mới` : 'Tất cả đã đọc'}
            </Text>
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity style={styles.readAllBtn} onPress={markAllAsRead}>
              <Text style={styles.readAllText}>Đọc tất cả</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Gần đây</Text>
        </View>

        {notifications.map(item => {
          const badge = getTypeBadge(item.type);

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.notifItem, !item.isRead && styles.unreadItem]}
              onPress={() => markAsRead(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={[styles.typeBadge, { backgroundColor: badge.bg }]}>
                  <Text style={styles.typeBadgeIcon}>{badge.icon}</Text>
                </View>
              </View>

              <View style={styles.contentWrapper}>
                <Text style={[styles.titleText, !item.isRead && styles.unreadTitle]}>
                  {item.title}
                </Text>
                <Text style={styles.timeAgo}>{item.timeAgo}</Text>
              </View>

              {!item.isRead && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          );
        })}

        <View style={styles.footerSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h2,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  readAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
  },
  readAllText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  sectionTitleRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
  },
  notifItem: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  unreadItem: {
    backgroundColor: '#EFF6FF',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.border,
  },
  typeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  typeBadgeIcon: {
    fontSize: 10,
  },
  contentWrapper: {
    flex: 1,
    marginLeft: spacing.md,
    paddingRight: spacing.sm,
  },
  titleText: {
    ...typography.bodySmall,
    color: colors.text,
    lineHeight: 19,
  },
  unreadTitle: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
  timeAgo: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 4,
  },
  footerSpacing: {
    height: 30,
  },
});

