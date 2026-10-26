import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { formatDateTime } from '../../utils/date';
import colors from '../../theme/colors';
import typography from '../../theme/typography';

export interface LastUpdatedTextProps {
  timestamp?: string | number | Date | null;
  style?: TextStyle;
}

export default function LastUpdatedText({
  timestamp,
  style,
}: LastUpdatedTextProps) {
  if (!timestamp) {
    return null;
  }

  const formatted = formatDateTime(timestamp);
  if (!formatted) {
    return null;
  }

  return (
    <Text style={[styles.text, style]}>
      Cập nhật lần cuối: {formatted}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});
