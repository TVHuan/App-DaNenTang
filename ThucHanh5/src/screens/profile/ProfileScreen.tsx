import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { User, Edit3, Award, ChevronRight } from 'lucide-react-native';

import ScreenContainer from '../../components/common/ScreenContainer';
import InfoRow from '../../components/profile/InfoRow';
import GpaSummary from '../../components/grade/GpaSummary';
import LoadingView from '../../components/common/LoadingView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import { useAppData } from '../../context/AppDataContext';
import { calcGpa } from '../../utils/gpa';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { student, grades, courses, loading, lastUpdated, reloadAll } = useAppData();

  const gpaStats = useMemo(() => {
    return calcGpa(grades, courses);
  }, [grades, courses]);

  if (loading && !student) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải thông tin cá nhân…" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll refreshing={loading} onRefresh={reloadAll}>
      <View style={styles.content}>
        {/* Header thông tin sinh viên */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <User size={36} color={colors.primary} />
          </View>
          <Text style={styles.name}>{student?.fullName}</Text>
          <Text style={styles.studentCode}>MSSV: {student?.studentCode}</Text>
        </View>

        {/* Tóm tắt GPA & Tín chỉ */}
        <GpaSummary
          gpa={gpaStats.gpa}
          totalCredits={gpaStats.totalCredits}
        />

        {/* Xem bảng điểm */}
        <TouchableOpacity
          style={styles.gradeMenuButton}
          onPress={() => navigation.navigate(ROUTES.GRADE_LIST)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Xem chi tiết kết quả học tập"
        >
          <View style={styles.menuLeft}>
            <Award size={20} color={colors.primary} style={styles.menuIcon} />
            <Text style={styles.menuTitle}>Kết quả học tập chi tiết</Text>
          </View>
          <ChevronRight size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Bảng thông tin cá nhân */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
              accessibilityRole="button"
              accessibilityLabel="Chỉnh sửa thông tin cá nhân"
            >
              <Edit3 size={16} color={colors.primary} style={styles.editIcon} />
              <Text style={styles.editText}>Chỉnh sửa</Text>
            </TouchableOpacity>
          </View>

          <InfoRow label="Mã sinh viên" value={student?.studentCode || ''} />
          <InfoRow label="Họ và tên" value={student?.fullName || ''} />
          <InfoRow label="Lớp sinh hoạt" value={student?.className || ''} />
          <InfoRow label="Chuyên ngành" value={student?.major || ''} />
          <InfoRow label="Email" value={student?.email || ''} />
          <InfoRow label="Số điện thoại" value={student?.phone || ''} />
        </View>

        <View style={styles.lastUpdatedRow}>
          <LastUpdatedText timestamp={lastUpdated} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.base,
    marginTop: spacing.sm,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.h2,
    color: colors.text,
  },
  studentCode: {
    ...typography.subtitle,
    color: colors.textSecondary,
    marginTop: 2,
  },
  gradeMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.base,
    minHeight: 44,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: spacing.sm,
  },
  menuTitle: {
    ...typography.bodyBold,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.base,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  editIcon: {
    marginRight: 4,
  },
  editText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  lastUpdatedRow: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
});
