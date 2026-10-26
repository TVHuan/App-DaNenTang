import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Award, BookOpen, CheckCircle, AlertCircle } from 'lucide-react-native';

import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import { gradeService, Grade } from '../../api/gradeService';
import { useAppData } from '../../context/AppDataContext';
import { toScale4 } from '../../utils/gpa';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function GradeDetailScreen() {
  const route = useRoute<RouteProp<{ params: { id: number | string } }, 'params'>>();
  const navigation = useNavigation();
  const { id } = route.params;

  const { getGradeById } = useAppData();

  const [grade, setGrade] = useState<Grade | null>(() => getGradeById(id) || null);
  const [loading, setLoading] = useState<boolean>(!grade);
  const [error, setError] = useState<string | null>(null);

  const fetchGrade = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await gradeService.getById(id);
      setGrade(data);
    } catch (err: any) {
      if (!grade) {
        setError(err.message || 'Không thể tải chi tiết điểm môn học.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrade();
  }, [id]);

  // Cập nhật tiêu đề Header bằng tên môn học
  useLayoutEffect(() => {
    if (grade?.course?.name) {
      navigation.setOptions({
        title: grade.course.name,
        headerShown: true,
        headerBackTitle: 'Quay lại',
      });
    }
  }, [navigation, grade?.course?.name]);

  if (loading && !grade) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết điểm…" />
      </ScreenContainer>
    );
  }

  if (error && !grade) {
    return (
      <ScreenContainer>
        <ErrorView message={error} onRetry={fetchGrade} />
      </ScreenContainer>
    );
  }

  const { scale4, letter } = toScale4(grade?.total || 0);
  const isPassed = letter !== 'F';

  return (
    <ScreenContainer scroll>
      <View style={styles.content}>
        {/* Card tổng kết môn học */}
        <View style={styles.card}>
          <Text style={styles.courseTitle}>
            {grade?.course?.name || 'Môn học'}
          </Text>
          <Text style={styles.courseSubtitle}>
            Mã môn: {grade?.course?.code || 'N/A'} • {grade?.course?.credits || 3} tín chỉ • {grade?.semester}
          </Text>

          {/* Huy hiệu điểm tổng kết */}
          <View style={styles.scoreHighlight}>
            <View style={styles.scoreCol}>
              <Text style={styles.scoreNumber}>
                {grade?.total ? grade.total.toFixed(2) : '0.00'}
              </Text>
              <Text style={styles.scoreSub}>Điểm hệ 10</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.scoreCol}>
              <Text style={styles.scoreNumber}>{scale4.toFixed(1)}</Text>
              <Text style={styles.scoreSub}>Điểm hệ 4</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.scoreCol}>
              <View
                style={[
                  styles.letterBadge,
                  isPassed ? styles.badgePassed : styles.badgeFailed,
                ]}
              >
                <Text
                  style={[
                    styles.letterText,
                    isPassed ? styles.textPassed : styles.textFailed,
                  ]}
                >
                  {letter}
                </Text>
              </View>
              <Text style={styles.scoreSub}>Điểm chữ</Text>
            </View>
          </View>
        </View>

        {/* Bảng chi tiết thành phần điểm */}
        <View style={styles.card}>
          <Text style={styles.tableTitle}>Thành phần đánh giá</Text>

          <View style={styles.scoreRow}>
            <Text style={styles.componentName}>Điểm chuyên cần (10%)</Text>
            <Text style={styles.componentScore}>{grade?.attendance.toFixed(1)}</Text>
          </View>

          <View style={styles.scoreRow}>
            <Text style={styles.componentName}>Điểm kiểm tra giữa kỳ (30%)</Text>
            <Text style={styles.componentScore}>{grade?.midterm.toFixed(1)}</Text>
          </View>

          <View style={styles.scoreRow}>
            <Text style={styles.componentName}>Điểm thi kết thúc học phần (60%)</Text>
            <Text style={styles.componentScore}>{grade?.final.toFixed(1)}</Text>
          </View>

          <View style={[styles.scoreRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Điểm trung bình học phần</Text>
            <Text style={styles.totalScore}>{grade?.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Trạng thái tích lũy tín chỉ */}
        <View style={styles.statusBox}>
          {isPassed ? (
            <View style={styles.statusInner}>
              <CheckCircle size={20} color={colors.success} style={styles.statusIcon} />
              <Text style={styles.statusText}>
                Học phần đã hoàn thành và được tính vào số tín chỉ tích lũy.
              </Text>
            </View>
          ) : (
            <View style={styles.statusInner}>
              <AlertCircle size={20} color={colors.danger} style={styles.statusIcon} />
              <Text style={[styles.statusText, { color: colors.danger }]}>
                Môn học điểm F không được tính vào số tín chỉ tích lũy.
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.base,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  courseTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 4,
  },
  courseSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.base,
  },
  scoreHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.base,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreCol: {
    flex: 1,
    alignItems: 'center',
  },
  scoreNumber: {
    ...typography.h1,
    color: colors.text,
    fontWeight: '800',
  },
  scoreSub: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  letterBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgePassed: {
    backgroundColor: colors.primaryLight,
  },
  badgeFailed: {
    backgroundColor: colors.dangerLight,
  },
  letterText: {
    ...typography.h2,
    fontWeight: '800',
  },
  textPassed: {
    color: colors.primary,
  },
  textFailed: {
    color: colors.danger,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  tableTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.base,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  componentName: {
    ...typography.body,
    color: colors.textSecondary,
  },
  componentScore: {
    ...typography.bodyBold,
    color: colors.text,
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: spacing.base,
  },
  totalLabel: {
    ...typography.subtitle,
    fontWeight: '700',
    color: colors.text,
  },
  totalScore: {
    ...typography.h2,
    fontWeight: '800',
    color: colors.primary,
  },
  statusBox: {
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: spacing.sm,
  },
  statusText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
});
