import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {
  Users,
  BarChart3,
  UserPlus,
  Info,
  GraduationCap,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';
import { useStudents } from '../context/StudentContext';

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { navigation, state } = props;
  const { students } = useStudents();

  const menuItems = [
    {
      label: 'Danh sách sinh viên',
      sublabel: 'Xem và tìm kiếm sinh viên',
      route: 'MainTabs',
      tab: 'StudentListTab',
      icon: Users,
      color: '#2563EB',
    },
    {
      label: 'Thống kê & Báo cáo',
      sublabel: 'Biểu đồ phân loại học vụ',
      route: 'MainTabs',
      tab: 'StatsTab',
      icon: BarChart3,
      color: '#059669',
    },
    {
      label: 'Thêm sinh viên mới',
      sublabel: 'Tạo hồ sơ học vụ mới',
      route: 'MainTabs',
      tab: 'AddStudentTab',
      icon: UserPlus,
      color: '#D97706',
    },
    {
      label: 'Thông tin ứng dụng',
      sublabel: 'Giới thiệu bài Thực Hành 3',
      route: 'MainTabs',
      tab: 'AboutTab',
      icon: Info,
      color: '#7C3AED',
    },
  ];

  const handleNavigate = (route: string, tab?: string) => {
    if (tab) {
      navigation.navigate(route, { screen: tab });
    } else {
      navigation.navigate(route);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Drawer Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.headerAvatar}>
          <GraduationCap size={28} color="#FFFFFF" />
        </View>
        <Text style={styles.headerTitle}>HỆ THỐNG HỌC VỤ</Text>
        <Text style={styles.headerSubtitle}>Quản lý Sinh viên Đa Nền Tảng</Text>

        {/* Quick counter badge in drawer */}
        <View style={styles.statPill}>
          <Text style={styles.statPillText}>Đang quản lý: {students.length} sinh viên</Text>
        </View>
      </View>

      {/* Drawer Navigation Links */}
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.menuList}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleNavigate(item.route, item.tab)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconWrapper, { backgroundColor: `${item.color}15` }]}>
                  <Icon size={20} color={item.color} />
                </View>

                <View style={styles.menuTextGroup}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuSublabel}>{item.sublabel}</Text>
                </View>

                <ChevronRight size={16} color="#94A3B8" />
              </TouchableOpacity>
            );
          })}
        </View>
      </DrawerContentScrollView>

      {/* Drawer Footer */}
      <View style={styles.drawerFooter}>
        <View style={styles.footerRow}>
          <ShieldCheck size={16} color="#64748B" style={{ marginRight: 6 }} />
          <Text style={styles.footerText}>Thực Hành 3 • React Navigation v7</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  drawerHeader: {
    padding: 20,
    paddingTop: 28,
    backgroundColor: '#1E3A8A',
  },
  headerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#BFDBFE',
    marginTop: 2,
  },
  statPill: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollContainer: {
    paddingTop: 12,
  },
  menuList: {
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextGroup: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  menuSublabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  drawerFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});
