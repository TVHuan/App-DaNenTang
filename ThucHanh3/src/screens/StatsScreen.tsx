import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Rect, Text as SvgText, G } from 'react-native-svg';
import {
  BarChart3,
  Award,
  Users,
  Building2,
  TrendingUp,
  Menu,
} from 'lucide-react-native';

import { useStudents } from '../context/StudentContext';
import { RootStackParamList } from '../types/navigation';
import { getClassification, Classification } from '../types/student';
import { Header } from '../components/Header';
import { Badge } from '../components/Badge';

export const StatsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { students } = useStudents();

  // Thống kê phân bố GPA & Xếp loại
  const classificationCounts = useMemo(() => {
    const counts: Record<Classification, number> = {
      'Giỏi': 0,
      'Khá': 0,
      'Trung bình': 0,
      'Yếu': 0,
    };
    students.forEach((s) => {
      const c = getClassification(s.gpa);
      counts[c] = (counts[c] || 0) + 1;
    });
    return counts;
  }, [students]);

  // Thống kê giới tính
  const genderStats = useMemo(() => {
    const male = students.filter((s) => s.gender === 'Nam').length;
    const female = students.filter((s) => s.gender === 'Nữ').length;
    const other = students.length - male - female;
    return { male, female, other };
  }, [students]);

  // Top 3 sinh viên điểm cao nhất
  const topStudents = useMemo(() => {
    return [...students].sort((a, b) => b.gpa - a.gpa).slice(0, 3);
  }, [students]);

  // Phân bố theo Khoa
  const facultyCounts = useMemo(() => {
    const map: Record<string, number> = {};
    students.forEach((s) => {
      map[s.faculty] = (map[s.faculty] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [students]);

  const maxCategoryCount = Math.max(
    ...Object.values(classificationCounts),
    1
  );

  const categories: { label: Classification; count: number; color: string }[] = [
    { label: 'Giỏi', count: classificationCounts['Giỏi'], color: '#10B981' },
    { label: 'Khá', count: classificationCounts['Khá'], color: '#3B82F6' },
    { label: 'Trung bình', count: classificationCounts['Trung bình'], color: '#F59E0B' },
    { label: 'Yếu', count: classificationCounts['Yếu'], color: '#EF4444' },
  ];

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Báo cáo & Thống kê"
        subtitle="Phân tích chất lượng học vụ sinh viên"
        onOpenDrawer={handleOpenDrawer}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card: Phân bố Xếp loại học lực với biểu đồ cột SVG */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <BarChart3 size={18} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Phân bố xếp loại học lực</Text>
              <Text style={styles.cardSubtitle}>Dựa theo thang điểm GPA 10</Text>
            </View>
          </View>

          {/* SVG Bar Chart */}
          <View style={styles.chartWrapper}>
            <Svg width="100%" height="150" viewBox="0 0 320 150">
              {categories.map((cat, index) => {
                const x = 20 + index * 75;
                const barHeight = Math.max((cat.count / maxCategoryCount) * 90, 6);
                const y = 110 - barHeight;

                return (
                  <G key={cat.label}>
                    {/* Background bar slot */}
                    <Rect
                      x={x}
                      y={20}
                      width={38}
                      height={90}
                      rx={6}
                      fill="#F1F5F9"
                    />
                    {/* Dynamic colored bar */}
                    <Rect
                      x={x}
                      y={y}
                      width={38}
                      height={barHeight}
                      rx={6}
                      fill={cat.color}
                    />
                    {/* Value count above bar */}
                    <SvgText
                      x={x + 19}
                      y={y - 6}
                      fontSize="12"
                      fontWeight="bold"
                      fill="#1E293B"
                      textAnchor="middle"
                    >
                      {cat.count}
                    </SvgText>
                    {/* Category label below bar */}
                    <SvgText
                      x={x + 19}
                      y={130}
                      fontSize="11"
                      fill="#64748B"
                      textAnchor="middle"
                    >
                      {cat.label}
                    </SvgText>
                  </G>
                );
              })}
            </Svg>
          </View>

          {/* Rate Percentages list */}
          <View style={styles.breakdownList}>
            {categories.map((cat) => {
              const percent =
                students.length > 0
                  ? Math.round((cat.count / students.length) * 100)
                  : 0;
              return (
                <View key={cat.label} style={styles.breakdownRow}>
                  <View style={styles.breakdownLabelGroup}>
                    <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
                    <Text style={styles.breakdownLabel}>{cat.label}</Text>
                  </View>
                  <View style={styles.breakdownValueGroup}>
                    <Text style={styles.breakdownCount}>{cat.count} SV</Text>
                    <Text style={styles.breakdownPercent}>({percent}%)</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Card: Top Sinh viên GPA cao nhất */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Award size={18} color="#D97706" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Gương mặt tiêu biểu (Top GPA)</Text>
              <Text style={styles.cardSubtitle}>Sinh viên có điểm tích luỹ cao nhất</Text>
            </View>
          </View>

          {topStudents.map((s, index) => (
            <TouchableOpacity
              key={s.id}
              style={styles.topStudentItem}
              onPress={() => navigation.navigate('StudentDetail', { studentId: s.id })}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.rankBadge,
                  index === 0
                    ? styles.rank1
                    : index === 1
                    ? styles.rank2
                    : styles.rank3,
                ]}
              >
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>

              <View style={styles.topStudentInfo}>
                <Text style={styles.topStudentName}>{s.fullName}</Text>
                <Text style={styles.topStudentMeta}>
                  MSSV: {s.mssv} • Lớp: {s.className}
                </Text>
              </View>

              <View style={styles.topStudentGpa}>
                <Text style={styles.topGpaNumber}>{s.gpa.toFixed(1)}</Text>
                <Text style={styles.topGpaMax}>/10</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Card: Phân bố Giới tính & Khoa */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Users size={18} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Phân bố Giới tính & Đơn vị</Text>
              <Text style={styles.cardSubtitle}>Tỉ lệ nhân khẩu học sinh viên</Text>
            </View>
          </View>

          <View style={styles.genderRow}>
            <View style={styles.genderBox}>
              <Text style={styles.genderNum}>{genderStats.male}</Text>
              <Text style={styles.genderLabel}>♂ Nam ({( (genderStats.male / (students.length || 1)) * 100 ).toFixed(0)}%)</Text>
            </View>
            <View style={styles.genderDivider} />
            <View style={styles.genderBox}>
              <Text style={styles.genderNum}>{genderStats.female}</Text>
              <Text style={styles.genderLabel}>♀ Nữ ({( (genderStats.female / (students.length || 1)) * 100 ).toFixed(0)}%)</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.facultyHeaderTitle}>Theo Khoa chuyên ngành:</Text>
          {facultyCounts.map(([fac, count]) => (
            <View key={fac} style={styles.facultyItem}>
              <View style={styles.facultyNameRow}>
                <Building2 size={14} color="#64748B" style={{ marginRight: 6 }} />
                <Text style={styles.facultyNameText}>{fac}</Text>
              </View>
              <Text style={styles.facultyCountBadge}>{count} SV</Text>
            </View>
          ))}
        </View>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  breakdownList: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  breakdownValueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breakdownCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  breakdownPercent: {
    fontSize: 12,
    color: '#64748B',
  },
  topStudentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rank1: {
    backgroundColor: '#FEF3C7',
  },
  rank2: {
    backgroundColor: '#E2E8F0',
  },
  rank3: {
    backgroundColor: '#FFEDD5',
  },
  rankText: {
    fontWeight: '800',
    fontSize: 13,
    color: '#B45309',
  },
  topStudentInfo: {
    flex: 1,
  },
  topStudentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  topStudentMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  topStudentGpa: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  topGpaNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  topGpaMax: {
    fontSize: 11,
    color: '#93C5FD',
    fontWeight: '600',
    marginLeft: 2,
  },
  genderRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  genderBox: {
    flex: 1,
    alignItems: 'center',
  },
  genderNum: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  genderLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  genderDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  facultyHeaderTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 10,
  },
  facultyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  facultyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  facultyNameText: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
  },
  facultyCountBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
