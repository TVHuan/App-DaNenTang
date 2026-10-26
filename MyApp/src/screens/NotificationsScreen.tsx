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
import { MOCK_NOTIFICATIONS, NotificationItem } from '../data/mockData';

export const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const getTypeBadge = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return { icon: '👍', bg: '#1877F2' };
      case 'comment':
        return { icon: '💬', bg: '#2ECC71' };
      case 'friend':
        return { icon: '👥', bg: '#3498DB' };
      case 'group':
        return { icon: '🌐', bg: '#9B59B6' };
      default:
        return { icon: '🔔', bg: '#F1C40F' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Thông báo</Text>
          <TouchableOpacity style={styles.searchBtn}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Trước đó</Text>
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
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#050505',
  },
  searchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 16,
  },
  sectionTitleRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#050505',
  },
  notifItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  unreadItem: {
    backgroundColor: '#E7F3FF',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E4E6EB',
  },
  typeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  typeBadgeIcon: {
    fontSize: 11,
  },
  contentWrapper: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 8,
  },
  titleText: {
    fontSize: 14,
    color: '#050505',
    lineHeight: 19,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  timeAgo: {
    fontSize: 12,
    color: '#65676B',
    marginTop: 4,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1877F2',
    marginLeft: 4,
  },
  footerSpacing: {
    height: 30,
  },
});
