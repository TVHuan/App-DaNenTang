import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  User,
  Mail,
  Phone,
  School,
  GraduationCap,
  Award,
  Edit3,
  ChevronRight,
  BookOpen,
  Sparkles,
  Save,
  X,
} from 'lucide-react-native';

import { useApp } from '../context/AppContext';
import { RootStackParamList, AcademicResult } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { student, academicResults, updateStudentProfile } = useApp();

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFullName, setEditFullName] = useState(student.fullName);
  const [editEmail, setEditEmail] = useState(student.email);
  const [editPhone, setEditPhone] = useState(student.phone);

  const handleOpenEdit = () => {
    setEditFullName(student.fullName);
    setEditEmail(student.email);
    setEditPhone(student.phone);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!editFullName.trim()) {
      Alert.alert('Lỗi', 'Họ và tên không được để trống!');
      return;
    }
    if (!editEmail.trim() || !editEmail.includes('@')) {
      Alert.alert('Lỗi', 'Email không đúng định dạng!');
      return;
    }
    if (!editPhone.trim() || editPhone.trim().length < 9) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ!');
      return;
    }

    await updateStudentProfile({
      fullName: editFullName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
    });

    setIsEditModalOpen(false);
    Alert.alert('Thành công', 'Thông tin cá nhân đã được cập nhật!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            <Avatar name={student.fullName} size={64} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{student.fullName}</Text>
              <Text style={styles.profileMssv}>MSSV: {student.mssv}</Text>
              <Text style={styles.profileMajor}>
                {student.major} • {student.cohort}
              </Text>
            </View>
          </View>

          <Button
            variant="outline"
            size="sm"
            style={styles.editBtn}
            icon={<Edit3 size={14} color="#09090B" />}
            onPress={handleOpenEdit}
          >
            Chỉnh sửa thông tin liên hệ
          </Button>
        </Card>

        {/* Academic Overview Box (GPA & Tín chỉ tích lũy) */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>GPA Học kỳ</Text>
            <View style={styles.statValRow}>
              <Text style={styles.statNum}>{student.gpa.toFixed(2)}</Text>
              <Text style={styles.statMax}>/10</Text>
            </View>
            <Badge variant="success" style={{ marginTop: 4 }}>
              <Text style={styles.statBadgeText}>Xuất sắc</Text>
            </Badge>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Tín chỉ tích lũy</Text>
            <View style={styles.statValRow}>
              <Text style={styles.statNum}>{student.accumulatedCredits}</Text>
              <Text style={styles.statMax}>TC</Text>
            </View>
            <Badge variant="secondary" style={{ marginTop: 4 }}>
              <Text style={styles.statBadgeText}>Tiến độ 75%</Text>
            </Badge>
          </View>
        </View>

        {/* Thông tin chi tiết */}
        <Text style={styles.sectionTitle}>Thông tin cá nhân & Liên hệ</Text>
        <Card style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.labelGroup}>
              <School size={15} color="#71717A" style={{ marginRight: 8 }} />
              <Text style={styles.infoLabel}>Lớp sinh hoạt:</Text>
            </View>
            <Text style={styles.infoVal}>{student.className}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.labelGroup}>
              <GraduationCap size={15} color="#71717A" style={{ marginRight: 8 }} />
              <Text style={styles.infoLabel}>Ngành đào tạo:</Text>
            </View>
            <Text style={styles.infoVal}>{student.major}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.labelGroup}>
              <Mail size={15} color="#71717A" style={{ marginRight: 8 }} />
              <Text style={styles.infoLabel}>Email:</Text>
            </View>
            <Text style={[styles.infoVal, { color: '#2563EB' }]}>
              {student.email}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.labelGroup}>
              <Phone size={15} color="#71717A" style={{ marginRight: 8 }} />
              <Text style={styles.infoLabel}>Số điện thoại:</Text>
            </View>
            <Text style={styles.infoVal}>{student.phone}</Text>
          </View>
        </Card>

        {/* Danh sách kết quả học tập các môn học */}
        <Text style={styles.sectionTitle}>
          Kết quả học tập môn học ({academicResults.length})
        </Text>
        {academicResults.map((result) => (
          <TouchableOpacity
            key={result.id}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate('AcademicResultDetail', { resultId: result.id })
            }
          >
            <Card style={styles.resultCard}>
              <View style={styles.resultCardInner}>
                <View style={styles.resultLeftCol}>
                  <View style={styles.resultCodeRow}>
                    <Text style={styles.resultCode}>{result.subjectCode}</Text>
                    <Badge variant="secondary" style={styles.resultCreditsBadge}>
                      <Text style={styles.resultCreditsText}>
                        {result.credits} tín chỉ
                      </Text>
                    </Badge>
                  </View>
                  <Text style={styles.resultName} numberOfLines={1}>
                    {result.subjectName}
                  </Text>
                  <Text style={styles.resultSubInfo}>
                    Giữa kỳ: {result.midtermScore} • Cuối kỳ: {result.finalScore}
                  </Text>
                </View>

                <View style={styles.resultRightCol}>
                  <Text style={styles.resultTotalScore}>
                    {result.totalScore.toFixed(1)}
                  </Text>
                  <View style={styles.letterBadge}>
                    <Text style={styles.letterText}>{result.letterGrade}</Text>
                  </View>
                  <ChevronRight size={16} color="#A1A1AA" style={{ marginTop: 2 }} />
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chỉnh sửa thông tin</Text>
              <TouchableOpacity
                onPress={() => setIsEditModalOpen(false)}
                style={styles.closeBtn}
              >
                <X size={20} color="#71717A" />
              </TouchableOpacity>
            </View>

            <Input
              label="Họ và tên"
              value={editFullName}
              onChangeText={setEditFullName}
              placeholder="Nhập họ và tên..."
            />

            <Input
              label="Email"
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Nhập địa chỉ email..."
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Số điện thoại"
              value={editPhone}
              onChangeText={setEditPhone}
              placeholder="Nhập số điện thoại..."
              keyboardType="phone-pad"
            />

            <View style={styles.modalBtnRow}>
              <Button
                variant="outline"
                style={{ flex: 1, marginRight: 8 }}
                onPress={() => setIsEditModalOpen(false)}
              >
                Huỷ bỏ
              </Button>
              <Button
                variant="default"
                style={{ flex: 1 }}
                onPress={handleSaveProfile}
                icon={<Save size={16} color="#FAFAFA" />}
              >
                Lưu thay đổi
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    padding: 18,
    marginBottom: 16,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#09090B',
    letterSpacing: -0.3,
  },
  profileMssv: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 2,
  },
  profileMajor: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
  },
  editBtn: {
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E4E4E7',
    marginHorizontal: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#71717A',
  },
  statValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
    color: '#09090B',
  },
  statMax: {
    fontSize: 12,
    color: '#71717A',
    marginLeft: 2,
  },
  statBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#09090B',
    marginTop: 4,
    marginBottom: 8,
  },
  card: {
    padding: 14,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: '#71717A',
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#09090B',
  },
  resultCard: {
    padding: 12,
    marginBottom: 8,
  },
  resultCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultLeftCol: {
    flex: 1,
  },
  resultCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  resultCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 6,
  },
  resultCreditsBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  resultCreditsText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#71717A',
  },
  resultName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#09090B',
    marginBottom: 2,
  },
  resultSubInfo: {
    fontSize: 11,
    color: '#71717A',
  },
  resultRightCol: {
    alignItems: 'center',
    marginLeft: 10,
  },
  resultTotalScore: {
    fontSize: 16,
    fontWeight: '800',
    color: '#09090B',
  },
  letterBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  letterText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#09090B',
  },
  closeBtn: {
    padding: 4,
  },
  modalBtnRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
});
