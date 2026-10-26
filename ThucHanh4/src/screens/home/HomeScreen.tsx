import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  User,
  GraduationCap,
  Calendar,
  ClipboardList,
  ChevronRight,
  RefreshCw,
  CloudOff,
} from 'lucide-react-native';

import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import CourseCard from '../../components/course/CourseCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import EmptyState from '../../components/common/EmptyState';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {
    student,
    courses,
    upcomingAssignments,
    todaySessions,
    loading,
    lastUpdated,
    reloadAll,
    toggleAssignmentStatus,
  } = useAppData();
  const { pendingCount, syncing, syncNow } = useSync();

  if (loading && !student && courses.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải dữ liệu tổng quan…" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll refreshing={loading} onRefresh={reloadAll}>
      {/* 1. Header sinh viên */}
      <View style={styles.headerCard}>
        <View style={styles.avatarCircle}>
          <User size={28} color={colors.primary} />
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.greeting}>Xin chào,</Text>
          <Text style={styles.studentName}>
            {student?.fullName || 'Sinh viên'}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.codeBadge}>
              MSSV: {student?.studentCode || '21110001'}
            </Text>
            <Text style={styles.classText}>• {student?.className || 'CNTT-K21A'}</Text>
          </View>
        </View>
      </View>

      {/* 2. Banner hàng đợi đồng bộ (nếu có pending changes) */}
      {pendingCount > 0 ? (
        <View style={styles.syncCard}>
          <View style={styles.syncLeft}>
            <CloudOff size={18} color="#B45309" style={styles.syncIcon} />
            <Text style={styles.syncText}>
              Có {pendingCount} thay đổi chưa đồng bộ
            </Text>
          </View>
          <TouchableOpacity
            style={styles.syncButton}
            onPress={() => syncNow()}
            disabled={syncing}
            accessibilityRole="button"
            accessibilityLabel="Đồng bộ ngay"
          >
            {syncing ? (
              <RefreshCw size={14} color={colors.textInverse} />
            ) : (
              <Text style={styles.syncButtonText}>Đồng bộ ngay</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Cập nhật lần cuối */}
      <View style={styles.lastUpdatedContainer}>
        <LastUpdatedText timestamp={lastUpdated} />
      </View>

      {/* 3. Lịch học hôm nay */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Calendar size={18} color={colors.primary} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Lịch học hôm nay</Text>
        </View>
      </View>

      {todaySessions.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Hôm nay bạn không có lịch học.</Text>
        </View>
      ) : (
        todaySessions.map((session) => (
          <View key={session.id} style={styles.sessionItem}>
            <View style={styles.sessionTime}>
              <Text style={styles.sessionTimeText}>
                {session.startTime} - {session.endTime}
              </Text>
              <Text style={styles.sessionRoom}>{session.room}</Text>
            </View>
            <View style={styles.sessionContent}>
              <Text style={styles.sessionCourse} numberOfLines={1}>
                {session.course?.name || `Môn học #${session.courseId}`}
              </Text>
              {session.note ? (
                <Text style={styles.sessionNote} numberOfLines={1}>
                  {session.note}
                </Text>
              ) : null}
            </View>
          </View>
        ))
      )}

      {/* 4. Bài tập đến hạn trong 7 ngày tới */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <ClipboardList size={18} color={colors.warning} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>
            Bài tập đến hạn (7 ngày tới)
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTES.ASSIGNMENTS_TAB)}
          accessibilityRole="button"
          accessibilityLabel="Xem tất cả bài tập"
        >
          <Text style={styles.seeAllText}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      {upcomingAssignments.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            Không có bài tập nào sắp đến hạn trong 7 ngày tới.
          </Text>
        </View>
      ) : (
        upcomingAssignments.slice(0, 3).map((item) => (
          <AssignmentItem
            key={item.id}
            assignment={item}
            pending={item._pending}
            onPress={() =>
              navigation.navigate(ROUTES.HOME_ASSIGNMENT_DETAIL, { id: item.id })
            }
            onToggleStatus={() => toggleAssignmentStatus(item.id)}
          />
        ))
      )}

      {/* 5. Các môn học đang học */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <GraduationCap size={18} color={colors.primary} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Môn đang học</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTES.COURSES_TAB)}
          accessibilityRole="button"
          accessibilityLabel="Xem tất cả môn học"
        >
          <Text style={styles.seeAllText}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      {courses.slice(0, 3).map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onPress={() =>
            navigation.navigate(ROUTES.HOME_COURSE_DETAIL, { id: course.id })
          }
        />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.base,
    marginHorizontal: spacing.base,
    marginTop: spacing.sm,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  studentInfo: {
    flex: 1,
  },
  greeting: {
    ...typography.caption,
    color: colors.textMuted,
  },
  studentName: {
    ...typography.h2,
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  codeBadge: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },
  classText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  syncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  syncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  syncIcon: {
    marginRight: spacing.sm,
  },
  syncText: {
    ...typography.caption,
    color: '#92400E',
    fontWeight: '600',
  },
  syncButton: {
    backgroundColor: '#D97706',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 6,
  },
  syncButtonText: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '700',
  },
  lastUpdatedContainer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.base,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  seeAllText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  emptyBox: {
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: 12,
    marginHorizontal: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  sessionTime: {
    width: 100,
    marginRight: spacing.sm,
  },
  sessionTimeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  sessionRoom: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sessionContent: {
    flex: 1,
  },
  sessionCourse: {
    ...typography.bodyBold,
    color: colors.text,
  },
  sessionNote: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});
