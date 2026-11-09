import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <WifiOff size={16} color={colors.offlineText} style={styles.icon} />
      <Text style={styles.text}>Bạn đang offline</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.offlineBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.offlineBorder,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  icon: {
    marginRight: spacing.xs,
  },
  text: {
    ...typography.caption,
    color: colors.offlineText,
    fontWeight: '600',
  },
});
