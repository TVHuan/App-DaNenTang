import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import {
  Calendar,
  BookOpen,
  FileText,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
} from 'lucide-react-native';

import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import AppButton from '../../components/common/AppButton';
import SyncBadge from '../../components/common/SyncBadge';
import { assignmentService, Assignment } from '../../api/assignmentService';
import { useAppData } from '../../context/AppDataContext';
import { formatDate, formatDateTime, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function AssignmentDetailScreen() {
  const route = useRoute<RouteProp<{ params: { id: number | string } }, 'params'>>();
  const navigation = useNavigation();
  const { id } = route.params;

  const { getAssignmentById, toggleAssignmentStatus } = useAppData();

  const [assignment, setAssignment] = useState<Assignment | null>(
    () => getAssignmentById(id) || null
  );
  const [loading, setLoading] = useState<boolean>(!assignment);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assignmentService.getById(id);
      setAssignment(data);
    } catch (err: any) {
      if (!assignment) {
        setError(err.message || 'Không thể tải chi tiết bài tập.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  // Cập nhật tiêu đề Header bằng tên bài tập
  useLayoutEffect(() => {
    if (assignment?.title) {
      navigation.setOptions({
        title: assignment.title,
        headerShown: true,
        headerBackTitle: 'Quay lại',
      });
    }
  }, [navigation, assignment?.title]);

  if (loading && !assignment) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết bài tập…" />
      </ScreenContainer>
    );
  }

  if (error && !assignment) {
    return (
      <ScreenContainer>
        <ErrorView message={error} onRetry={fetchAssignment} />
      </ScreenContainer>
    );
  }

  const isDone = assignment?.status === 'done';
  const overdue = !isDone && assignment?.dueDate && isOverdue(assignment.dueDate);

  const handleToggle = async () => {
    if (!assignment) return;
    await toggleAssignmentStatus(assignment.id);
    setAssignment((prev) =>
      prev ? { ...prev, status: prev.status === 'done' ? 'todo' : 'done' } : null
    );
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            <View
              style={[
                styles.statusBadge,
                isDone ? styles.statusDone : styles.statusTodo,
                overdue && styles.statusOverdue,
              ]}
            >
              {isDone ? (
                <CheckCircle2 size={14} color={colors.success} style={styles.badgeIcon} />
              ) : overdue ? (
                <AlertCircle size={14} color={colors.danger} style={styles.badgeIcon} />
              ) : (
                <Circle size={14} color={colors.primary} style={styles.badgeIcon} />
              )}
              <Text
                style={[
                  styles.statusText,
                  isDone ? styles.textDone : styles.textTodo,
                  overdue && styles.textOverdue,
                ]}
              >
                {isDone ? 'Đã hoàn thành' : overdue ? 'Quá hạn nộp' : 'Chưa hoàn thành'}
              </Text>
            </View>

            <SyncBadge pending={assignment?._pending} />
          </View>

          <Text style={styles.title}>{assignment?.title}</Text>

          <View style={styles.infoRow}>
            <BookOpen size={16} color={colors.primary} style={styles.icon} />
            <Text style={styles.infoLabel}>Môn học:</Text>
            <Text style={styles.infoValue}>
              {assignment?.course?.name || `Môn học #${assignment?.courseId}`}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Calendar size={16} color={overdue ? colors.danger : colors.textSecondary} style={styles.icon} />
            <Text style={styles.infoLabel}>Hạn nộp:</Text>
            <Text style={[styles.infoValue, overdue && styles.overdueText]}>
              {formatDate(assignment?.dueDate)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Clock size={16} color={colors.textMuted} style={styles.icon} />
            <Text style={styles.infoLabel}>Cập nhật:</Text>
            <Text style={styles.updatedText}>
              {formatDateTime(assignment?.updatedAt)}
            </Text>
          </View>

          <View style={styles.descriptionBox}>
            <View style={styles.descHeader}>
              <FileText size={16} color={colors.primary} style={styles.icon} />
              <Text style={styles.descTitle}>Yêu cầu & Mô tả bài tập</Text>
            </View>
            <Text style={styles.description}>
              {assignment?.description || 'Không có mô tả chi tiết cho bài tập này.'}
            </Text>
          </View>

          <View style={styles.actionContainer}>
            <AppButton
              title={isDone ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
              variant={isDone ? 'outline' : 'primary'}
              onPress={handleToggle}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.base,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeIcon: {
    marginRight: 4,
  },
  statusTodo: {
    backgroundColor: colors.primaryLight,
  },
  statusDone: {
    backgroundColor: colors.successLight,
  },
  statusOverdue: {
    backgroundColor: colors.dangerLight,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '700',
  },
  textTodo: {
    color: colors.primary,
  },
  textDone: {
    color: colors.success,
  },
  textOverdue: {
    color: colors.danger,
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
    width: 80,
  },
  infoValue: {
    ...typography.bodyBold,
    color: colors.text,
    flex: 1,
  },
  overdueText: {
    color: colors.danger,
    fontWeight: '700',
  },
  updatedText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  descriptionBox: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  descHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  descTitle: {
    ...typography.subtitle,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  actionContainer: {
    marginTop: spacing.xl,
  },
});
