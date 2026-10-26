import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface ProgressProps {
  value: number; // 0 - 100
  color?: string;
  style?: ViewStyle;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  color = '#18181B',
  style,
}) => {
  const clamped = Math.min(Math.max(value, 0), 100);

  return (
    <View style={[styles.track, style]}>
      <View
        style={[
          styles.fill,
          { width: `${clamped}%`, backgroundColor: color },
        ]}
      />
    </View>
  );
};

interface SeparatorProps {
  style?: ViewStyle;
}

export const Separator: React.FC<SeparatorProps> = ({ style }) => (
  <View style={[styles.separator, style]} />
);

const styles = StyleSheet.create({
  track: {
    height: 6,
    width: '100%',
    backgroundColor: '#F4F4F5', // Zinc 100
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  separator: {
    height: 1,
    backgroundColor: '#F4F4F5',
    marginVertical: 12,
  },
});
