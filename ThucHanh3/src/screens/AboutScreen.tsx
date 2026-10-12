import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  GraduationCap,
  Layers,
  Compass,
  Code2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react-native';

import { RootStackParamList } from '../types/navigation';
import { Header } from '../components/Header';

export const AboutScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const navFeatures = [
    {
      title: 'Native Stack Navigator',
      desc: 'Điều hướng đa cấp độ giữa Danh sách -> Chi tiết sinh viên -> Chỉnh sửa hồ sơ, hỗ trợ hiệu ứng chuyển cảnh mượt mà.',
      color: '#3B82F6',
    },
    {
      title: 'Bottom Tab Navigator',
      desc: 'Thanh điều hướng dưới đáy màn hình giúp chuyển đổi nhanh chóng giữa Danh sách, Báo cáo & Thống kê, Thêm mới và Giới thiệu.',
      color: '#10B981',
    },
    {
      title: 'Drawer Navigator',
      desc: 'Menu trượt thông minh từ cạnh trái, hỗ trợ thao tác vuốt gesture hoặc bấm nút Menu để truy cập nhanh toàn bộ hệ thống.',
      color: '#8B5CF6',
    },
  ];

  const appHighlights = [
    'Quản lý hồ sơ sinh viên đầy đủ (Thêm, Sửa, Xoá, Xem chi tiết)',
    'Tìm kiếm tức thời đa trường dữ liệu (Tên, MSSV, Lớp, Khoa)',
    'Lọc sinh viên theo chuẩn phân loại GPA: Giỏi, Khá, Trung bình, Yếu',
    'Thống kê số liệu học vụ trực quan bằng biểu đồ SVG hiện đại',
    'Xác thực ràng buộc form thông minh kèm thông báo lỗi chi tiết',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Thông tin ứng dụng"
        subtitle="Bài thực hành 3 - Lập trình ứng dụng đa nền tảng"
        onOpenDrawer={handleOpenDrawer}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroIconBg}>
            <GraduationCap size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>Student Management App</Text>
          <Text style={styles.heroBadge}>Phiên bản Thực hành 3 • React Native CLI</Text>
          <Text style={styles.heroDesc}>
            Ứng dụng mô phỏng hệ thống quản lý học vụ và sinh viên chuyên nghiệp, tích hợp hoàn chỉnh bộ 3 điều hướng Stack, Bottom Tabs và Drawer Navigation.
          </Text>
        </View>

        {/* Kiến trúc Navigation */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#EFF6FF' }]}>
              <Compass size={18} color="#2563EB" />
            </View>
            <Text style={styles.sectionTitle}>Kiến trúc React Navigation v7</Text>
          </View>

          {navFeatures.map((item, idx) => (
            <View key={idx} style={styles.featureItem}>
              <View style={[styles.featureDot, { backgroundColor: item.color }]} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tính năng nổi bật */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#ECFDF5' }]}>
              <Sparkles size={18} color="#059669" />
            </View>
            <Text style={styles.sectionTitle}>Các tính năng kế thừa từ TH2</Text>
          </View>

          {appHighlights.map((hl, idx) => (
            <View key={idx} style={styles.highlightRow}>
              <CheckCircle2 size={16} color="#10B981" style={{ marginRight: 8, marginTop: 2 }} />
              <Text style={styles.highlightText}>{hl}</Text>
            </View>
          ))}
        </View>

        {/* Thông tin công nghệ */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#F3E8FF' }]}>
              <Code2 size={18} color="#9333EA" />
            </View>
            <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>
          </View>

          <View style={styles.techRow}>
            <Text style={styles.techKey}>Framework:</Text>
            <Text style={styles.techVal}>React Native 0.87.1 (CLI)</Text>
          </View>
          <View style={styles.techRow}>
            <Text style={styles.techKey}>Ngôn ngữ:</Text>
            <Text style={styles.techVal}>TypeScript / JavaScript (ES2024)</Text>
          </View>
          <View style={styles.techRow}>
            <Text style={styles.techKey}>Navigation:</Text>
            <Text style={styles.techVal}>React Navigation v7.x</Text>
          </View>
          <View style={styles.techRow}>
            <Text style={styles.techKey}>Icons & SVG:</Text>
            <Text style={styles.techVal}>Lucide React Native & react-native-svg</Text>
          </View>
        </View>

        {/* Quick action button to go to list */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => (navigation as any).navigate('StudentListTab')}
          activeOpacity={0.8}
        >
          <Layers size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.actionBtnText}>Khám phá danh sách sinh viên ngay</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#1E40AF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  heroIconBg: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  heroBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#93C5FD',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 12,
  },
  heroDesc: {
    fontSize: 13,
    color: '#E0E7FF',
    textAlign: 'center',
    lineHeight: 19,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 10,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  highlightText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  techRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  techKey: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  techVal: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  actionBtn: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
