import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
}: AppButtonProps) {
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';

  const buttonStyles = [
    styles.button,
    isOutline && styles.outlineButton,
    isDanger && styles.dangerButton,
    (disabled || loading) && styles.disabledButton,
    style,
  ];

  const labelStyles = [
    styles.text,
    isOutline && styles.outlineText,
    isDanger && styles.dangerText,
    (disabled || loading) && styles.disabledText,
    textStyle,
  ];

  const spinnerColor = isOutline ? colors.primary : colors.textInverse;

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <Text style={labelStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dangerButton: {
    backgroundColor: colors.danger,
  },
  disabledButton: {
    opacity: 0.6,
  },
  text: {
    ...typography.bodyBold,
    color: colors.textInverse,
    textAlign: 'center',
  },
  outlineText: {
    color: colors.primary,
  },
  dangerText: {
    color: colors.textInverse,
  },
  disabledText: {
    opacity: 0.8,
  },
});
