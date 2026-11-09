import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Award, BookCheck } from 'lucide-react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export interface GpaSummaryProps {
  gpa: number;
  totalCredits: number;
}

export default function GpaSummary({ gpa, totalCredits }: GpaSummaryProps) {
  const formattedGpa = Number(gpa).toFixed(2);

  return (
    <View style={styles.card}>
      <View style={styles.statBox}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
          <Award size={20} color={colors.primary} />
        </View>
        <Text style={styles.statValue}>{formattedGpa}</Text>
        <Text style={styles.statLabel}>Điểm GPA (Hệ 4)</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.statBox}>
        <View style={[styles.iconCircle, { backgroundColor: colors.successLight }]}>
          <BookCheck size={20} color={colors.success} />
        </View>
        <Text style={styles.statValue}>{totalCredits}</Text>
        <Text style={styles.statLabel}>Tín chỉ tích lũy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.base,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h1,
    color: colors.text,
    fontWeight: '800',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
});
