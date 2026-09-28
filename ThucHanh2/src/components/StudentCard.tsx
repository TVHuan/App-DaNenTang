import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Building2, School, Award } from 'lucide-react-native';
import { Student, getClassification } from '../types/student';
import { Badge } from './Badge';

interface StudentCardProps {
  student: Student;
  onPress: () => void;
}

const AVATAR_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
];

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

export const StudentCard: React.FC<StudentCardProps> = ({ student, onPress }) => {
  const classification = getClassification(student.gpa);
  const initials = getInitials(student.fullName);
  const avatarColor = getAvatarColor(student.fullName);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        {/* Student Name & MSSV */}
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {student.fullName}
            </Text>
            <ChevronRight size={18} color="#94A3B8" />
          </View>

          <View style={styles.subRow}>
            <View style={styles.mssvBadge}>
              <Text style={styles.mssvText}>{student.mssv}</Text>
            </View>
            <Text style={styles.dotSeparator}>•</Text>
            <School size={12} color="#64748B" style={styles.classIcon} />
            <Text style={styles.className}>{student.className}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Card Footer: Faculty & GPA / Rank */}
      <View style={styles.cardFooter}>
        <View style={styles.facultyContainer}>
          <Building2 size={13} color="#94A3B8" style={{ marginRight: 5 }} />
          <Text style={styles.facultyText} numberOfLines={1}>
            {student.faculty}
          </Text>
        </View>

        <View style={styles.gpaContainer}>
          <View style={styles.gpaBox}>
            <Award size={11} color="#2563EB" style={{ marginRight: 3 }} />
            <Text style={styles.gpaLabel}>GPA</Text>
            <Text style={styles.gpaValue}>{student.gpa.toFixed(1)}</Text>
          </View>
          <Badge classification={classification} size="sm" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  mssvBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mssvText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  dotSeparator: {
    marginHorizontal: 6,
    color: '#CBD5E1',
  },
  classIcon: {
    marginRight: 4,
  },
  className: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  facultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  facultyText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  gpaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gpaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  gpaLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2563EB',
    marginRight: 4,
  },
  gpaValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E40AF',
  },
});
