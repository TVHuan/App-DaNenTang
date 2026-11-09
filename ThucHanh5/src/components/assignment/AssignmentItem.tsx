import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, AlertCircle } from 'lucide-react-native';
import { Assignment } from '../../api/assignmentService';
import StatusToggle from './StatusToggle';
import SyncBadge from '../common/SyncBadge';
import { formatDate, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export interface AssignmentItemProps {
  assignment: Assignment;
  pending?: boolean;
  onPress: () => void;
  onToggleStatus: () => void;
}

function AssignmentItemComponent({
  assignment,
  pending = false,
  onPress,
  onToggleStatus,
}: AssignmentItemProps) {
  const isDone = assignment.status === 'done';
  const overdue = !isDone && isOverdue(assignment.dueDate);
  const courseName = assignment.course?.name || `Môn học #${assignment.courseId}`;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isDone && styles.cardDone,
        overdue && styles.cardOverdue,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Bài tập ${assignment.title}, môn ${courseName}, hạn nộp ${formatDate(assignment.dueDate)}`}
    >
      <View style={styles.toggleCol}>
        <StatusToggle status={assignment.status} onToggle={onToggleStatus} />
      </View>

      <View style={styles.contentCol}>
        <View style={styles.metaRow}>
          <Text style={styles.courseName} numberOfLines={1}>
            {courseName}
          </Text>
          <SyncBadge pending={pending || assignment._pending} />
        </View>

        <Text
          style={[styles.title, isDone && styles.titleDone]}
          numberOfLines={2}
        >
          {assignment.title}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.dateBadge}>
            {overdue ? (
              <AlertCircle size={14} color={colors.danger} style={styles.dateIcon} />
            ) : (
              <Calendar size={14} color={colors.textSecondary} style={styles.dateIcon} />
            )}
            <Text
              style={[
                styles.dateText,
                overdue && styles.dateTextOverdue,
                isDone && styles.dateTextDone,
              ]}
            >
              Hạn: {formatDate(assignment.dueDate)}
              {overdue ? ' (Quá hạn)' : ''}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(AssignmentItemComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 44,
  },
  cardDone: {
    opacity: 0.7,
    backgroundColor: '#F8FAFC',
  },
  cardOverdue: {
    borderColor: colors.danger,
    backgroundColor: '#FFF5F5',
  },
  toggleCol: {
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  contentCol: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  courseName: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 4,
  },
  dateText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dateTextOverdue: {
    color: colors.danger,
    fontWeight: '700',
  },
  dateTextDone: {
    color: colors.textMuted,
  },
});
