import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StudentProfile,
  Subject,
  ClassSession,
  Assignment,
  AcademicResult,
  AssignmentStatus,
} from '../types';
import {
  initialStudent,
  initialSubjects,
  initialSchedules,
  initialAssignments,
  initialAcademicResults,
} from '../data/mockData';

interface AppContextType {
  student: StudentProfile;
  subjects: Subject[];
  schedules: ClassSession[];
  assignments: Assignment[];
  academicResults: AcademicResult[];
  updateStudentProfile: (updates: Partial<StudentProfile>) => Promise<void>;
  toggleAssignmentStatus: (id: string) => Promise<void>;
  updateAssignmentStatus: (id: string, status: AssignmentStatus) => Promise<void>;
  getSubjectById: (id: string) => Subject | undefined;
  getSessionById: (id: string) => ClassSession | undefined;
  getAssignmentById: (id: string) => Assignment | undefined;
  getResultById: (id: string) => AcademicResult | undefined;
  todaySessions: ClassSession[];
  upcomingAssignments: Assignment[];
  pendingAssignmentsCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENT: '@study_app_student_profile',
  ASSIGNMENTS: '@study_app_assignments',
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [student, setStudent] = useState<StudentProfile>(initialStudent);
  const [subjects] = useState<Subject[]>(initialSubjects);
  const [schedules] = useState<ClassSession[]>(initialSchedules);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [academicResults] = useState<AcademicResult[]>(initialAcademicResults);

  // Load persisted data on mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedStudent = await AsyncStorage.getItem(STORAGE_KEYS.STUDENT);
        if (storedStudent) {
          setStudent(JSON.parse(storedStudent));
        }
        const storedAssignments = await AsyncStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
        if (storedAssignments) {
          setAssignments(JSON.parse(storedAssignments));
        }
      } catch (err) {
        console.warn('Failed to load local storage data:', err);
      }
    };
    loadStoredData();
  }, []);

  // Update profile
  const updateStudentProfile = async (updates: Partial<StudentProfile>) => {
    const updated = { ...student, ...updates };
    setStudent(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save student profile to AsyncStorage', e);
    }
  };

  // Toggle assignment status
  const toggleAssignmentStatus = async (id: string) => {
    const updatedList = assignments.map((a) => {
      if (a.id === id) {
        const newStatus: AssignmentStatus =
          a.status === 'completed' ? 'in_progress' : 'completed';
        return { ...a, status: newStatus };
      }
      return a;
    });
    setAssignments(updatedList);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Failed to save assignments to AsyncStorage', e);
    }
  };

  const updateAssignmentStatus = async (id: string, status: AssignmentStatus) => {
    const updatedList = assignments.map((a) =>
      a.id === id ? { ...a, status } : a
    );
    setAssignments(updatedList);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Failed to save assignments to AsyncStorage', e);
    }
  };

  const getSubjectById = (id: string) => subjects.find((s) => s.id === id);
  const getSessionById = (id: string) => schedules.find((s) => s.id === id);
  const getAssignmentById = (id: string) => assignments.find((a) => a.id === id);
  const getResultById = (id: string) => academicResults.find((r) => r.id === id);

  // Computed values
  const pendingAssignmentsCount = assignments.filter((a) => a.status !== 'completed').length;

  const upcomingAssignments = assignments
    .filter((a) => a.status !== 'completed')
    .sort((a, b) => a.dueDaysLeft - b.dueDaysLeft)
    .slice(0, 4);

  // Ngày hiện tại trong tuần (Chuyển đổi JavaScript day 0=Chủ nhật, 1=Thứ 2... sang quy ước đề bài 2=Thứ 2... 8=Chủ nhật)
  const currentJsDay = new Date().getDay();
  const currentDayOfWeek = currentJsDay === 0 ? 8 : currentJsDay + 1;

  // Lịch học hôm nay (hoặc nếu hôm nay không có thì lấy các buổi sắp tới)
  const todaySessions = schedules.filter((s) => s.dayOfWeek === currentDayOfWeek);

  return (
    <AppContext.Provider
      value={{
        student,
        subjects,
        schedules,
        assignments,
        academicResults,
        updateStudentProfile,
        toggleAssignmentStatus,
        updateAssignmentStatus,
        getSubjectById,
        getSessionById,
        getAssignmentById,
        getResultById,
        todaySessions: todaySessions.length > 0 ? todaySessions : schedules.slice(0, 2),
        upcomingAssignments,
        pendingAssignmentsCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
