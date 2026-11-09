import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export interface DaySelectorProps {
  selectedDay: number; // 2 (Thứ 2) -> 8 (Chủ nhật)
  onSelectDay: (day: number) => void;
}

const DAYS = [
  { day: 2, label: 'T2', name: 'Thứ 2' },
  { day: 3, label: 'T3', name: 'Thứ 3' },
  { day: 4, label: 'T4', name: 'Thứ 4' },
  { day: 5, label: 'T5', name: 'Thứ 5' },
  { day: 6, label: 'T6', name: 'Thứ 6' },
  { day: 7, label: 'T7', name: 'Thứ 7' },
  { day: 8, label: 'CN', name: 'CN' },
];

export default function DaySelector({
  selectedDay,
  onSelectDay,
}: DaySelectorProps) {
  return (
    <View style={styles.container}>
      {DAYS.map((item) => {
        const isSelected = selectedDay === item.day;
        return (
          <TouchableOpacity
            key={item.day}
            style={[styles.dayButton, isSelected && styles.selectedDayButton]}
            onPress={() => onSelectDay(item.day)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Chọn ${item.name}`}
          >
            <Text
              style={[
                styles.dayLabel,
                isSelected && styles.selectedDayLabel,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  selectedDayButton: {
    backgroundColor: colors.primary,
  },
  dayLabel: {
    ...typography.subtitle,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  selectedDayLabel: {
    color: colors.textInverse,
  },
});
