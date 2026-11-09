import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  BookOpen,
} from 'lucide-react-native';

import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import { sessionService, ClassSession } from '../../api/sessionService';
import { useAppData } from '../../context/AppDataContext';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function SessionDetailScreen() {
  const route = useRoute<RouteProp<{ params: { id: number | string } }, 'params'>>();
  const navigation = useNavigation();
  const { id } = route.params;

  const { getSessionById } = useAppData();

  const [session, setSession] = useState<ClassSession | null>(() => getSessionById(id) || null);
  const [loading, setLoading] = useState<boolean>(!session);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sessionService.getById(id);
      setSession(data);
    } catch (err: any) {
      if (!session) {
        setError(err.message || 'Không thể tải thông tin buổi học.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [id]);

  // Cập nhật tiêu đề Header bằng tên môn hoặc buổi học
  useLayoutEffect(() => {
    const courseTitle = session?.course?.name || 'Chi tiết buổi học';
    navigation.setOptions({
      title: courseTitle,
      headerShown: true,
      headerBackTitle: 'Quay lại',
    });
  }, [navigation, session?.course?.name]);

  if (loading && !session) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết buổi học…" />
      </ScreenContainer>
    );
  }

  if (error && !session) {
    return (
      <ScreenContainer>
        <ErrorView message={error} onRetry={fetchSession} />
      </ScreenContainer>
    );
  }

  const dayText = session?.dayOfWeek === 8 ? 'Chủ nhật' : `Thứ ${session?.dayOfWeek}`;

  return (
    <ScreenContainer scroll>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.courseTitle}>
            {session?.course?.name || 'Môn học'}
          </Text>
          <Text style={styles.courseCode}>Mã môn: {session?.course?.code}</Text>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Calendar size={18} color={colors.primary} style={styles.icon} />
            <Text style={styles.label}>Ngày học:</Text>
            <Text style={styles.value}>{dayText}</Text>
          </View>

          <View style={styles.row}>
            <Clock size={18} color={colors.primary} style={styles.icon} />
            <Text style={styles.label}>Thời gian:</Text>
            <Text style={styles.value}>
              {session?.startTime} - {session?.endTime}
            </Text>
          </View>

          <View style={styles.row}>
            <MapPin size={18} color={colors.secondary} style={styles.icon} />
            <Text style={styles.label}>Phòng học:</Text>
            <Text style={styles.value}>{session?.room}</Text>
          </View>

          <View style={styles.row}>
            <User size={18} color={colors.textSecondary} style={styles.icon} />
            <Text style={styles.label}>Giảng viên:</Text>
            <Text style={styles.value}>
              {session?.course?.lecturer || 'Chưa cập nhật'}
            </Text>
          </View>

          {session?.note ? (
            <View style={styles.noteBox}>
              <View style={styles.noteHeader}>
                <FileText size={16} color={colors.textSecondary} style={styles.icon} />
                <Text style={styles.noteTitle}>Ghi chú chuẩn bị</Text>
              </View>
              <Text style={styles.noteContent}>{session.note}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.base,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
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
  courseCode: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.base,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    marginRight: spacing.sm,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    width: 90,
  },
  value: {
    ...typography.bodyBold,
    color: colors.text,
    flex: 1,
  },
  noteBox: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 10,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  noteTitle: {
    ...typography.subtitle,
    fontWeight: '700',
    color: colors.text,
  },
  noteContent: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
