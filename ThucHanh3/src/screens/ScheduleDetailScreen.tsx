import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  FileText,
  Bell,
  CheckCircle,
} from 'lucide-react-native';

import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

type DetailRouteProp = RouteProp<RootStackParamList, 'ScheduleDetail'>;

export const ScheduleDetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { sessionId } = route.params;

  const { getSessionById, getSubjectById } = useApp();
  const session = getSessionById(sessionId);

  if (!session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Không tìm thấy thông tin buổi học!</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const subject = getSubjectById(session.subjectId);
  const isFinished = session.status === 'finished';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navBackBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#09090B" />
          <Text style={styles.navBackText}>Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          Chi tiết buổi học
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Session Hero Card */}
        <Card style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>{session.dayName}</Text>
            </View>
            <Badge variant={isFinished ? 'secondary' : 'default'}>
              <Text style={styles.statusText}>
                {isFinished ? 'Đã diễn ra' : 'Sắp diễn ra'}
              </Text>
            </Badge>
          </View>

          <Text style={styles.subjectCode}>{session.subjectCode}</Text>
          <Text style={styles.subjectName}>{session.subjectName}</Text>

          {/* Time & Room Highlight Box */}
          <View style={styles.highlightBox}>
            <View style={styles.highlightItem}>
              <Clock size={16} color="#2563EB" style={{ marginRight: 6 }} />
              <View>
                <Text style={styles.highlightLabel}>Thời gian</Text>
                <Text style={styles.highlightVal}>
                  {session.startTime} - {session.endTime}
                </Text>
              </View>
            </View>

            <View style={styles.highlightDivider} />

            <View style={styles.highlightItem}>
              <MapPin size={16} color="#10B981" style={{ marginRight: 6 }} />
              <View>
                <Text style={styles.highlightLabel}>Phòng học</Text>
                <Text style={styles.highlightVal}>{session.room}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Thông tin Giảng viên */}
        <Text style={styles.sectionTitle}>Thông tin lớp học</Text>
        <Card style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Giảng viên phụ trách:</Text>
            <Text style={styles.infoVal}>{session.instructor}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã học phần:</Text>
            <Text style={styles.infoVal}>{session.subjectCode}</Text>
          </View>
          {subject && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số tín chỉ:</Text>
              <Text style={styles.infoVal}>{subject.credits} tín chỉ</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái:</Text>
            <Text style={[styles.infoVal, { color: isFinished ? '#71717A' : '#2563EB' }]}>
              {isFinished ? 'Buổi học đã kết thúc' : 'Chưa diễn ra'}
            </Text>
          </View>
        </Card>

        {/* Ghi chú buổi học */}
        <Text style={styles.sectionTitle}>Nội dung & Ghi chú</Text>
        <Card style={styles.card}>
          <View style={styles.notesRow}>
            <FileText size={16} color="#71717A" style={{ marginRight: 8, marginTop: 2 }} />
            <Text style={styles.notesText}>
              {session.notes || 'Không có ghi chú đặc biệt cho buổi học này.'}
            </Text>
          </View>
        </Card>

        {/* Nút xem chi tiết môn học */}
        {subject && (
          <Button
            variant="outline"
            style={{ marginTop: 8 }}
            icon={<BookOpen size={16} color="#09090B" />}
            onPress={() =>
              navigation.navigate('SubjectDetail', { subjectId: subject.id })
            }
          >
            Xem toàn bộ học phần {subject.code}
          </Button>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  navBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  navBackText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#09090B',
    marginLeft: 2,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#09090B',
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    padding: 18,
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dayBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  subjectCode: {
    fontSize: 13,
    fontWeight: '700',
    color: '#71717A',
  },
  subjectName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#09090B',
    marginTop: 2,
    marginBottom: 14,
    letterSpacing: -0.4,
  },
  highlightBox: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  highlightItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightLabel: {
    fontSize: 11,
    color: '#71717A',
  },
  highlightVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#09090B',
    marginTop: 1,
  },
  highlightDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E4E4E7',
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#09090B',
    marginTop: 8,
    marginBottom: 8,
  },
  card: {
    padding: 14,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: '#71717A',
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#09090B',
    maxWidth: '60%',
    textAlign: 'right',
  },
  notesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notesText: {
    fontSize: 13,
    color: '#3F3F46',
    lineHeight: 19,
    flex: 1,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 16,
    color: '#71717A',
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: '#18181B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  backBtnText: {
    color: '#FAFAFA',
    fontWeight: '600',
  },
});
