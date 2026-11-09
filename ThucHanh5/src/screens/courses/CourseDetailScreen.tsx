import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import {
  BookOpen,
  Award,
  User,
  Calendar,
  Clock,
  ClipboardList,
  FileText,
} from 'lucide-react-native';

import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import { courseService, Course } from '../../api/courseService';
import { useAppData } from '../../context/AppDataContext';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function CourseDetailScreen() {
  const route = useRoute<RouteProp<{ params: { id: number | string } }, 'params'>>();
  const navigation = useNavigation();
  const { id } = route.params;

  const { sessions, assignments, toggleAssignmentStatus, getCourseById } = useAppData();

  const [course, setCourse] = useState<Course | null>(() => getCourseById(id) || null);
  const [loading, setLoading] = useState<boolean>(!course);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getById(id);
      setCourse(data);
    } catch (err: any) {
      if (!course) {
        setError(err.message || 'Không thể tải thông tin môn học.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  // Cập nhật tiêu đề Header bằng tên môn học (theo quy tắc điều hướng 2)
  useLayoutEffect(() => {
    if (course?.name) {
      navigation.setOptions({
        title: course.name,
        headerShown: true,
        headerBackTitle: 'Quay lại',
      });
    }
  }, [navigation, course?.name]);

  if (loading && !course) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết môn học…" />
      </ScreenContainer>
    );
  }

  if (error && !course) {
    return (
      <ScreenContainer>
        <ErrorView message={error} onRetry={fetchCourse} />
      </ScreenContainer>
    );
  }

  const courseSessions = sessions.filter((s) => String(s.courseId) === String(id));
  const courseAssignments = assignments.filter((a) => String(a.courseId) === String(id));

  return (
    <ScreenContainer scroll>
      <View style={styles.content}>
        {/* Card thông tin môn */}
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <View style={styles.codeBadge}>
              <Text style={styles.codeText}>{course?.code}</Text>
            </View>
            <View style={styles.creditBadge}>
              <Award size={14} color={colors.primary} style={styles.icon} />
              <Text style={styles.creditText}>{course?.credits} tín chỉ</Text>
            </View>
          </View>

          <Text style={styles.title}>{course?.name}</Text>

          <View style={styles.infoRow}>
            <User size={16} color={colors.textSecondary} style={styles.icon} />
            <Text style={styles.infoLabel}>Giảng viên:</Text>
            <Text style={styles.infoValue}>{course?.lecturer}</Text>
          </View>

          <View style={styles.infoRow}>
            <Calendar size={16} color={colors.textSecondary} style={styles.icon} />
            <Text style={styles.infoLabel}>Học kỳ:</Text>
            <Text style={styles.infoValue}>{course?.semester}</Text>
          </View>

          <View style={styles.descriptionSection}>
            <View style={styles.sectionTitleRow}>
              <FileText size={16} color={colors.primary} style={styles.icon} />
              <Text style={styles.sectionTitle}>Mô tả môn học</Text>
            </View>
            <Text style={styles.descriptionText}>
              {course?.description || 'Chưa có thông tin mô tả chi tiết cho môn học này.'}
            </Text>
          </View>
        </View>

        {/* Lịch học của môn */}
        <View style={styles.sectionHeader}>
          <Clock size={18} color={colors.primary} style={styles.icon} />
          <Text style={styles.headingTitle}>Lịch học của môn</Text>
        </View>

        {courseSessions.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Môn học này chưa có lịch học cụ thể.</Text>
          </View>
        ) : (
          courseSessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <Text style={styles.sessionDay}>
                Thứ {session.dayOfWeek === 8 ? 'Chủ nhật' : session.dayOfWeek}
              </Text>
              <Text style={styles.sessionTime}>
                {session.startTime} - {session.endTime} (Phòng: {session.room})
              </Text>
              {session.note ? (
                <Text style={styles.sessionNote}>Ghi chú: {session.note}</Text>
              ) : null}
            </View>
          ))
        )}

        {/* Bài tập của môn */}
        <View style={styles.sectionHeader}>
          <ClipboardList size={18} color={colors.warning} style={styles.icon} />
          <Text style={styles.headingTitle}>Bài tập của môn</Text>
        </View>

        {courseAssignments.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Không có bài tập nào cho môn này.</Text>
          </View>
        ) : (
          courseAssignments.map((assignment) => (
            <AssignmentItem
              key={assignment.id}
              assignment={assignment}
              pending={assignment._pending}
              onPress={() => {}}
              onToggleStatus={() => toggleAssignmentStatus(assignment.id)}
            />
          ))
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.base,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  codeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  codeText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },
  creditBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  creditText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.base,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    marginRight: spacing.sm,
  },
  infoLabel: {
    ...typography.body,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  infoValue: {
    ...typography.bodyBold,
    color: colors.text,
  },
  descriptionSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.subtitle,
    fontWeight: '700',
    color: colors.text,
  },
  descriptionText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.base,
    marginBottom: spacing.sm,
  },
  headingTitle: {
    ...typography.h3,
    color: colors.text,
  },
  sessionCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  sessionDay: {
    ...typography.subtitle,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  sessionTime: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sessionNote: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
  },
  emptyBox: {
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
