import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  LogOut,
  Shield,
  Database,
  Smartphone,
  Info,
  CheckCircle2,
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { firebaseConfig, isFirebaseConfigured } from '../../services/firebaseConfig';
import UserAvatar from '../../components/common/UserAvatar';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function SettingsScreen() {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // AuthContext cập nhật currentUser = null -> RootNavigator tự chuyển về LoginScreen
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cài đặt</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <UserAvatar
            name={currentUser?.displayName || 'User'}
            avatarUri={currentUser?.avatar}
            size="lg"
            isOnline={true}
            showStatus={true}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {currentUser?.displayName || 'Người dùng'}
            </Text>
            <Text style={styles.profileEmail}>{currentUser?.email}</Text>
            <View style={styles.onlineStatusRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Đang kết nối Realtime</Text>
            </View>
          </View>
        </View>

        {/* System & Firebase Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin hệ thống</Text>

          <View style={styles.itemRow}>
            <View style={styles.itemIconBg}>
              <Database size={20} color={colors.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Firebase Project</Text>
              <Text style={styles.itemValue}>{firebaseConfig.projectId}</Text>
            </View>
            {isFirebaseConfigured() ? (
              <CheckCircle2 size={20} color={colors.success} />
            ) : (
              <Text style={styles.demoBadge}>Chế độ Demo</Text>
            )}
          </View>

          <View style={styles.itemRow}>
            <View style={styles.itemIconBg}>
              <Shield size={20} color={colors.secondary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Bảo mật Realtime Database</Text>
              <Text style={styles.itemValue}>Auth rules: auth != null</Text>
            </View>
          </View>

          <View style={styles.itemRow}>
            <View style={styles.itemIconBg}>
              <Smartphone size={20} color={colors.accent} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Nền tảng</Text>
              <Text style={styles.itemValue}>React Native CLI (Native JS SDK)</Text>
            </View>
          </View>
        </View>

        {/* About App */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Về ứng dụng</Text>

          <View style={styles.itemRow}>
            <View style={styles.itemIconBg}>
              <Info size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Phiên bản</Text>
              <Text style={styles.itemValue}>Bài thực hành 5 - v1.0.0</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h2,
    fontWeight: '800',
    color: colors.text,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  profileInfo: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  profileName: {
    ...typography.h3,
    fontWeight: '700',
    color: colors.text,
  },
  profileEmail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  onlineStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  onlineText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '600',
  },
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
  },
  itemIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  itemValue: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  demoBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
    backgroundColor: colors.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.dangerLight,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.danger,
  },
  bottomSpacer: {
    height: 40,
  },
});

