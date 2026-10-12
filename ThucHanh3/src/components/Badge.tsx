import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Classification, getClassificationTheme } from '../types/student';

interface BadgeProps {
  classification: Classification;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ classification, size = 'md' }) => {
  const theme = getClassificationTheme(classification);

  const sizeStyles = {
    sm: { paddingVertical: 2, paddingHorizontal: 6, fontSize: 11 },
    md: { paddingVertical: 4, paddingHorizontal: 10, fontSize: 12 },
    lg: { paddingVertical: 6, paddingHorizontal: 14, fontSize: 14 },
  }[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: theme.bg,
          borderColor: theme.border,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: theme.badgeBg }]} />
      <Text style={[styles.text, { color: theme.text, fontSize: sizeStyles.fontSize }]}>
        {classification}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
