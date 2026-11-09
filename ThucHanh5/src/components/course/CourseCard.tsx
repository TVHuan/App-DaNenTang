import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { BookOpen, User, Award } from 'lucide-react-native';
import { Course } from '../../api/courseService';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

function CourseCardComponent({ course, onPress }: CourseCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Môn học ${course.name}, mã ${course.code}`}
    >
      <View style={styles.header}>
        <View style={styles.codeBadge}>
          <Text style={styles.codeText}>{course.code}</Text>
        </View>
        <View style={styles.creditBadge}>
          <Award size={12} color={colors.primary} style={styles.creditIcon} />
          <Text style={styles.creditText}>{course.credits} tín chỉ</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {course.name}
      </Text>

      <View style={styles.footer}>
        <View style={styles.lecturerRow}>
          <User size={14} color={colors.textSecondary} style={styles.lecturerIcon} />
          <Text style={styles.lecturerText} numberOfLines={1}>
            {course.lecturer}
          </Text>
        </View>
        <Text style={styles.semesterText}>{course.semester}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(CourseCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 44,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  codeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  codeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  creditBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  creditIcon: {
    marginRight: 4,
  },
  creditText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  lecturerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  lecturerIcon: {
    marginRight: 6,
  },
  lecturerText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  semesterText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
