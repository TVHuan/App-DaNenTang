import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterChipsProps {
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
  style?: ViewStyle;
}

export default function FilterChips({
  options,
  selected,
  onSelect,
  style,
}: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
    >
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.chip, isSelected && styles.selectedChip]}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Lọc theo ${option.label}`}
          >
            <Text
              style={[styles.chipText, isSelected && styles.selectedChipText]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 44,
  },
  contentContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  chip: {
    minHeight: 34,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  selectedChipText: {
    color: colors.textInverse,
  },
});
