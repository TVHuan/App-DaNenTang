import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';

export type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive';

export type ButtonSize = 'sm' | 'default' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  onPress,
  disabled,
  loading,
  style,
  icon,
}) => {
  const variantStyle = styles[variant] || styles.default;
  const sizeStyle = sizeStyles[size] || sizeStyles.default;
  const textColor = textStyles[variant] || textStyles.default;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyle,
        sizeStyle,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'default' ? '#FFFFFF' : '#18181B'}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          {typeof children === 'string' ? (
            <Text style={[styles.text, textColor, textSizeStyles[size]]}>
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: 6,
  },
  text: {
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  default: {
    backgroundColor: '#18181B', // Zinc 900
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  secondary: {
    backgroundColor: '#F4F4F5', // Zinc 100
  },
  outline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7', // Zinc 200
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: '#EF4444',
  },
  disabled: {
    opacity: 0.5,
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  default: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  lg: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
});

const textSizeStyles = StyleSheet.create({
  sm: {
    fontSize: 13,
  },
  default: {
    fontSize: 14,
  },
  lg: {
    fontSize: 15,
  },
});

const textStyles = StyleSheet.create({
  default: {
    color: '#FAFAFA',
  },
  secondary: {
    color: '#18181B',
  },
  outline: {
    color: '#09090B',
  },
  ghost: {
    color: '#09090B',
  },
  destructive: {
    color: '#FFFFFF',
  },
});
