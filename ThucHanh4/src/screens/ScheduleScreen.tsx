import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from 'lucide-react-native';

import { useApp } from '../context/AppContext';
import { RootStackParamList, ClassSession } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';

export const ScheduleScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { schedules } = useApp();

  const [selectedDay, setSelectedDay] = useState('ALL');

  const dayTabs = [
    { id: 'ALL', label: 'Cả tuần' },
    { id: '2', label: 'Thứ 2' },
    { id: '3', label: 'Thứ 3' },
    { id: '4', label: 'Thứ 4' },
    { id: '5', label: 'Thứ 5' },
    { id: '6', label: 'Thứ 6' },
    { id: '7', label: 'Thứ 7' },
  ];

  const filteredSchedules = useMemo(() => {
    if (selectedDay === 'ALL') {
      return [...schedules].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
    }
    const dayNum = parseInt(selectedDay, 10);
    return schedules.filter((s) => s.dayOfWeek === dayNum);
  }, [schedules, selectedDay]);

  const renderSessionCard = ({ item }: { item: ClassSession }) => {
    const isFinished = item.status === 'finished';

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate('ScheduleDetail', { sessionId: item.id })
        }
      >
        <Card
          style={[
            styles.card,
            isFinished && styles.cardFinished,
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.dayGroup}>
              <View style={[styles.dayBadge, isFinished ? styles.dayBadgeFinished : styles.dayBadgeActive]}>
                <Text style={[styles.dayText, isFinished ? styles.dayTextFinished : styles.dayTextActive]}>
                  {item.dayName}
                </Text>
              </View>
              <Text style={styles.codeText}>{item.subjectCode}</Text>
            </View>

            <Badge
              variant={isFinished ? 'secondary' : 'default'}
              style={styles.statusBadge}
            >
              <Text style={styles.statusText}>
                {isFinished ? '✓ Đã hoàn thành' : '● Sắp diễn ra'}
              </Text>
            </Badge>
          </View>

          <Text style={[styles.titleText, isFinished && styles.titleFinished]}>
            {item.subjectName}
          </Text>

          <View style={styles.infoRow}>
            <Clock size={13} color="#71717A" style={{ marginRight: 6 }} />
            <Text style={styles.infoText}>
              Thời gian: <Text style={styles.boldText}>{item.startTime} - {item.endTime}</Text>
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MapPin size={13} color="#71717A" style={{ marginRight: 6 }} />
            <Text style={styles.infoText}>
              Phòng học: <Text style={styles.boldText}>{item.room}</Text>
            </Text>
          </View>

          <View style={styles.footerRow}>
            <View style={styles.instructorRow}>
              <User size={13} color="#71717A" style={{ marginRight: 4 }} />
              <Text style={styles.instructorText}>{item.instructor}</Text>
            </View>
            <ChevronRight size={16} color="#A1A1AA" />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Calendar size={22} color="#18181B" style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>Thời khóa biểu tuần</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Lịch học phân bố từ Thứ 2 đến Thứ 7 trong học kỳ
        </Text>
      </View>

      <View style={styles.tabSection}>
        <Tabs
          items={dayTabs}
          activeId={selectedDay}
          onSelect={setSelectedDay}
          scrollable
        />
      </View>

      <FlatList
        data={filteredSchedules}
        keyExtractor={(item) => item.id}
        renderItem={renderSessionCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Calendar size={36} color="#71717A" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>Không có lịch học</Text>
            <Text style={styles.emptyDesc}>
              Bạn không có buổi học nào vào ngày đã chọn.
            </Text>
          </Card>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#09090B',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
  },
  tabSection: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 12,
    padding: 14,
  },
  cardFinished: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E4E4E7',
    opacity: 0.85,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  dayBadgeActive: {
    backgroundColor: '#EFF6FF',
  },
  dayBadgeFinished: {
    backgroundColor: '#F4F4F5',
  },
  dayText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dayTextActive: {
    color: '#2563EB',
  },
  dayTextFinished: {
    color: '#71717A',
  },
  codeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#71717A',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#09090B',
    marginBottom: 8,
  },
  titleFinished: {
    color: '#52525B',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#71717A',
  },
  boldText: {
    fontWeight: '600',
    color: '#09090B',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructorText: {
    fontSize: 12,
    color: '#52525B',
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#09090B',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#71717A',
    textAlign: 'center',
  },
});
