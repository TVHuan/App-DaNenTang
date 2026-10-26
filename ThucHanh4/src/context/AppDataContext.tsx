import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Alert } from 'react-native';
import { Student, studentService } from '../api/studentService';
import { Course, courseService } from '../api/courseService';
import { ClassSession, sessionService } from '../api/sessionService';
import { Assignment, AssignmentStatus, assignmentService } from '../api/assignmentService';
import { Grade, gradeService } from '../api/gradeService';
import { getCache, setCache } from '../storage/cache';
import { STORAGE_KEYS } from '../storage/keys';
import { enqueue } from '../storage/outbox';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { isDueWithinDays } from '../utils/date';

export interface AppDataContextType {
  student: Student | null;
  courses: Course[];
  sessions: ClassSession[];
  assignments: Assignment[];
  grades: Grade[];
  loading: boolean;
  lastUpdated: string | null;
  reloadAll: () => Promise<void>;
  toggleAssignmentStatus: (id: number | string) => Promise<void>;
  createAssignment: (data: { courseId: number | string; title: string; description: string; dueDate: string }) => Promise<Assignment>;
  updateStudentProfile: (updates: Partial<Student>) => Promise<void>;
  getCourseById: (id: number | string) => Course | undefined;
  getSessionById: (id: number | string) => ClassSession | undefined;
  getAssignmentById: (id: number | string) => Assignment | undefined;
  getGradeById: (id: number | string) => Grade | undefined;
  upcomingAssignments: Assignment[];
  pendingAssignmentsCount: number;
  todaySessions: ClassSession[];
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isOnline } = useNetworkStatus();

  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  /**
   * Tải toàn bộ dữ liệu (ưu tiên đọc cache trước, sau đó gọi API nếu online)
   */
  const reloadAll = useCallback(async () => {
    // 1. Tải cache
    try {
      const [cStudent, cCourses, cSessions, cAssignments, cGrades] = await Promise.all([
        getCache<Student>(STORAGE_KEYS.CACHE_STUDENT),
        getCache<Course[]>(STORAGE_KEYS.CACHE_COURSES),
        getCache<ClassSession[]>(STORAGE_KEYS.CACHE_SESSIONS),
        getCache<Assignment[]>(STORAGE_KEYS.CACHE_ASSIGNMENTS),
        getCache<Grade[]>(STORAGE_KEYS.CACHE_GRADES),
      ]);

      if (cStudent?.data) setStudent(cStudent.data);
      if (cCourses?.data) setCourses(cCourses.data);
      if (cSessions?.data) setSessions(cSessions.data);
      if (cAssignments?.data) setAssignments(cAssignments.data);
      if (cGrades?.data) setGrades(cGrades.data);

      const latestSavedAt = [
        cStudent?.savedAt,
        cCourses?.savedAt,
        cSessions?.savedAt,
        cAssignments?.savedAt,
        cGrades?.savedAt,
      ].filter(Boolean).sort().pop();

      if (latestSavedAt) {
        setLastUpdated(latestSavedAt);
      }
    } catch (e) {
      console.warn('[AppDataContext] Lỗi đọc cache ban đầu:', e);
    } finally {
      setLoading(false);
    }

    // 2. Tải API nếu online
    if (isOnline) {
      try {
        const [rStudent, rCourses, rSessions, rAssignments, rGrades] = await Promise.all([
          studentService.getById(1).catch(() => null),
          courseService.getAll().catch(() => null),
          sessionService.getAll().catch(() => null),
          assignmentService.getAll().catch(() => null),
          gradeService.getAll().catch(() => null),
        ]);

        const now = new Date().toISOString();

        if (rStudent) {
          setStudent(rStudent);
          await setCache(STORAGE_KEYS.CACHE_STUDENT, rStudent);
        }
        if (rCourses) {
          setCourses(rCourses);
          await setCache(STORAGE_KEYS.CACHE_COURSES, rCourses);
        }
        if (rSessions) {
          setSessions(rSessions);
          await setCache(STORAGE_KEYS.CACHE_SESSIONS, rSessions);
        }
        if (rAssignments) {
          setAssignments(rAssignments);
          await setCache(STORAGE_KEYS.CACHE_ASSIGNMENTS, rAssignments);
        }
        if (rGrades) {
          setGrades(rGrades);
          await setCache(STORAGE_KEYS.CACHE_GRADES, rGrades);
        }

        setLastUpdated(now);
      } catch (apiErr) {
        console.warn('[AppDataContext] Lỗi tải dữ liệu từ API:', apiErr);
      }
    }
  }, [isOnline]);

  useEffect(() => {
    reloadAll();
  }, [reloadAll]);

  /**
   * Cập nhật lạc quan (Optimistic update) khi đổi trạng thái bài tập (A6 & B3)
   */
  const toggleAssignmentStatus = async (id: number | string) => {
    const target = assignments.find((a) => String(a.id) === String(id));
    if (!target) return;

    const previousStatus = target.status;
    const newStatus: AssignmentStatus = previousStatus === 'done' ? 'todo' : 'done';
    const nowIso = new Date().toISOString();

    // Cập nhật ngay trên giao diện
    const updatedAssignments = assignments.map((a) =>
      String(a.id) === String(id)
        ? { ...a, status: newStatus, updatedAt: nowIso, _pending: !isOnline }
        : a
    );
    setAssignments(updatedAssignments);
    await setCache(STORAGE_KEYS.CACHE_ASSIGNMENTS, updatedAssignments);

    if (isOnline) {
      try {
        await assignmentService.update(id, { status: newStatus });
      } catch (err) {
        // Hoàn tác nếu API lỗi
        console.warn('[toggleAssignmentStatus] Lỗi API, hoàn tác trạng thái:', err);
        const rolledBack = assignments.map((a) =>
          String(a.id) === String(id) ? { ...a, status: previousStatus } : a
        );
        setAssignments(rolledBack);
        await setCache(STORAGE_KEYS.CACHE_ASSIGNMENTS, rolledBack);
        Alert.alert('Lỗi cập nhật', 'Không thể cập nhật trạng thái bài tập lên máy chủ.');
      }
    } else {
      // Offline -> Đưa vào hàng đợi Outbox
      await enqueue({
        method: 'PATCH',
        url: `/assignments/${id}`,
        body: { status: newStatus, updatedAt: nowIso },
      });
    }
  };

  /**
   * Thêm bài tập mới (A5 & B3)
   */
  const createAssignment = async (data: {
    courseId: number | string;
    title: string;
    description: string;
    dueDate: string;
  }): Promise<Assignment> => {
    const nowIso = new Date().toISOString();
    const course = courses.find((c) => String(c.id) === String(data.courseId));

    if (isOnline) {
      try {
        const created = await assignmentService.create({
          courseId: data.courseId,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          status: 'todo',
        });
        const fullItem: Assignment = { ...created, course };
        const nextList = [fullItem, ...assignments];
        setAssignments(nextList);
        await setCache(STORAGE_KEYS.CACHE_ASSIGNMENTS, nextList);
        return fullItem;
      } catch (err) {
        console.warn('[createAssignment] Lỗi API, chuyển sang lưu offline:', err);
      }
    }

    // Offline hoặc API lỗi: Tạo local item và đưa vào Outbox
    const localId = `local_${Date.now()}`;
    const localItem: Assignment = {
      id: localId,
      courseId: data.courseId,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      status: 'todo',
      updatedAt: nowIso,
      course,
      _pending: true,
    };

    const nextList = [localItem, ...assignments];
    setAssignments(nextList);
    await setCache(STORAGE_KEYS.CACHE_ASSIGNMENTS, nextList);

    await enqueue({
      method: 'POST',
      url: '/assignments',
      body: {
        courseId: data.courseId,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        status: 'todo',
        updatedAt: nowIso,
      },
    });

    return localItem;
  };

  /**
   * Sửa thông tin cá nhân (B3 & B5)
   */
  const updateStudentProfile = async (updates: Partial<Student>) => {
    if (!student) return;
    const nowIso = new Date().toISOString();
    const updatedStudent: Student = {
      ...student,
      ...updates,
      updatedAt: nowIso,
    };

    setStudent(updatedStudent);
    await setCache(STORAGE_KEYS.CACHE_STUDENT, updatedStudent);

    if (isOnline) {
      try {
        await studentService.update(student.id || 1, updates);
      } catch (err) {
        console.warn('[updateStudentProfile] Lỗi gửi PATCH lên server, lưu hàng đợi:', err);
        await enqueue({
          method: 'PATCH',
          url: `/students/${student.id || 1}`,
          body: { ...updates, updatedAt: nowIso },
        });
      }
    } else {
      await enqueue({
        method: 'PATCH',
        url: `/students/${student.id || 1}`,
        body: { ...updates, updatedAt: nowIso },
      });
    }
  };

  const getCourseById = (id: number | string) =>
    courses.find((c) => String(c.id) === String(id));

  const getSessionById = (id: number | string) =>
    sessions.find((s) => String(s.id) === String(id));

  const getAssignmentById = (id: number | string) =>
    assignments.find((a) => String(a.id) === String(id));

  const getGradeById = (id: number | string) =>
    grades.find((g) => String(g.id) === String(id));

  // Bài tập sắp đến hạn trong 7 ngày tới
  const upcomingAssignments = assignments
    .filter((a) => a.status === 'todo' && isDueWithinDays(a.dueDate, 7))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Số bài chưa hoàn thành (dùng cho tabBarBadge)
  const pendingAssignmentsCount = assignments.filter((a) => a.status === 'todo').length;

  // Lịch học hôm nay (JavaScript day 0=Chủ nhật -> 8; 1=Thứ 2 -> 2)
  const jsDay = new Date().getDay();
  const dayOfWeekNumber = jsDay === 0 ? 8 : jsDay + 1;
  const todaySessions = sessions.filter((s) => Number(s.dayOfWeek) === dayOfWeekNumber);

  return (
    <AppDataContext.Provider
      value={{
        student,
        courses,
        sessions,
        assignments,
        grades,
        loading,
        lastUpdated,
        reloadAll,
        toggleAssignmentStatus,
        createAssignment,
        updateStudentProfile,
        getCourseById,
        getSessionById,
        getAssignmentById,
        getGradeById,
        upcomingAssignments,
        pendingAssignmentsCount,
        todaySessions,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData phải được sử dụng bên trong AppDataProvider');
  }
  return context;
};

export default AppDataContext;
