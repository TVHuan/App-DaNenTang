import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, MapPin, FileText } from 'lucide-react-native';
import { ClassSession } from '../../api/sessionService';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export interface SessionCardProps {
  session: ClassSession;
  onPress: () => void;
}

function SessionCardComponent({ session, onPress }: SessionCardProps) {
  const courseName = session.course?.name || `Môn học #${session.courseId}`;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Buổi học ${courseName}, thời gian ${session.startTime} đến ${session.endTime}, phòng ${session.room}`}
    >
      <View style={styles.timeSection}>
        <Clock size={16} color={colors.primary} style={styles.timeIcon} />
        <Text style={styles.timeText}>
          {session.startTime} - {session.endTime}
        </Text>
      </View>

      <Text style={styles.courseTitle} numberOfLines={2}>
        {courseName}
      </Text>

      <View style={styles.detailsRow}>
        <View style={styles.roomTag}>
          <MapPin size={14} color={colors.secondary} style={styles.roomIcon} />
          <Text style={styles.roomText}>{session.room}</Text>
        </View>

        {session.note ? (
          <View style={styles.noteTag}>
            <FileText size={12} color={colors.textMuted} style={styles.noteIcon} />
            <Text style={styles.noteText} numberOfLines={1}>
              {session.note}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(SessionCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.base,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 44,
  },
  timeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  timeIcon: {
    marginRight: 6,
  },
  timeText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },
  courseTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  roomTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  roomIcon: {
    marginRight: 4,
  },
  roomText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  noteTag: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  noteIcon: {
    marginRight: 4,
  },
  noteText: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});
