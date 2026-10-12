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
  Award,
  BookOpen,
  CheckCircle,
  FileText,
  PieChart,
} from 'lucide-react-native';

import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

type DetailRouteProp = RouteProp<RootStackParamList, 'AcademicResultDetail'>;

export const AcademicResultDetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { resultId } = route.params;

  const { getResultById, getSubjectById } = useApp();
  const result = getResultById(resultId);

  if (!result) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Không tìm thấy kết quả học tập!</Text>
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

  const subject = getSubjectById(result.subjectId);

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
          Chi tiết kết quả học tập
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Score Hero Card */}
        <Card style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <Text style={styles.subjectCode}>{result.subjectCode}</Text>
            <Badge variant="success">
              <Text style={styles.badgeText}>Đạt học phần</Text>
            </Badge>
          </View>

          <Text style={styles.subjectName}>{result.subjectName}</Text>
          <Text style={styles.semesterText}>{result.semester} • {result.credits} Tín chỉ</Text>

          <View style={styles.scoreRow}>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Tổng kết hệ 10</Text>
              <Text style={styles.scoreNumber}>{result.totalScore.toFixed(1)}</Text>
            </View>

            <View style={styles.scoreDivider} />

            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Thang điểm 4</Text>
              <Text style={styles.scoreNumber}>{result.fourPointScore.toFixed(1)}</Text>
            </View>

            <View style={styles.scoreDivider} />

            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Điểm chữ</Text>
              <Text style={[styles.scoreNumber, { color: '#10B981' }]}>
                {result.letterGrade}
              </Text>
            </View>
          </View>
        </Card>

        {/* Bảng điểm thành phần chi tiết */}
        <Text style={styles.sectionTitle}>Bảng điểm thành phần</Text>
        <Card style={styles.card}>
          <View style={styles.componentRow}>
            <View style={styles.componentLabelGroup}>
              <Text style={styles.componentName}>Điểm Chuyên cần (10%)</Text>
              <Text style={styles.componentDesc}>Đánh giá thái độ và điểm danh học phần</Text>
            </View>
            <Text style={styles.componentScore}>{result.attendanceScore.toFixed(1)}</Text>
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.componentRow}>
            <View style={styles.componentLabelGroup}>
              <Text style={styles.componentName}>Điểm Giữa kỳ (20%)</Text>
              <Text style={styles.componentDesc}>Kiểm tra tiến độ giữa học kỳ</Text>
            </View>
            <Text style={styles.componentScore}>{result.midtermScore.toFixed(1)}</Text>
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.componentRow}>
            <View style={styles.componentLabelGroup}>
              <Text style={styles.componentName}>Điểm Bài tập / Thực hành (20%)</Text>
              <Text style={styles.componentDesc}>Tổng hợp các bài lab và đồ án nhỏ</Text>
            </View>
            <Text style={styles.componentScore}>{result.assignmentScore.toFixed(1)}</Text>
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.componentRow}>
            <View style={styles.componentLabelGroup}>
              <Text style={styles.componentName}>Điểm Cuối kỳ (50%)</Text>
              <Text style={styles.componentDesc}>Thi kết thúc học phần / Bảo vệ đồ án</Text>
            </View>
            <Text style={styles.componentScore}>{result.finalScore.toFixed(1)}</Text>
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
            Xem chi tiết môn học {subject.code}
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
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subjectCode: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#09090B',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  semesterText: {
    fontSize: 12,
    color: '#71717A',
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F5',
    borderRadius: 14,
    padding: 12,
  },
  scoreBox: {
    flex: 1,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 11,
    color: '#71717A',
  },
  scoreNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#09090B',
    marginTop: 2,
  },
  scoreDivider: {
    width: 1,
    backgroundColor: '#E4E4E7',
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#09090B',
    marginTop: 4,
    marginBottom: 8,
  },
  card: {
    padding: 14,
    marginBottom: 14,
  },
  componentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  componentLabelGroup: {
    flex: 1,
  },
  componentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#09090B',
  },
  componentDesc: {
    fontSize: 11,
    color: '#71717A',
    marginTop: 2,
  },
  componentScore: {
    fontSize: 16,
    fontWeight: '700',
    color: '#09090B',
    marginLeft: 12,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F4F4F5',
    marginVertical: 6,
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
