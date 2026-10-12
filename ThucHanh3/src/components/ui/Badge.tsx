import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  style,
}) => {
  const variantStyles = styles[variant] || styles.default;
  const textStyles = textColors[variant] || textColors.default;

  return (
    <View style={[styles.base, variantStyles, style]}>
      {typeof children === 'string' ? (
        <Text style={[styles.text, textStyles]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  default: {
    backgroundColor: '#18181B', // Zinc 900
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: '#F4F4F5', // Zinc 100
    borderWidth: 0,
  },
  destructive: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  success: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  warning: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
});

const textColors = StyleSheet.create({
  default: {
    color: '#FAFAFA',
  },
  secondary: {
    color: '#18181B',
  },
  destructive: {
    color: '#DC2626',
  },
  outline: {
    color: '#09090B',
  },
  success: {
    color: '#047857',
  },
  warning: {
    color: '#B45309',
  },
});
