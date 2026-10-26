import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Grade } from '../../api/gradeService';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export interface GradeRowProps {
  grade: Grade;
  onPress: () => void;
}

function GradeRowComponent({ grade, onPress }: GradeRowProps) {
  const courseName = grade.course?.name || `Môn học #${grade.courseId}`;
  const credits = grade.course?.credits || 3;

  const isPassed = grade.letter !== 'F';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Môn ${courseName}, điểm tổng kết ${grade.total}, điểm chữ ${grade.letter}`}
    >
      <View style={styles.leftCol}>
        <Text style={styles.courseName} numberOfLines={1}>
          {courseName}
        </Text>
        <Text style={styles.courseCredits}>{credits} tín chỉ • {grade.semester}</Text>
      </View>

      <View style={styles.rightCol}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>{grade.total.toFixed(1)}</Text>
        </View>
        <View
          style={[
            styles.letterBadge,
            isPassed ? styles.passedBadge : styles.failedBadge,
          ]}
        >
          <Text
            style={[
              styles.letterText,
              isPassed ? styles.passedText : styles.failedText,
            ]}
          >
            {grade.letter}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(GradeRowComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  leftCol: {
    flex: 1,
    marginRight: spacing.base,
  },
  courseName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 4,
  },
  courseCredits: {
    ...typography.caption,
    color: colors.textMuted,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBox: {
    marginRight: spacing.sm,
  },
  scoreText: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },
  letterBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passedBadge: {
    backgroundColor: colors.primaryLight,
  },
  failedBadge: {
    backgroundColor: colors.dangerLight,
  },
  letterText: {
    ...typography.bodyBold,
    fontWeight: '800',
  },
  passedText: {
    color: colors.primary,
  },
  failedText: {
    color: colors.danger,
  },
});
