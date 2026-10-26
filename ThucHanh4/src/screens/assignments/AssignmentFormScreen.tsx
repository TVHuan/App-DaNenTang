import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { validateTitle, validateDueDate, validateCourseId } from '../../utils/validators';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function AssignmentFormScreen() {
  const navigation = useNavigation();
  const { courses, createAssignment } = useAppData();

  const [title, setTitle] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<number | string>(
    courses[0]?.id || ''
  );
  // Mặc định hạn nộp là 7 ngày sau hôm nay (YYYY-MM-DD)
  const defaultDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState<{
    title?: string;
    dueDate?: string;
    courseId?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Thêm bài tập mới',
      headerShown: true,
      headerBackTitle: 'Quay lại',
    });
  }, [navigation]);

  const handleSubmit = async () => {
    const titleVal = validateTitle(title);
    const dueDateIso = `${dueDate}T23:59:00Z`;
    const dueDateVal = validateDueDate(dueDateIso);
    const courseVal = validateCourseId(selectedCourseId);

    if (!titleVal.isValid || !dueDateVal.isValid || !courseVal.isValid) {
      setErrors({
        title: titleVal.error,
        dueDate: dueDateVal.error,
        courseId: courseVal.error,
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await createAssignment({
        courseId: selectedCourseId,
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDateIso,
      });

      Alert.alert('Thành công', 'Đã thêm bài tập mới thành công.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể tạo bài tập mới.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.formContainer}>
        {/* Chọn môn học */}
        <Text style={styles.label}>Môn học *</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.courseScroll}
          contentContainerStyle={styles.courseScrollContent}
        >
          {courses.map((course) => {
            const isSelected = String(course.id) === String(selectedCourseId);
            return (
              <TouchableOpacity
                key={course.id}
                style={[styles.courseChip, isSelected && styles.courseChipSelected]}
                onPress={() => setSelectedCourseId(course.id)}
                accessibilityRole="button"
                accessibilityLabel={`Chọn môn ${course.name}`}
              >
                <Text
                  style={[
                    styles.courseChipText,
                    isSelected && styles.courseChipTextSelected,
                  ]}
                >
                  {course.code} - {course.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {errors.courseId ? (
          <Text style={styles.errorText}>{errors.courseId}</Text>
        ) : null}

        {/* Tiêu đề bài tập */}
        <FormInput
          label="Tiêu đề bài tập *"
          value={title}
          onChangeText={setTitle}
          placeholder="Nhập tiêu đề bài tập…"
          error={errors.title}
        />

        {/* Hạn nộp */}
        <FormInput
          label="Hạn nộp (YYYY-MM-DD) *"
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="Ví dụ: 2026-11-15"
          error={errors.dueDate}
        />

        {/* Mô tả */}
        <FormInput
          label="Mô tả chi tiết"
          value={description}
          onChangeText={setDescription}
          placeholder="Nhập yêu cầu, tiêu chí chấm điểm, lưu ý…"
          multiline
          numberOfLines={4}
        />

        <View style={styles.submitSection}>
          <AppButton
            title="Lưu bài tập"
            onPress={handleSubmit}
            loading={loading}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  label: {
    ...typography.subtitle,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  courseScroll: {
    marginBottom: spacing.base,
    maxHeight: 46,
  },
  courseScrollContent: {
    paddingVertical: 2,
  },
  courseChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  courseChipText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  courseChipTextSelected: {
    color: colors.textInverse,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  submitSection: {
    marginTop: spacing.lg,
  },
});
