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
  BookOpen,
  Calendar,
  ClipboardList,
  Award,
  Mail,
  Phone,
  Building,
  Clock,
  ChevronRight,
  CheckCircle2,
  Circle,
} from 'lucide-react-native';

import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Separator } from '../components/ui/Progress';

type DetailRouteProp = RouteProp<RootStackParamList, 'SubjectDetail'>;

export const SubjectDetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { subjectId } = route.params;

  const {
    getSubjectById,
    schedules,
    assignments,
    academicResults,
    toggleAssignmentStatus,
  } = useApp();

  const subject = getSubjectById(subjectId);

  if (!subject) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Không tìm thấy môn học!</Text>
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

  // Related schedules for this subject
  const relatedSchedules = schedules.filter((s) => s.subjectId === subject.id);

  // Related assignments for this subject
  const relatedAssignments = assignments.filter((a) => a.subjectId === subject.id);

  // Related academic result for this subject
  const relatedResult = academicResults.find((r) => r.subjectId === subject.id);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navigation Bar */}
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
          Chi tiết môn học
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Subject Hero Card */}
        <Card style={styles.heroCard}>
          <View style={styles.heroCodeRow}>
            <View style={[styles.colorBox, { backgroundColor: subject.color }]}>
              <BookOpen size={20} color="#FFFFFF" />
            </View>
            <View style={styles.heroCodeGroup}>
              <Text style={styles.heroCode}>{subject.code}</Text>
              <Text style={styles.heroSemester}>{subject.semester}</Text>
            </View>
            <Badge variant="default" style={styles.creditsBadge}>
              <Text style={styles.creditsBadgeText}>{subject.credits} Tín chỉ</Text>
            </Badge>
          </View>

          <Text style={styles.heroName}>{subject.name}</Text>
          {subject.description && (
            <Text style={styles.heroDesc}>{subject.description}</Text>
          )}

          <View style={styles.heroProgressSection}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Tiến độ học tập</Text>
              <Text style={styles.progressVal}>{subject.progress}%</Text>
            </View>
            <Progress value={subject.progress} color={subject.color} />
          </View>
        </Card>

        {/* Section 1: Thông tin Giảng viên & Phòng học */}
        <Text style={styles.sectionHeaderTitle}>Thông tin giảng dạy</Text>
        <Card style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Giảng viên phụ trách:</Text>
            <Text style={styles.infoValue}>{subject.instructor}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email liên hệ:</Text>
            <Text style={[styles.infoValue, { color: '#2563EB' }]}>
              {subject.instructorEmail}
            </Text>
          </View>
          {subject.instructorPhone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số điện thoại:</Text>
              <Text style={styles.infoValue}>{subject.instructorPhone}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phòng học thường trực:</Text>
            <Text style={styles.infoValue}>{subject.classroom}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Lịch học:</Text>
            <Text style={styles.infoValue}>{subject.scheduleDesc}</Text>
          </View>
        </Card>

        {/* Section 2: Lịch học liên quan */}
        <Text style={styles.sectionHeaderTitle}>
          Lịch học trong tuần ({relatedSchedules.length})
        </Text>
        {relatedSchedules.length === 0 ? (
          <Card style={styles.emptyBox}>
            <Text style={styles.emptyBoxText}>Chưa có lịch học nào</Text>
          </Card>
        ) : (
          relatedSchedules.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('ScheduleDetail', { sessionId: item.id })
              }
            >
              <Card style={styles.scheduleItemCard}>
                <View style={styles.scheduleItemRow}>
                  <View style={styles.scheduleDayBadge}>
                    <Text style={styles.scheduleDayText}>{item.dayName}</Text>
                  </View>
                  <View style={styles.scheduleItemInfo}>
                    <Text style={styles.scheduleTime}>
                      {item.startTime} - {item.endTime}
                    </Text>
                    <Text style={styles.scheduleRoom}>
                      Phòng {item.room} • GV: {item.instructor}
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#A1A1AA" />
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}

        {/* Section 3: Danh sách bài tập liên quan */}
        <Text style={styles.sectionHeaderTitle}>
          Danh sách bài tập ({relatedAssignments.length})
        </Text>
        {relatedAssignments.length === 0 ? (
          <Card style={styles.emptyBox}>
            <Text style={styles.emptyBoxText}>Không có bài tập cho môn này</Text>
          </Card>
        ) : (
          relatedAssignments.map((task) => {
            const isCompleted = task.status === 'completed';
            return (
              <TouchableOpacity
                key={task.id}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('AssignmentDetail', { assignmentId: task.id })
                }
              >
                <Card style={styles.taskItemCard}>
                  <View style={styles.taskItemRow}>
                    <TouchableOpacity
                      onPress={() => toggleAssignmentStatus(task.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={{ marginRight: 10 }}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={20} color="#10B981" />
                      ) : (
                        <Circle size={20} color="#A1A1AA" />
                      )}
                    </TouchableOpacity>
                    <View style={styles.taskItemInfo}>
                      <Text
                        style={[
                          styles.taskItemTitle,
                          isCompleted && styles.taskCompletedText,
                        ]}
                        numberOfLines={1}
                      >
                        {task.title}
                      </Text>
                      <Text style={styles.taskItemDue}>
                        Hạn nộp: {task.dueDate} ({task.dueTime}) • {task.weight}
                      </Text>
                    </View>
                    <Badge
                      variant={isCompleted ? 'success' : task.dueDaysLeft <= 3 ? 'destructive' : 'secondary'}
                    >
                      <Text style={{ fontSize: 10, fontWeight: '600' }}>
                        {isCompleted ? 'Đã nộp' : `Còn ${task.dueDaysLeft}d`}
                      </Text>
                    </Badge>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })
        )}

        {/* Section 4: Kết quả học tập liên quan */}
        <Text style={styles.sectionHeaderTitle}>Kết quả học tập môn</Text>
        {relatedResult ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate('AcademicResultDetail', {
                resultId: relatedResult.id,
              })
            }
          >
            <Card style={styles.card}>
              <View style={styles.resultRow}>
                <View>
                  <Text style={styles.resultScoreTitle}>Điểm tổng kết</Text>
                  <Text style={styles.resultScoreValue}>
                    {relatedResult.totalScore.toFixed(1)} / 10
                  </Text>
                  <Text style={styles.resultScoreSub}>
                    Thang 4: {relatedResult.fourPointScore.toFixed(1)}
                  </Text>
                </View>

                <View style={styles.letterGradeBox}>
                  <Text style={styles.letterGradeText}>
                    {relatedResult.letterGrade}
                  </Text>
                  <Badge variant="success" style={{ marginTop: 4 }}>
                    <Text style={{ fontSize: 10, color: '#047857' }}>Đạt học phần</Text>
                  </Badge>
                </View>
              </View>

              <View style={styles.resultDetailRow}>
                <Text style={styles.resultItemText}>
                  Chuyên cần: <Text style={{ fontWeight: '700' }}>{relatedResult.attendanceScore}</Text>
                </Text>
                <Text style={styles.resultItemText}>
                  Giữa kỳ: <Text style={{ fontWeight: '700' }}>{relatedResult.midtermScore}</Text>
                </Text>
                <Text style={styles.resultItemText}>
                  Cuối kỳ: <Text style={{ fontWeight: '700' }}>{relatedResult.finalScore}</Text>
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ) : (
          <Card style={styles.emptyBox}>
            <Text style={styles.emptyBoxText}>Điểm học phần chưa công bố</Text>
          </Card>
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
    padding: 16,
    marginBottom: 16,
  },
  heroCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  heroCodeGroup: {
    flex: 1,
  },
  heroCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#09090B',
  },
  heroSemester: {
    fontSize: 11,
    color: '#71717A',
  },
  creditsBadge: {
    backgroundColor: '#18181B',
  },
  creditsBadgeText: {
    color: '#FAFAFA',
    fontSize: 11,
    fontWeight: '600',
  },
  heroName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#09090B',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  heroDesc: {
    fontSize: 13,
    color: '#52525B',
    lineHeight: 18,
    marginBottom: 12,
  },
  heroProgressSection: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  progressRow: {
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
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#09090B',
    marginTop: 10,
    marginBottom: 8,
  },
  card: {
    padding: 14,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  infoLabel: {
    fontSize: 13,
    color: '#71717A',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#09090B',
    maxWidth: '60%',
    textAlign: 'right',
  },
  scheduleItemCard: {
    padding: 12,
    marginBottom: 8,
  },
  scheduleItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleDayBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  scheduleDayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  scheduleItemInfo: {
    flex: 1,
  },
  scheduleTime: {
    fontSize: 13,
    fontWeight: '700',
    color: '#09090B',
  },
  scheduleRoom: {
    fontSize: 11,
    color: '#71717A',
    marginTop: 2,
  },
  taskItemCard: {
    padding: 12,
    marginBottom: 8,
  },
  taskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskItemInfo: {
    flex: 1,
    marginRight: 8,
  },
  taskItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#09090B',
  },
  taskCompletedText: {
    textDecorationLine: 'line-through',
    color: '#A1A1AA',
  },
  taskItemDue: {
    fontSize: 11,
    color: '#71717A',
    marginTop: 2,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultScoreTitle: {
    fontSize: 12,
    color: '#71717A',
  },
  resultScoreValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#09090B',
  },
  resultScoreSub: {
    fontSize: 11,
    color: '#71717A',
  },
  letterGradeBox: {
    alignItems: 'center',
  },
  letterGradeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#10B981',
  },
  resultDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  resultItemText: {
    fontSize: 12,
    color: '#52525B',
  },
  emptyBox: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  emptyBoxText: {
    fontSize: 12,
    color: '#A1A1AA',
    fontStyle: 'italic',
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
