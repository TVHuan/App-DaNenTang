import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import ScreenContainer from '../../components/common/ScreenContainer';
import SearchBar from '../../components/common/SearchBar';
import FilterChips from '../../components/common/FilterChips';
import CourseCard from '../../components/course/CourseCard';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import spacing from '../../theme/spacing';

export default function CourseListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { courses, loading, lastUpdated, reloadAll } = useAppData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('ALL');

  // Trích xuất danh sách học kỳ duy nhất cho FilterChips
  const semesterOptions = useMemo(() => {
    const semesters = Array.from(new Set(courses.map((c) => c.semester).filter(Boolean)));
    return [
      { label: 'Tất cả học kỳ', value: 'ALL' },
      ...semesters.map((s) => ({ label: s, value: s })),
    ];
  }, [courses]);

  // Lọc theo tìm kiếm và học kỳ
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchSearch =
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSemester =
        selectedSemester === 'ALL' || course.semester === selectedSemester;
      return matchSearch && matchSemester;
    });
  }, [courses, searchQuery, selectedSemester]);

  if (loading && courses.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải danh sách môn học…" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.filterSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm theo tên môn hoặc mã môn…"
        />
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
        data={filteredCourses}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={reloadAll}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() =>
              navigation.navigate(ROUTES.COURSE_DETAIL, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Không tìm thấy môn học nào"
            description={
              searchQuery || selectedSemester !== 'ALL'
                ? 'Không có môn học nào khớp với bộ lọc hoặc từ khóa tìm kiếm.'
                : 'Chưa có dữ liệu môn học.'
            }
            actionLabel={searchQuery || selectedSemester !== 'ALL' ? 'Xóa bộ lọc' : 'Tải lại'}
            onAction={
              searchQuery || selectedSemester !== 'ALL'
                ? () => {
                    setSearchQuery('');
                    setSelectedSemester('ALL');
                  }
                : reloadAll
            }
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filterSection: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  chips: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  lastUpdatedRow: {
    marginTop: 4,
    marginBottom: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
});
