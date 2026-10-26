import React, { useState, useMemo, useLayoutEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import ScreenContainer from '../../components/common/ScreenContainer';
import GpaSummary from '../../components/grade/GpaSummary';
import FilterChips, { FilterOption } from '../../components/common/FilterChips';
import GradeRow from '../../components/grade/GradeRow';
import LoadingView from '../../components/common/LoadingView';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import { useAppData } from '../../context/AppDataContext';
import { calcGpa } from '../../utils/gpa';
import { ROUTES } from '../../navigation/routes';
import spacing from '../../theme/spacing';

export default function GradeListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { grades, courses, loading, lastUpdated, reloadAll } = useAppData();

  const [selectedSemester, setSelectedSemester] = useState<string>('ALL');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Kết quả học tập',
      headerShown: true,
      headerBackTitle: 'Quay lại',
    });
  }, [navigation]);

  // Bộ lọc học kỳ
  const semesterOptions: FilterOption[] = useMemo(() => {
    const list = Array.from(new Set(grades.map((g) => g.semester).filter(Boolean)));
    return [
      { label: 'Tất cả học kỳ', value: 'ALL' },
      ...list.map((s) => ({ label: s, value: s })),
    ];
  }, [grades]);

  // Lọc điểm theo học kỳ
  const filteredGrades = useMemo(() => {
    if (selectedSemester === 'ALL') return grades;
    return grades.filter((g) => g.semester === selectedSemester);
  }, [grades, selectedSemester]);

  // Tính GPA cho danh sách đang lọc
  const gpaStats = useMemo(() => {
    return calcGpa(filteredGrades, courses);
  }, [filteredGrades, courses]);

  if (loading && grades.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải bảng điểm…" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.topSection}>
        <GpaSummary gpa={gpaStats.gpa} totalCredits={gpaStats.totalCredits} />
        <FilterChips
          options={semesterOptions}
          selected={selectedSemester}
          onSelect={setSelectedSemester}
          style={styles.chips}
        />
        <View style={styles.lastUpdatedRow}>
          <LastUpdatedText timestamp={lastUpdated} />
        </View>
      </View>

      <FlatList
        data={filteredGrades}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={reloadAll}
        renderItem={({ item }) => (
          <GradeRow
            grade={item}
            onPress={() =>
              navigation.navigate(ROUTES.GRADE_DETAIL, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Chưa có kết quả học tập"
            description="Chưa có dữ liệu điểm cho học kỳ đã chọn."
            actionLabel="Tải lại bảng điểm"
            onAction={reloadAll}
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topSection: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  chips: {
    marginBottom: spacing.xs,
  },
  lastUpdatedRow: {
    marginBottom: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
});
