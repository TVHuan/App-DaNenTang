import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  User,
  Hash,
  Calendar,
  Mail,
  Phone,
  School,
  Building2,
  Award,
  Plus,
} from 'lucide-react-native';

import { useStudents } from '../context/StudentContext';
import { RootStackParamList } from '../types/navigation';
import { Gender, getClassification } from '../types/student';
import { Header } from '../components/Header';
import { InputField } from '../components/InputField';
import { GenderSelector } from '../components/GenderSelector';
import { Badge } from '../components/Badge';

export const AddStudentScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { addStudent } = useStudents();

  // Form State
  const [mssv, setMssv] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender>('Nam');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [className, setClassName] = useState('');
  const [faculty, setFaculty] = useState('');
  const [gpaText, setGpaText] = useState('');

  // Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Dynamic preview classification
  const gpaNumber = parseFloat(gpaText);
  const liveClassification =
    !isNaN(gpaNumber) && gpaNumber >= 0 && gpaNumber <= 10
      ? getClassification(gpaNumber)
      : null;

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!mssv.trim()) {
      newErrors.mssv = 'Vui lòng nhập mã số sinh viên';
    } else if (mssv.trim().length < 4) {
      newErrors.mssv = 'MSSV phải có ít nhất 4 ký tự';
    }

    if (!fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!dob.trim()) {
      newErrors.dob = 'Vui lòng nhập ngày sinh';
    } else {
      const dobRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      if (!dobRegex.test(dob.trim())) {
        newErrors.dob = 'Định dạng ngày sinh phải là DD/MM/YYYY';
      }
    }

    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Email không đúng định dạng';
      }
    }

    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{9,11}$/.test(phone.trim())) {
      newErrors.phone = 'Số điện thoại phải từ 9-11 chữ số';
    }

    if (!className.trim()) {
      newErrors.className = 'Vui lòng nhập lớp';
    }

    if (!faculty.trim()) {
      newErrors.faculty = 'Vui lòng nhập khoa';
    }

    if (!gpaText.trim()) {
      newErrors.gpa = 'Vui lòng nhập điểm GPA';
    } else {
      const gpa = parseFloat(gpaText);
      if (isNaN(gpa) || gpa < 0 || gpa > 10) {
        newErrors.gpa = 'Điểm GPA phải nằm trong khoảng 0.0 đến 10.0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setMssv('');
    setFullName('');
    setDob('');
    setGender('Nam');
    setEmail('');
    setPhone('');
    setClassName('');
    setFaculty('');
    setGpaText('');
    setErrors({});
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('StudentListTab');
    }
  };

  const handleSave = () => {
    if (!validate()) {
      Alert.alert('Lỗi xác thực', 'Vui lòng kiểm tra lại các trường thông tin màu đỏ.');
      return;
    }

    const result = addStudent({
      mssv: mssv.trim(),
      fullName: fullName.trim(),
      dob: dob.trim(),
      gender,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      className: className.trim().toUpperCase(),
      faculty: faculty.trim(),
      gpa: parseFloat(gpaText),
    });

    if (!result.success) {
      Alert.alert('Không thể lưu', result.message || 'Đã có lỗi xảy ra');
      return;
    }

    Alert.alert('Thành công', 'Đã thêm sinh viên mới thành công!', [
      {
        text: 'OK',
        onPress: () => {
          resetForm();
          handleBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Thêm sinh viên mới"
        subtitle="Điền đầy đủ thông tin để tạo hồ sơ"
        onBack={navigation.canGoBack() ? handleBack : undefined}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card: Thông tin cơ bản */}
          <View style={styles.formCard}>
            <View style={styles.cardHeader}>
              <User size={16} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
            </View>

            <InputField
              label="Mã số sinh viên"
              placeholder="Ví dụ: 21110007"
              value={mssv}
              onChangeText={(text) => {
                setMssv(text);
                if (errors.mssv) setErrors((prev) => ({ ...prev, mssv: '' }));
              }}
              error={errors.mssv}
              required
              autoCapitalize="characters"
              prefixIcon={<Hash size={17} color="#64748B" />}
            />

            <InputField
              label="Họ và tên"
              placeholder="Ví dụ: Nguyễn Văn A"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
              }}
              error={errors.fullName}
              required
              autoCapitalize="words"
              prefixIcon={<User size={17} color="#64748B" />}
            />

            <GenderSelector
              label="Giới tính"
              selected={gender}
              onSelect={setGender}
              required
            />

            <InputField
              label="Ngày sinh (DD/MM/YYYY)"
              placeholder="Ví dụ: 15/03/2003"
              value={dob}
              onChangeText={(text) => {
                setDob(text);
                if (errors.dob) setErrors((prev) => ({ ...prev, dob: '' }));
              }}
              error={errors.dob}
              required
              keyboardType="numbers-and-punctuation"
              prefixIcon={<Calendar size={17} color="#64748B" />}
              helperText="Định dạng chuẩn: ngày/tháng/năm"
            />
          </View>

          {/* Card: Liên hệ */}
          <View style={styles.formCard}>
            <View style={styles.cardHeader}>
              <Mail size={16} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Thông tin liên hệ</Text>
            </View>

            <InputField
              label="Email"
              placeholder="Ví dụ: student@email.edu.vn"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              error={errors.email}
              required
              keyboardType="email-address"
              autoCapitalize="none"
              prefixIcon={<Mail size={17} color="#64748B" />}
            />

            <InputField
              label="Số điện thoại"
              placeholder="Ví dụ: 0912345678"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
              }}
              error={errors.phone}
              required
              keyboardType="phone-pad"
              prefixIcon={<Phone size={17} color="#64748B" />}
              maxLength={11}
            />
          </View>

          {/* Card: Thông tin học tập & GPA */}
          <View style={styles.formCard}>
            <View style={styles.cardHeader}>
              <School size={16} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Thông tin học vụ</Text>
            </View>

            <InputField
              label="Lớp"
              placeholder="Ví dụ: 21CNTT1"
              value={className}
              onChangeText={(text) => {
                setClassName(text);
                if (errors.className) setErrors((prev) => ({ ...prev, className: '' }));
              }}
              error={errors.className}
              required
              autoCapitalize="characters"
              prefixIcon={<School size={17} color="#64748B" />}
            />

            <InputField
              label="Khoa"
              placeholder="Ví dụ: Công nghệ thông tin"
              value={faculty}
              onChangeText={(text) => {
                setFaculty(text);
                if (errors.faculty) setErrors((prev) => ({ ...prev, faculty: '' }));
              }}
              error={errors.faculty}
              required
              prefixIcon={<Building2 size={17} color="#64748B" />}
            />

            <InputField
              label="Điểm GPA (Thang điểm 10)"
              placeholder="Ví dụ: 8.5"
              value={gpaText}
              onChangeText={(text) => {
                setGpaText(text);
                if (errors.gpa) setErrors((prev) => ({ ...prev, gpa: '' }));
              }}
              error={errors.gpa}
              required
              keyboardType="numeric"
              prefixIcon={<Award size={17} color="#2563EB" />}
              helperText="Nhập từ 0.0 đến 10.0"
            />

            {/* Live Classification Preview */}
            {liveClassification && (
              <View style={styles.previewBox}>
                <Text style={styles.previewLabel}>Dự kiến xếp loại học lực:</Text>
                <Badge classification={liveClassification} size="md" />
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Plus size={18} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 6 }} />
            <Text style={styles.submitBtnText}>Thêm sinh viên</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  previewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  previewLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  submitBtn: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
