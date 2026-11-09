import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import colors from '../../theme/colors';

interface UserAvatarProps {
  name: string;
  avatarUri?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  showStatus?: boolean;
  style?: ViewStyle;
}

export default function UserAvatar({
  name,
  avatarUri,
  size = 'md',
  isOnline = false,
  showStatus = false,
  style,
}: UserAvatarProps) {
  const dimensions = {
    sm: { container: 36, text: 14, dot: 10, borderWidth: 1.5 },
    md: { container: 48, text: 18, dot: 12, borderWidth: 2 },
    lg: { container: 64, text: 24, dot: 15, borderWidth: 2.5 },
    xl: { container: 88, text: 32, dot: 18, borderWidth: 3 },
  }[size];

  const getInitials = (text: string) => {
    if (!text) return '?';
    const parts = text.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return text.substring(0, 2).toUpperCase();
  };

  const fallbackUri = `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(
    name || 'User'
  )}`;

  return (
    <View style={[styles.wrapper, { width: dimensions.container, height: dimensions.container }, style]}>
      <Image
        source={{ uri: avatarUri || fallbackUri }}
        style={[
          styles.avatar,
          {
            width: dimensions.container,
            height: dimensions.container,
            borderRadius: dimensions.container / 2,
          },
        ]}
      />
      {showStatus && (
        <View
          style={[
            styles.statusDot,
            {
              width: dimensions.dot,
              height: dimensions.dot,
              borderRadius: dimensions.dot / 2,
              borderWidth: dimensions.borderWidth,
              backgroundColor: isOnline ? colors.success : colors.textMuted,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: colors.border,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderColor: colors.surface,
  },
});

