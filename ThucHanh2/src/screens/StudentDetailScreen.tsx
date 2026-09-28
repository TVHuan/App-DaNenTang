import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  GraduationCap,
  User,
  Building2,
  School,
  Award,
  Calendar,
  Users,
  Mail,
  Phone,
  Trash2,
  Pencil,
} from 'lucide-react-native';

import { RootStackParamList, getClassification } from '../types/student';
import { useStudents } from '../context/StudentContext';
import { Header } from '../components/Header';
import { Badge } from '../components/Badge';
import { ConfirmModal } from '../components/ConfirmModal';

type Props = NativeStackScreenProps<RootStackParamList, 'StudentDetail'>;

export const StudentDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { studentId } = route.params;
  const { getStudentById, deleteStudent } = useStudents();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const student = getStudentById(studentId);

  if (!student) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Chi tiết sinh viên" onBack={() => navigation.goBack()} />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>Sinh viên không tồn tại hoặc đã bị xoá</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Quay lại danh sách</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const classification = getClassification(student.gpa);

  const handleDelete = () => {
    deleteStudent(student.id);
    setShowDeleteModal(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Chi tiết sinh viên"
        subtitle={`MSSV: ${student.mssv}`}
        onBack={() => navigation.goBack()}
        rightAction={{
          label: 'Sửa',
          icon: <Pencil size={13} color="#2563EB" />,
          onPress: () => navigation.navigate('EditStudent', { studentId: student.id }),
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarBig}>
            <Text style={styles.avatarBigText}>
              {student.fullName
                .trim()
                .split(/\s+/)
                .slice(-1)[0][0]
                .toUpperCase()}
            </Text>
          </View>
          <Text style={styles.profileName}>{student.fullName}</Text>
          <View style={styles.mssvPill}>
            <Text style={styles.mssvPillText}>Mã số SV: {student.mssv}</Text>
          </View>

          <View style={styles.badgeRow}>
            <Badge classification={classification} size="md" />
          </View>
        </View>

        {/* Section: Academic Info (Thông tin học tập) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconBg}>
              <GraduationCap size={16} color="#2563EB" />
            </View>
            <Text style={styles.sectionTitle}>Thông tin học vụ</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.rowLabelGroup}>
              <Building2 size={15} color="#64748B" style={styles.rowIcon} />
              <Text style={styles.infoLabel}>Khoa</Text>
            </View>
            <Text style={styles.infoValue}>{student.faculty}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.rowLabelGroup}>
              <School size={15} color="#64748B" style={styles.rowIcon} />
              <Text style={styles.infoLabel}>Lớp sinh hoạt</Text>
            </View>
            <Text style={styles.infoValue}>{student.className}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.rowLabelGroup}>
              <Award size={15} color="#2563EB" style={styles.rowIcon} />
              <Text style={styles.infoLabel}>Điểm GPA tích luỹ</Text>
            </View>
            <View style={styles.gpaPill}>
              <Text style={styles.gpaPillText}>{student.gpa.toFixed(2)} / 10</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.rowLabelGroup}>
              <Award size={15} color="#10B981" style={styles.rowIcon} />
              <Text style={styles.infoLabel}>Xếp loại học lực</Text>
            </View>
            <Text style={[styles.infoValue, { fontWeight: '700' }]}>{classification}</Text>
          </View>
        </View>

        {/* Section: Personal Info (Thông tin cá nhân & liên hệ) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconBg}>
              <User size={16} color="#2563EB" />
            </View>
            <Text style={styles.sectionTitle}>Thông tin cá nhân & Liên hệ</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.rowLabelGroup}>
              <Calendar size={15} color="#64748B" style={styles.rowIcon} />
              <Text style={styles.infoLabel}>Ngày sinh</Text>
            </View>
            <Text style={styles.infoValue}>{student.dob || 'Chưa cập nhật'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.rowLabelGroup}>
              <Users size={15} color="#64748B" style={styles.rowIcon} />
              <Text style={styles.infoLabel}>Giới tính</Text>
            </View>
            <Text style={styles.infoValue}>{student.gender}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.rowLabelGroup}>
              <Mail size={15} color="#64748B" style={styles.rowIcon} />
              <Text style={styles.infoLabel}>Email sinh viên</Text>
            </View>
            <Text style={[styles.infoValue, styles.linkText]}>{student.email}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.rowLabelGroup}>
              <Phone size={15} color="#64748B" style={styles.rowIcon} />
              <Text style={styles.infoLabel}>Số điện thoại</Text>
            </View>
            <Text style={styles.infoValue}>{student.phone || 'Chưa cập nhật'}</Text>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setShowDeleteModal(true)}
            activeOpacity={0.7}
          >
            <Trash2 size={16} color="#DC2626" style={{ marginRight: 6 }} />
            <Text style={styles.deleteButtonText}>Xoá sinh viên</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditStudent', { studentId: student.id })}
            activeOpacity={0.8}
          >
            <Pencil size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.editButtonText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <ConfirmModal
        visible={showDeleteModal}
        title="Xác nhận xoá sinh viên"
        message={`Bạn có chắc chắn muốn xoá sinh viên "${student.fullName}" (MSSV: ${student.mssv}) khỏi hệ thống không? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xoá vĩnh viễn"
        cancelLabel="Huỷ"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundTitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarBig: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarBigText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  mssvPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  mssvPillText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionIconBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
  rowLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    maxWidth: '65%',
    textAlign: 'right',
  },
  linkText: {
    color: '#2563EB',
  },
  gpaPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  gpaPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingVertical: 14,
  },
  deleteButtonText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '600',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
