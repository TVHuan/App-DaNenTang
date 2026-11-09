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
import { Search, Users, MessageCircle } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { subscribeUsers } from '../../services/userService';
import { UserProfile } from '../../types';
import { RootStackParamList, ROUTES } from '../../navigation/routes';
import UserAvatar from '../../components/common/UserAvatar';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { formatTime } from '../../utils/date';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ContactsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { currentUser } = useAuth();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) return;

    setLoading(true);
    // Lắng nghe danh sách người dùng realtime từ Firebase /users
    const unsubscribe = subscribeUsers(currentUser.uid, userList => {
      setUsers(userList);
      setLoading(false);
    });

    // Cleanup khi component unmount
    return () => {
      unsubscribe();
    };
  }, [currentUser?.uid]);

  const handleSelectUser = (targetUser: UserProfile) => {
    navigation.navigate(ROUTES.CHAT, {
      receiverId: targetUser.uid,
      receiverName: targetUser.displayName,
      receiverAvatar: targetUser.avatar,
      receiverEmail: targetUser.email,
    });
  };

  const filteredUsers = users.filter(
    u =>
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStatus = (user: UserProfile) => {
    if (user.isOnline) {
      return (
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, styles.dotOnline]} />
          <Text style={styles.statusOnlineText}>Đang hoạt động</Text>
        </View>
      );
    }

    const lastSeenText = user.lastSeen
      ? `Hoạt động lúc ${formatTime(new Date(user.lastSeen))}`
      : 'Không hoạt động';

    return (
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, styles.dotOffline]} />
        <Text style={styles.statusOfflineText}>{lastSeenText}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Danh bạ người dùng</Text>
          <Text style={styles.headerSubtitle}>
            {users.length} người dùng đã đăng ký
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên hoặc email..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Users List */}
        <FlatList
          data={filteredUsers}
          keyExtractor={item => item.uid}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userCard}
              onPress={() => handleSelectUser(item)}
              activeOpacity={0.7}
            >
              <UserAvatar
                name={item.displayName}
                avatarUri={item.avatar}
                size="md"
                isOnline={item.isOnline}
                showStatus={true}
              />

              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.displayName}</Text>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {item.email}
                </Text>
                {renderStatus(item)}
              </View>

              <TouchableOpacity
                style={styles.chatActionBtn}
                onPress={() => handleSelectUser(item)}
              >
                <MessageCircle size={20} color={colors.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <Users size={36} color={colors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>Không tìm thấy người dùng</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? 'Thử tìm với từ khóa khác'
                  : 'Chưa có người dùng nào khác đăng ký.'}
              </Text>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '800',
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userName: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  userEmail: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  dotOnline: {
    backgroundColor: colors.success,
  },
  dotOffline: {
    backgroundColor: colors.textMuted,
  },
  statusOnlineText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '600',
  },
  statusOfflineText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  chatActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
});

