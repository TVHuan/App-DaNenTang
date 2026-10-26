import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import ScreenContainer from '../../components/common/ScreenContainer';
import DaySelector from '../../components/schedule/DaySelector';
import SessionCard from '../../components/schedule/SessionCard';
import LoadingView from '../../components/common/LoadingView';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import spacing from '../../theme/spacing';

export default function ScheduleScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { sessions, loading, lastUpdated, reloadAll } = useAppData();

  // Xác định ngày hôm nay trong tuần theo quy ước đề bài (2 = Thứ 2 ... 8 = Chủ nhật)
  const defaultDay = useMemo(() => {
    const jsDay = new Date().getDay();
    return jsDay === 0 ? 8 : jsDay + 1;
  }, []);

  const [selectedDay, setSelectedDay] = useState<number>(defaultDay);

  const filteredSessions = useMemo(() => {
    return sessions
      .filter((s) => Number(s.dayOfWeek) === selectedDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [sessions, selectedDay]);

  if (loading && sessions.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải thời khóa biểu…" />
      </ScreenContainer>
    );
  }

  const dayName = selectedDay === 8 ? 'Chủ nhật' : `Thứ ${selectedDay}`;

  return (
    <ScreenContainer>
      <View style={styles.headerSection}>
        <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />
        <View style={styles.lastUpdatedRow}>
          <LastUpdatedText timestamp={lastUpdated} />
        </View>
      </View>

      <FlatList
        data={filteredSessions}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={reloadAll}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() =>
              navigation.navigate(ROUTES.SESSION_DETAIL, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title={`Không có lịch học ${dayName}`}
            description="Bạn không có buổi học nào được sắp xếp vào ngày này."
            actionLabel="Tải lại lịch"
            onAction={reloadAll}
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    paddingTop: spacing.sm,
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
});
