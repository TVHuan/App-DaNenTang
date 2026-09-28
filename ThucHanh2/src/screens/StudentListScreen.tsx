import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Search, X, Plus, GraduationCap } from 'lucide-react-native';

import { RootStackParamList, Classification, getClassification } from '../types/student';
import { useStudents } from '../context/StudentContext';
import { StudentCard } from '../components/StudentCard';
import { StatsBanner } from '../components/StatsBanner';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'StudentList'>;

const FILTER_OPTIONS: { label: string; value: 'ALL' | Classification }[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Giỏi (≥ 8.5)', value: 'Giỏi' },
  { label: 'Khá (≥ 7.0)', value: 'Khá' },
  { label: 'Trung bình (≥ 5.0)', value: 'Trung bình' },
  { label: 'Yếu (< 5.0)', value: 'Yếu' },
];

export const StudentListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { students } = useStudents();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | Classification>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const total = students.length;
    if (total === 0) return { total: 0, avgGpa: '0.00', excellentCount: 0 };
    const sumGpa = students.reduce((sum, s) => sum + s.gpa, 0);
    const excellent = students.filter((s) => s.gpa >= 8.5).length;
    return {
      total,
      avgGpa: (sumGpa / total).toFixed(2),
      excellentCount: excellent,
    };
  }, [students]);

  // Filter & Search Logic
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // 1. Search filter: Theo mã hoặc họ tên
      const matchesSearch =
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        student.mssv.toLowerCase().includes(searchQuery.toLowerCase().trim());

      // 2. Academic classification filter
      const studentClassification = getClassification(student.gpa);
      const matchesClassification =
        selectedFilter === 'ALL' || studentClassification === selectedFilter;

      return matchesSearch && matchesClassification;
    });
  }, [students, searchQuery, selectedFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Top Bar with Title and Add Button */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.appTitle}>Quản Lý Sinh Viên</Text>
          <Text style={styles.appSubtitle}>Hệ thống hồ sơ học vụ thông minh</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddStudent')}
          activeOpacity={0.8}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 4 }} />
          <Text style={styles.addBtnText}>Thêm mới</Text>
        </TouchableOpacity>
      </View>

      {/* Modern Mathematical & Statistical Graph Background Stats Card */}
      <StatsBanner
        total={stats.total}
        avgGpa={stats.avgGpa}
        excellentCount={stats.excellentCount}
      />

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Search size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo MSSV hoặc Họ tên..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearSearchBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={14} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Horizontal Chips */}
      <View style={styles.filtersWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTER_OPTIONS}
          keyExtractor={(item) => item.value}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isSelected = selectedFilter === item.value;
            const count =
              item.value === 'ALL'
                ? students.length
                : students.filter((s) => getClassification(s.gpa) === item.value).length;

            return (
              <TouchableOpacity
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedFilter(item.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}
                >
                  {item.label}
                </Text>
                <View
                  style={[
                    styles.filterBadge,
                    isSelected ? styles.filterBadgeActive : styles.filterBadgeInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterBadgeText,
                      isSelected && styles.filterBadgeTextActive,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Result Count row */}
      <View style={styles.resultCountRow}>
        <Text style={styles.resultCountText}>
          Hiển thị <Text style={styles.resultCountHighlight}>{filteredStudents.length}</Text> sinh viên
        </Text>
        {(searchQuery.length > 0 || selectedFilter !== 'ALL') && (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery('');
              setSelectedFilter('ALL');
            }}
          >
            <Text style={styles.resetFilterText}>Đặt lại bộ lọc</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBg}>
        <GraduationCap size={36} color="#2563EB" />
      </View>
      <Text style={styles.emptyTitle}>
        {searchQuery || selectedFilter !== 'ALL'
          ? 'Không tìm thấy sinh viên nào'
          : 'Chưa có sinh viên trong danh sách'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery || selectedFilter !== 'ALL'
          ? 'Hãy thử thay đổi từ khoá tìm kiếm hoặc chuyển sang phân loại khác.'
          : 'Nhấn vào nút "Thêm mới" bên dưới để thêm sinh viên đầu tiên.'}
      </Text>
      {searchQuery || selectedFilter !== 'ALL' ? (
        <TouchableOpacity
          style={styles.emptyResetBtn}
          onPress={() => {
            setSearchQuery('');
            setSelectedFilter('ALL');
          }}
        >
          <Text style={styles.emptyResetText}>Xoá bộ lọc</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.emptyResetBtn}
          onPress={() => navigation.navigate('AddStudent')}
        >
          <Text style={styles.emptyResetText}>+ Thêm sinh viên ngay</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StudentCard
            student={item}
            onPress={() => navigation.navigate('StudentDetail', { studentId: item.id })}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563EB']}
          />
        }
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddStudent')}
        activeOpacity={0.85}
      >
        <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  headerContainer: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  searchWrapper: {
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  clearSearchBtn: {
    padding: 6,
  },
  filtersWrapper: {
    marginBottom: 12,
  },
  filterList: {
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginRight: 6,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  filterBadgeInactive: {
    backgroundColor: '#F1F5F9',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  filterBadgeTextActive: {
    color: '#FFFFFF',
  },
  resultCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  resultCountText: {
    fontSize: 12,
    color: '#64748B',
  },
  resultCountHighlight: {
    fontWeight: '700',
    color: '#0F172A',
  },
  resetFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconBg: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyResetBtn: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  emptyResetText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
