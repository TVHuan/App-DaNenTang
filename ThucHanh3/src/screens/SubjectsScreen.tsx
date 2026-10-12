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
  BookOpen,
  ChevronRight,
  GraduationCap,
  Building,
  User,
  SlidersHorizontal,
} from 'lucide-react-native';

import { useApp } from '../context/AppContext';
import { RootStackParamList, Subject } from '../types';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Progress } from '../components/ui/Progress';

export const SubjectsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { subjects } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('ALL');

  const semesterTabs = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'HK1 2024-2025', label: 'HK1 2024-2025' },
    { id: 'HK2 2023-2024', label: 'HK2 2023-2024' },
  ];

  const filteredSubjects = useMemo(() => {
    return subjects.filter((item) => {
      const matchSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.instructor.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchSemester =
        selectedSemester === 'ALL' || item.semester === selectedSemester;

      return matchSearch && matchSemester;
    });
  }, [subjects, searchQuery, selectedSemester]);

  const renderSubjectCard = ({ item }: { item: Subject }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('SubjectDetail', { subjectId: item.id })
      }
    >
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.codeRow}>
            <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
            <Text style={styles.codeText}>{item.code}</Text>
            <Badge variant="secondary" style={styles.creditsBadge}>
              <Text style={styles.creditsText}>{item.credits} tín chỉ</Text>
            </Badge>
          </View>
          <ChevronRight size={18} color="#A1A1AA" />
        </View>

        <Text style={styles.nameText}>{item.name}</Text>

        <View style={styles.infoRow}>
          <User size={13} color="#71717A" style={{ marginRight: 5 }} />
          <Text style={styles.instructorText}>{item.instructor}</Text>
        </View>

        <View style={styles.infoRow}>
          <Building size={13} color="#71717A" style={{ marginRight: 5 }} />
          <Text style={styles.roomText}>Phòng: {item.classroom} • {item.scheduleDesc}</Text>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.progressContainer}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressLabel}>Tiến độ học phần</Text>
              <Text style={styles.progressVal}>{item.progress}%</Text>
            </View>
            <Progress value={item.progress} color={item.color} />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <BookOpen size={22} color="#18181B" style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>Danh sách môn học</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Đang theo học {subjects.length} học phần trong chương trình
        </Text>
      </View>

      <View style={styles.searchSection}>
        <Input
          placeholder="Tìm theo mã môn, tên môn học, giảng viên..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          isSearch
          containerStyle={styles.searchInput}
        />
        <Tabs
          items={semesterTabs}
          activeId={selectedSemester}
          onSelect={setSelectedSemester}
          scrollable
        />
      </View>

      <FlatList
        data={filteredSubjects}
        keyExtractor={(item) => item.id}
        renderItem={renderSubjectCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <GraduationCap size={36} color="#71717A" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>Không tìm thấy môn học nào</Text>
            <Text style={styles.emptyDesc}>
              Hãy thử thay đổi từ khoá tìm kiếm hoặc chuyển sang bộ lọc học kỳ khác.
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  codeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 8,
  },
  creditsBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  creditsText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#18181B',
  },
  nameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#09090B',
    marginTop: 6,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  instructorText: {
    fontSize: 12,
    color: '#52525B',
    fontWeight: '500',
  },
  roomText: {
    fontSize: 12,
    color: '#71717A',
  },
  footerRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  progressContainer: {
    width: '100%',
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 11,
    color: '#71717A',
  },
  progressVal: {
    fontSize: 11,
    fontWeight: '600',
    color: '#09090B',
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
