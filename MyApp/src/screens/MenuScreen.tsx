import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { CURRENT_USER } from '../data/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ShortcutItem {
  id: string;
  title: string;
  icon: string;
  subtitle?: string;
}

const SHORTCUTS: ShortcutItem[] = [
  { id: '1', title: 'Kỷ niệm', icon: '⏰', subtitle: 'Xem lại các bài viết xưa' },
  { id: '2', title: 'Đã lưu', icon: '🔖', subtitle: '12 mục chưa đọc' },
  { id: '3', title: 'Nhóm', icon: '👥', subtitle: '5 bài viết mới' },
  { id: '4', title: 'Video', icon: '📺', subtitle: 'Watch & Reels' },
  { id: '5', title: 'Marketplace', icon: '🏪', subtitle: 'Mua và bán tại địa phương' },
  { id: '6', title: 'Bạn bè', icon: '🤝', subtitle: 'Tìm kiếm bạn bè' },
  { id: '7', title: 'Trang', icon: '🚩', subtitle: '3 trang bạn quản lý' },
  { id: '8', title: 'Sự kiện', icon: '📅', subtitle: '2 sự kiện tuần này' },
];

export const MenuScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Menu</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Text style={styles.iconText}>⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Text style={styles.iconText}>🔍</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User Profile Card */}
        <TouchableOpacity
          style={styles.profileCard}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Profile', {})}
        >
          <Image source={{ uri: CURRENT_USER.avatar }} style={styles.userAvatar} />
          <View style={styles.profileMeta}>
            <Text style={styles.userName}>{CURRENT_USER.name}</Text>
            <Text style={styles.viewProfileText}>Xem trang cá nhân của bạn</Text>
          </View>
          <Text style={styles.chevronIcon}>›</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Shortcuts Header */}
        <Text style={styles.sectionTitle}>Tất cả lối tắt</Text>

        {/* Shortcuts 2-Column Grid */}
        <View style={styles.shortcutsGrid}>
          {SHORTCUTS.map(item => (
            <TouchableOpacity key={item.id} style={styles.shortcutCard} activeOpacity={0.7}>
              <Text style={styles.shortcutIcon}>{item.icon}</Text>
              <Text style={styles.shortcutTitle}>{item.title}</Text>
              {item.subtitle && (
                <Text style={styles.shortcutSubtitle} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Expandable Settings List */}
        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingsRow}>
            <Text style={styles.settingsRowIcon}>❓</Text>
            <Text style={styles.settingsRowTitle}>Trợ giúp & hỗ trợ</Text>
            <Text style={styles.chevronIcon}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsRow}>
            <Text style={styles.settingsRowIcon}>⚙️</Text>
            <Text style={styles.settingsRowTitle}>Cài đặt & quyền riêng tư</Text>
            <Text style={styles.chevronIcon}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F2F5',
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
    fontSize: 26,
    fontWeight: '800',
    color: '#050505',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E4E6EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginVertical: 10,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileMeta: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#050505',
  },
  viewProfileText: {
    fontSize: 13,
    color: '#65676B',
    marginTop: 2,
  },
  chevronIcon: {
    fontSize: 22,
    color: '#65676B',
    fontWeight: '300',
  },
  divider: {
    height: 1,
    backgroundColor: '#CED0D4',
    marginHorizontal: 14,
    marginVertical: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#050505',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  shortcutCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    margin: '1.5%',
    padding: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  shortcutIcon: {
    fontSize: 26,
    marginBottom: 8,
  },
  shortcutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#050505',
  },
  shortcutSubtitle: {
    fontSize: 11,
    color: '#65676B',
    marginTop: 2,
  },
  settingsSection: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#CED0D4',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E4E6EB',
  },
  settingsRowIcon: {
    fontSize: 20,
    width: 32,
  },
  settingsRowTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#050505',
  },
  logoutButton: {
    margin: 16,
    backgroundColor: '#E4E6EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#050505',
    fontWeight: '700',
    fontSize: 15,
  },
  footerSpacing: {
    height: 30,
  },
});
