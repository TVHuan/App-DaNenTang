import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileCheck,
  Percent,
  Circle,
} from 'lucide-react-native';

import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

type DetailRouteProp = RouteProp<RootStackParamList, 'AssignmentDetail'>;

export const AssignmentDetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { assignmentId } = route.params;

  const { getAssignmentById, toggleAssignmentStatus } = useApp();
  const assignment = getAssignmentById(assignmentId);

  if (!assignment) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Không tìm thấy bài tập!</Text>
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

  const isCompleted = assignment.status === 'completed';
  const isOverdue = assignment.dueDaysLeft < 0 && !isCompleted;
  const isDueSoon = assignment.dueDaysLeft >= 0 && assignment.dueDaysLeft <= 3 && !isCompleted;

  const handleToggle = () => {
    toggleAssignmentStatus(assignment.id);
    Alert.alert(
      'Cập nhật thành công',
      !isCompleted
        ? 'Đã đánh dấu bài tập là "Đã hoàn thành"!'
        : 'Đã chuyển trạng thái bài tập về "Chưa hoàn thành"!'
    );
  };

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
          Chi tiết bài tập
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Status Hero Card */}
        <Card
          style={[
            styles.heroCard,
            isOverdue && styles.heroCardOverdue,
            isDueSoon && styles.heroCardDueSoon,
          ]}
        >
          <View style={styles.heroTopRow}>
            <Text style={styles.subjectCode}>{assignment.subjectCode}</Text>
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
                  ? 'Sắp đến hạn nộp'
                  : 'Đang thực hiện'}
              </Text>
            </Badge>
          </View>

          <Text style={styles.titleText}>{assignment.title}</Text>
          <Text style={styles.subjectName}>{assignment.subjectName}</Text>

          {/* Due date box */}
          <View
            style={[
              styles.dueBox,
              isOverdue && styles.dueBoxOverdue,
              isDueSoon && styles.dueBoxDueSoon,
            ]}
          >
            <Clock
              size={18}
              color={isOverdue ? '#EF4444' : isDueSoon ? '#D97706' : '#2563EB'}
              style={{ marginRight: 8 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.dueBoxLabel}>Thời hạn nộp bài</Text>
              <Text style={styles.dueBoxVal}>
                {assignment.dueDate} lúc {assignment.dueTime}
              </Text>
            </View>
            <Text
              style={[
                styles.dueBoxRemaining,
                isOverdue && { color: '#DC2626' },
                isDueSoon && { color: '#D97706' },
              ]}
            >
              {isCompleted
                ? 'Đã nộp bài'
                : isOverdue
                ? 'Đã quá hạn'
                : assignment.dueDaysLeft === 0
                ? 'Hạn chót hôm nay'
                : `Còn ${assignment.dueDaysLeft} ngày`}
            </Text>
          </View>
        </Card>

        {/* Mô tả chi tiết */}
        <Text style={styles.sectionTitle}>Mô tả yêu cầu</Text>
        <Card style={styles.card}>
          <Text style={styles.descText}>{assignment.description}</Text>
        </Card>

        {/* Các tiêu chí / Yêu cầu cụ thể */}
        {assignment.requirements && assignment.requirements.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Yêu cầu cần đạt</Text>
            <Card style={styles.card}>
              {assignment.requirements.map((req, idx) => (
                <View key={idx} style={styles.reqRow}>
                  <CheckCircle2
                    size={16}
                    color="#10B981"
                    style={{ marginRight: 8, marginTop: 2 }}
                  />
                  <Text style={styles.reqText}>{req}</Text>
                </View>
              ))}
            </Card>
          </>
        )}

        {/* Thông tin nộp bài & Trọng số điểm */}
        <Text style={styles.sectionTitle}>Quy cách nộp bài</Text>
        <Card style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hình thức nộp:</Text>
            <Text style={styles.infoVal}>{assignment.submissionType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trọng số đánh giá:</Text>
            <Text style={styles.infoVal}>{assignment.weight}</Text>
          </View>
        </Card>

        {/* Action Toggle Button */}
        <Button
          variant={isCompleted ? 'secondary' : 'default'}
          size="lg"
          style={{ marginTop: 12 }}
          icon={
            isCompleted ? (
              <Circle size={18} color="#18181B" />
            ) : (
              <CheckCircle2 size={18} color="#FAFAFA" />
            )
          }
          onPress={handleToggle}
        >
          {isCompleted
            ? 'Đánh dấu lại: Chưa hoàn thành'
            : 'Đánh dấu: Đã hoàn thành bài tập'}
        </Button>
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
  heroCardOverdue: {
    borderColor: '#FECACA',
    backgroundColor: '#FFFBFB',
  },
  heroCardDueSoon: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFFFA',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#09090B',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  subjectName: {
    fontSize: 13,
    color: '#71717A',
    marginBottom: 14,
  },
  dueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    padding: 12,
    borderRadius: 12,
  },
  dueBoxOverdue: {
    backgroundColor: '#FEF2F2',
  },
  dueBoxDueSoon: {
    backgroundColor: '#FFFBEB',
  },
  dueBoxLabel: {
    fontSize: 11,
    color: '#71717A',
  },
  dueBoxVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#09090B',
  },
  dueBoxRemaining: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
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
  descText: {
    fontSize: 14,
    color: '#3F3F46',
    lineHeight: 21,
  },
  reqRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reqText: {
    fontSize: 13,
    color: '#3F3F46',
    flex: 1,
    lineHeight: 18,
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
