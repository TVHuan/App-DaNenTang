import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Circle,
  GraduationCap,
  Sparkles,
} from 'lucide-react-native';

import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Progress } from '../components/ui/Progress';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    student,
    subjects,
    todaySessions,
    upcomingAssignments,
    pendingAssignmentsCount,
    toggleAssignmentStatus,
  } = useApp();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: Student Info */}
        <View style={styles.userHeader}>
          <View style={styles.userInfoLeft}>
            <Avatar name={student.fullName} size={48} />
            <View style={styles.userTextGroup}>
              <View style={styles.welcomeRow}>
                <Text style={styles.welcomeText}>Xin chào,</Text>
                <Sparkles size={14} color="#EAB308" style={{ marginLeft: 4 }} />
              </View>
              <Text style={styles.userName}>{student.fullName}</Text>
              <Text style={styles.userMeta}>
                MSSV: {student.mssv} • Lớp: {student.className}
              </Text>
            </View>
          </View>
          <Badge variant="outline" style={styles.semesterBadge}>
            <Text style={styles.semesterText}>{student.currentSemester.split(' - ')[0]}</Text>
          </Badge>
        </View>

        {/* Quick Stats Grid (GPA & Pending Tasks) */}
        <View style={styles.statsGrid}>
          {/* Stat 1: GPA */}
          <View style={[styles.statCard, { borderLeftColor: '#2563EB', borderLeftWidth: 4 }]}>
            <View style={styles.statIconWrapper}>
              <GraduationCap size={18} color="#2563EB" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statNumber}>{student.gpa.toFixed(2)}</Text>
              <Text style={styles.statLabel}>GPA Học kỳ / 10</Text>
            </View>
          </View>

          {/* Stat 2: Pending Assignments */}
          <View style={[styles.statCard, { borderLeftColor: '#F59E0B', borderLeftWidth: 4 }]}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#FEF3C7' }]}>
              <AlertCircle size={18} color="#D97706" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statNumber}>{pendingAssignmentsCount}</Text>
              <Text style={styles.statLabel}>Bài tập cần nộp</Text>
            </View>
          </View>
        </View>

        {/* Section 1: Lịch học hôm nay */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleGroup}>
            <Calendar size={18} color="#18181B" style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>Lịch học hôm nay</Text>
          </View>
          <TouchableOpacity
            onPress={() => (navigation as any).navigate('ScheduleTab')}
            style={styles.seeAllBtn}
          >
            <Text style={styles.seeAllText}>Xem cả tuần</Text>
            <ChevronRight size={14} color="#71717A" />
          </TouchableOpacity>
        </View>

        {todaySessions.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>Hôm nay bạn không có lịch học!</Text>
          </Card>
        ) : (
          todaySessions.map((session) => (
            <TouchableOpacity
              key={session.id}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('ScheduleDetail', { sessionId: session.id })
              }
            >
              <Card style={styles.sessionCard}>
                <View style={styles.sessionCardInner}>
                  <View style={styles.sessionTimeCol}>
                    <Text style={styles.sessionStartTime}>{session.startTime}</Text>
                    <Text style={styles.sessionEndTime}>{session.endTime}</Text>
                    <Badge
                      variant={session.status === 'finished' ? 'secondary' : 'default'}
                      style={styles.sessionStatusBadge}
                    >
                      <Text style={styles.sessionStatusText}>
                        {session.status === 'finished' ? 'Đã học' : 'Sắp tới'}
                      </Text>
                    </Badge>
                  </View>

                  <View style={styles.sessionDivider} />

                  <View style={styles.sessionInfoCol}>
                    <Text style={styles.sessionSubjectCode}>{session.subjectCode}</Text>
                    <Text style={styles.sessionSubjectName} numberOfLines={1}>
                      {session.subjectName}
                    </Text>

                    <View style={styles.sessionMetaRow}>
                      <View style={styles.sessionMetaItem}>
                        <MapPin size={13} color="#71717A" style={{ marginRight: 4 }} />
                        <Text style={styles.sessionMetaText}>{session.room}</Text>
                      </View>
                      <Text style={styles.sessionMetaDot}>•</Text>
                      <Text style={styles.sessionMetaInstructor} numberOfLines={1}>
                        {session.instructor}
                      </Text>
                    </View>
                  </View>

                  <ChevronRight size={18} color="#A1A1AA" />
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}

        {/* Section 2: Bài tập sắp đến hạn */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleGroup}>
            <AlertCircle size={18} color="#D97706" style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>Bài tập sắp đến hạn</Text>
          </View>
          <TouchableOpacity
            onPress={() => (navigation as any).navigate('AssignmentsTab')}
            style={styles.seeAllBtn}
          >
            <Text style={styles.seeAllText}>Tất cả bài tập</Text>
            <ChevronRight size={14} color="#71717A" />
          </TouchableOpacity>
        </View>

        {upcomingAssignments.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>Tất cả bài tập đã được hoàn thành!</Text>
          </Card>
        ) : (
          upcomingAssignments.map((task) => {
            const isDueSoon = task.dueDaysLeft <= 3 && task.status !== 'completed';
            const isCompleted = task.status === 'completed';

            return (
              <TouchableOpacity
                key={task.id}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('AssignmentDetail', { assignmentId: task.id })
                }
              >
                <Card style={styles.taskCard}>
                  <View style={styles.taskRow}>
                    <TouchableOpacity
                      onPress={() => toggleAssignmentStatus(task.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.checkBtn}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={22} color="#10B981" />
                      ) : (
                        <Circle size={22} color="#A1A1AA" />
                      )}
                    </TouchableOpacity>

                    <View style={styles.taskInfo}>
                      <Text
                        style={[
                          styles.taskTitle,
                          isCompleted && styles.taskTitleCompleted,
                        ]}
                        numberOfLines={1}
                      >
                        {task.title}
                      </Text>
                      <Text style={styles.taskSubject}>
                        {task.subjectCode} • Hạn nộp: {task.dueDate} ({task.dueTime})
                      </Text>
                    </View>

                    <Badge
                      variant={isDueSoon ? 'destructive' : isCompleted ? 'success' : 'secondary'}
                    >
                      <Text style={styles.badgeText}>
                        {isCompleted
                          ? 'Đã xong'
                          : task.dueDaysLeft <= 0
                          ? 'Hôm nay'
                          : `Còn ${task.dueDaysLeft} ngày`}
                      </Text>
                    </Badge>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })
        )}

        {/* Section 3: Môn học đang học */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleGroup}>
            <BookOpen size={18} color="#2563EB" style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>Môn học kỳ này ({subjects.length})</Text>
          </View>
          <TouchableOpacity
            onPress={() => (navigation as any).navigate('SubjectsTab')}
            style={styles.seeAllBtn}
          >
            <Text style={styles.seeAllText}>Danh sách môn</Text>
            <ChevronRight size={14} color="#71717A" />
          </TouchableOpacity>
        </View>

        {subjects.map((sub) => (
          <TouchableOpacity
            key={sub.id}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate('SubjectDetail', { subjectId: sub.id })
            }
          >
            <Card style={styles.subjectCard}>
              <View style={styles.subjectCardHeader}>
                <View style={styles.subjectTitleRow}>
                  <View style={[styles.subjectColorDot, { backgroundColor: sub.color }]} />
                  <Text style={styles.subjectCode}>{sub.code}</Text>
                  <Text style={styles.subjectCredits}>{sub.credits} tín chỉ</Text>
                </View>
                <ChevronRight size={18} color="#A1A1AA" />
              </View>

              <Text style={styles.subjectName}>{sub.name}</Text>
              <Text style={styles.subjectInstructor}>GV: {sub.instructor}</Text>

              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Tiến độ học tập</Text>
                <Text style={styles.progressValue}>{sub.progress}%</Text>
              </View>
              <Progress value={sub.progress} color={sub.color} />
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },
  userInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userTextGroup: {
    marginLeft: 12,
    flex: 1,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 12,
    color: '#71717A',
    fontWeight: '500',
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#09090B',
    letterSpacing: -0.3,
  },
  userMeta: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 1,
  },
  semesterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  semesterText: {
    fontSize: 11,
    color: '#18181B',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  statIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#09090B',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    color: '#71717A',
    marginTop: 1,
    fontWeight: '500',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#09090B',
    letterSpacing: -0.3,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  seeAllText: {
    fontSize: 12,
    color: '#71717A',
    fontWeight: '600',
    marginRight: 2,
  },
  emptyCard: {
    padding: 18,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#71717A',
    fontStyle: 'italic',
  },
  sessionCard: {
    marginBottom: 10,
    padding: 12,
  },
  sessionCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionTimeCol: {
    alignItems: 'center',
    width: 60,
  },
  sessionStartTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#09090B',
  },
  sessionEndTime: {
    fontSize: 11,
    color: '#71717A',
    marginTop: 1,
  },
  sessionStatusBadge: {
    marginTop: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  sessionStatusText: {
    fontSize: 9,
    fontWeight: '600',
  },
  sessionDivider: {
    width: 1,
    height: 48,
    backgroundColor: '#E4E4E7',
    marginHorizontal: 12,
  },
  sessionInfoCol: {
    flex: 1,
  },
  sessionSubjectCode: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  sessionSubjectName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#09090B',
    marginVertical: 2,
  },
  sessionMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionMetaText: {
    fontSize: 12,
    color: '#71717A',
    fontWeight: '500',
  },
  sessionMetaDot: {
    marginHorizontal: 6,
    color: '#D4D4D8',
  },
  sessionMetaInstructor: {
    fontSize: 12,
    color: '#71717A',
    flex: 1,
  },
  taskCard: {
    marginBottom: 10,
    padding: 12,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBtn: {
    marginRight: 10,
  },
  taskInfo: {
    flex: 1,
    marginRight: 8,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#09090B',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#A1A1AA',
  },
  taskSubject: {
    fontSize: 11,
    color: '#71717A',
    marginTop: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  subjectCard: {
    marginBottom: 10,
    padding: 14,
  },
  subjectCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  subjectCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 8,
  },
  subjectCredits: {
    fontSize: 11,
    color: '#71717A',
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#09090B',
    marginTop: 6,
  },
  subjectInstructor: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
    marginBottom: 10,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    color: '#71717A',
  },
  progressValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#09090B',
  },
});
