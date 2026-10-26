import React, { useState, useLayoutEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import {
  validateFullName,
  validateEmail,
  validatePhone,
} from '../../utils/validators';
import spacing from '../../theme/spacing';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { student, updateStudentProfile } = useAppData();

  const [fullName, setFullName] = useState(student?.fullName || '');
  const [email, setEmail] = useState(student?.email || '');
  const [phone, setPhone] = useState(student?.phone || '');

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Chỉnh sửa thông tin',
      headerShown: true,
      headerBackTitle: 'Quay lại',
    });
  }, [navigation]);

  const handleSave = async () => {
    const nameVal = validateFullName(fullName);
    const emailVal = validateEmail(email);
    const phoneVal = validatePhone(phone);

    if (!nameVal.isValid || !emailVal.isValid || !phoneVal.isValid) {
      setErrors({
        fullName: nameVal.error,
        email: emailVal.error,
        phone: phoneVal.error,
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await updateStudentProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể cập nhật thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.form}>
        <FormInput
          label="Mã sinh viên"
          value={student?.studentCode || ''}
          onChangeText={() => {}}
          editable={false}
        />

        <FormInput
          label="Lớp sinh hoạt"
          value={student?.className || ''}
          onChangeText={() => {}}
          editable={false}
        />

        <FormInput
          label="Họ và tên *"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Nhập họ và tên đầy đủ…"
          error={errors.fullName}
        />

        <FormInput
          label="Email *"
          value={email}
          onChangeText={setEmail}
          placeholder="Nhập địa chỉ email…"
          keyboardType="email-address"
          error={errors.email}
        />

        <FormInput
          label="Số điện thoại *"
          value={phone}
          onChangeText={setPhone}
          placeholder="Nhập số điện thoại…"
          keyboardType="phone-pad"
          error={errors.phone}
        />

        <View style={styles.buttonContainer}>
          <AppButton
            title="Lưu thông tin"
            onPress={handleSave}
            loading={loading}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
});
