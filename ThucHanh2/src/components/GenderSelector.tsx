import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Gender } from '../types/student';

interface GenderSelectorProps {
  label: string;
  selected: Gender;
  onSelect: (gender: Gender) => void;
  required?: boolean;
}

const GENDERS: { value: Gender; label: string; icon: string }[] = [
  { value: 'Nam', label: 'Nam', icon: '♂' },
  { value: 'Nữ', label: 'Nữ', icon: '♀' },
  { value: 'Khác', label: 'Khác', icon: '⚧' },
];

export const GenderSelector: React.FC<GenderSelectorProps> = ({
  label,
  selected,
  onSelect,
  required,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.requiredStar}>*</Text>}
      </Text>
      <View style={styles.row}>
        {GENDERS.map((item) => {
          const isSelected = selected === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              style={[styles.button, isSelected && styles.buttonSelected]}
              onPress={() => onSelect(item.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.genderIcon, isSelected && styles.genderIconSelected]}
              >
                {item.icon}
              </Text>
              <Text
                style={[styles.buttonText, isSelected && styles.buttonTextSelected]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  requiredStar: {
    color: '#EF4444',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  buttonSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  genderIcon: {
    fontSize: 16,
    marginRight: 6,
    color: '#64748B',
    fontWeight: '700',
  },
  genderIconSelected: {
    color: '#2563EB',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  buttonTextSelected: {
    color: '#2563EB',
    fontWeight: '700',
  },
});
