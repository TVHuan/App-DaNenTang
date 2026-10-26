import React, { useState, useMemo, useLayoutEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';

import ScreenContainer from '../../components/common/ScreenContainer';
import FilterChips, { FilterOption } from '../../components/common/FilterChips';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import LoadingView from '../../components/common/LoadingView';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import { isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

const FILTER_OPTIONS: FilterOption[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Chưa xong', value: 'TODO' },
  { label: 'Đã xong', value: 'DONE' },
  { label: 'Quá hạn', value: 'OVERDUE' },
];

export default function AssignmentListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { assignments, loading, lastUpdated, reloadAll, toggleAssignmentStatus } = useAppData();

  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  // Thêm nút "Thêm" trên Header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate(ROUTES.ASSIGNMENT_FORM)}
          accessibilityRole="button"
          accessibilityLabel="Thêm bài tập mới"
        >
          <Plus size={20} color={colors.primary} />
          <Text style={styles.addButtonText}>Thêm</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const overdue = item.status !== 'done' && isOverdue(item.dueDate);
      if (selectedFilter === 'TODO') return item.status === 'todo' && !overdue;
      if (selectedFilter === 'DONE') return item.status === 'done';
      if (selectedFilter === 'OVERDUE') return overdue;
      return true; // 'ALL'
    });
  }, [assignments, selectedFilter]);

  if (loading && assignments.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải danh sách bài tập…" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.headerSection}>
        <FilterChips
          options={FILTER_OPTIONS}
          selected={selectedFilter}
          onSelect={setSelectedFilter}
          style={styles.chips}
        />
        <View style={styles.lastUpdatedRow}>
          <LastUpdatedText timestamp={lastUpdated} />
        </View>
      </View>

      <FlatList
        data={filteredAssignments}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={reloadAll}
        renderItem={({ item }) => (
          <AssignmentItem
            assignment={item}
            pending={item._pending}
            onPress={() =>
              navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: item.id })
            }
            onToggleStatus={() => toggleAssignmentStatus(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Không có bài tập nào"
            description={
              selectedFilter !== 'ALL'
                ? 'Không có bài tập nào thuộc danh mục lọc này.'
                : 'Bạn chưa có bài tập nào được giao.'
            }
            actionLabel="Thêm bài tập mới"
            onAction={() => navigation.navigate(ROUTES.ASSIGNMENT_FORM)}
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  chips: {
    marginBottom: spacing.xs,
  },
  lastUpdatedRow: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    marginRight: spacing.sm,
    minHeight: 36,
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: '700',
    marginLeft: 2,
    fontSize: 13,
  },
});
