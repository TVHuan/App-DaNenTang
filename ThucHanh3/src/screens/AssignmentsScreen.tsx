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
  ClipboardCheck,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  ChevronRight,
  Calendar,
} from 'lucide-react-native';

import { useApp } from '../context/AppContext';
import { RootStackParamList, Assignment, AssignmentStatus } from '../types';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';

export const AssignmentsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { assignments, toggleAssignmentStatus } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const statusTabs = [
    { id: 'ALL', label: 'Tất cả', count: assignments.length },
    {
      id: 'pending',
      label: 'Chưa xong',
      count: assignments.filter((a) => a.status !== 'completed').length,
    },
    {
      id: 'completed',
      label: 'Đã hoàn thành',
      count: assignments.filter((a) => a.status === 'completed').length,
    },
  ];

  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.subjectCode.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.subjectName.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchStatus =
        selectedStatus === 'ALL' ||
        (selectedStatus === 'pending' && item.status !== 'completed') ||
        (selectedStatus === 'completed' && item.status === 'completed');

      return matchSearch && matchStatus;
    });
  }, [assignments, searchQuery, selectedStatus]);

  const renderAssignmentCard = ({ item }: { item: Assignment }) => {
    const isCompleted = item.status === 'completed';
    const isOverdue = item.dueDaysLeft < 0 && !isCompleted;
    const isDueSoon = item.dueDaysLeft >= 0 && item.dueDaysLeft <= 3 && !isCompleted;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate('AssignmentDetail', { assignmentId: item.id })
        }
      >
        <Card
          style={[
            styles.card,
            isOverdue && styles.cardOverdue,
            isDueSoon && styles.cardDueSoon,
            isCompleted && styles.cardCompleted,
          ]}
        >
          <View style={styles.cardHeader}>
            <TouchableOpacity
              onPress={() => toggleAssignmentStatus(item.id)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.checkBtn}
            >
              {isCompleted ? (
                <CheckCircle2 size={24} color="#10B981" />
              ) : (
                <Circle size={24} color={isOverdue ? '#EF4444' : '#A1A1AA'} />
              )}
            </TouchableOpacity>

            <View style={styles.titleInfo}>
              <View style={styles.metaRow}>
                <Text style={styles.subjectCode}>{item.subjectCode}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.weightText}>{item.weight}</Text>
              </View>

              <Text
                style={[
                  styles.titleText,
                  isCompleted && styles.titleCompleted,
                ]}
                numberOfLines={2}
              >
                {item.title}
              </Text>
            </View>

            <ChevronRight size={18} color="#A1A1AA" />
          </View>

          <View style={styles.footerRow}>
            <View style={styles.dueRow}>
              <Clock
                size={13}
                color={isOverdue ? '#EF4444' : isDueSoon ? '#D97706' : '#71717A'}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.dueText,
                  isOverdue && styles.dueTextOverdue,
                  isDueSoon && styles.dueTextDueSoon,
                ]}
              >
                Hạn nộp: {item.dueDate} ({item.dueTime})
              </Text>
            </View>

            <Badge
              variant={
                isCompleted
                  ? 'success'
                  : isOverdue
                  ? 'destructive'
                  : isDueSoon
                  ? 'warning'
                  : 'secondary'
              }
            >
              <Text style={styles.badgeText}>
                {isCompleted
                  ? 'Đã hoàn thành'
                  : isOverdue
                  ? 'Quá hạn nộp'
                  : isDueSoon
                  ? item.dueDaysLeft === 0
                    ? 'Hạn chót hôm nay'
                    : `Còn ${item.dueDaysLeft} ngày`
                  : 'Đang thực hiện'}
              </Text>
            </Badge>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <ClipboardCheck size={22} color="#18181B" style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>Nhiệm vụ & Bài tập</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Theo dõi hạn nộp và cập nhật trạng thái bài tập
        </Text>
      </View>

      <View style={styles.searchSection}>
        <Input
          placeholder="Tìm bài tập theo tên hoặc mã môn..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          isSearch
          containerStyle={styles.searchInput}
        />
        <Tabs
          items={statusTabs}
          activeId={selectedStatus}
          onSelect={setSelectedStatus}
        />
      </View>

      <FlatList
        data={filteredAssignments}
        keyExtractor={(item) => item.id}
        renderItem={renderAssignmentCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <CheckCircle2 size={36} color="#10B981" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>Không có bài tập nào</Text>
            <Text style={styles.emptyDesc}>
              Bạn không có bài tập nào phù hợp với bộ lọc hiện tại.
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
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  searchInput: {
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 12,
    padding: 14,
  },
  cardOverdue: {
    borderColor: '#FECACA',
    backgroundColor: '#FFFBFB',
  },
  cardDueSoon: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFFFA',
  },
  cardCompleted: {
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkBtn: {
    marginRight: 12,
    marginTop: 2,
  },
  titleInfo: {
    flex: 1,
    marginRight: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  subjectCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  metaDot: {
    marginHorizontal: 5,
    color: '#A1A1AA',
  },
  weightText: {
    fontSize: 11,
    color: '#71717A',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#09090B',
    lineHeight: 20,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#A1A1AA',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueText: {
    fontSize: 12,
    color: '#71717A',
  },
  dueTextOverdue: {
    color: '#DC2626',
    fontWeight: '600',
  },
  dueTextDueSoon: {
    color: '#D97706',
    fontWeight: '600',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
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
