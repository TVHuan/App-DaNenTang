import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle2, Circle } from 'lucide-react-native';
import { AssignmentStatus } from '../../api/assignmentService';
import colors from '../../theme/colors';

export interface StatusToggleProps {
  status: AssignmentStatus;
  onToggle: () => void;
}

export default function StatusToggle({ status, onToggle }: StatusToggleProps) {
  const isDone = status === 'done';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onToggle}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isDone }}
      accessibilityLabel={isDone ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      {isDone ? (
        <CheckCircle2 size={24} color={colors.success} />
      ) : (
        <Circle size={24} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
