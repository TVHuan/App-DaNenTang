import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CloudOff } from 'lucide-react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export interface SyncBadgeProps {
  pending?: boolean;
}

export default function SyncBadge({ pending }: SyncBadgeProps) {
  if (!pending) {
    return null;
  }

  return (
    <View style={styles.badge} accessibilityLabel="Chưa đồng bộ">
      <CloudOff size={12} color={colors.warning} style={styles.icon} />
      <Text style={styles.text}>Chưa đồng bộ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: colors.warning,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    ...typography.badge,
    color: '#B45309', // Amber 700
  },
});
