export interface StudentProfile {
  id: string;
  mssv: string;
  fullName: string;
  className: string;
  major: string;
  cohort: string;
  email: string;
  phone: string;
  currentSemester: string;
  gpa: number;
  accumulatedCredits: number;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  instructor: string;
  instructorEmail: string;
  instructorPhone?: string;
  semester: string;
  classroom: string;
  scheduleDesc: string;
  color: string;
  progress: number; // 0 - 100%
  description?: string;
}

export type ScheduleStatus = 'upcoming' | 'ongoing' | 'finished';

export interface ClassSession {
  id: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  dayOfWeek: number; // 2: Thứ 2, ..., 7: Thứ 7, 8: Chủ Nhật
  dayName: string;
  startTime: string;
  endTime: string;
  room: string;
  instructor: string;
  status: ScheduleStatus;
  notes?: string;
}

export type AssignmentStatus = 'not_started' | 'in_progress' | 'completed' | 'overdue';

export interface Assignment {
  id: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD or DD/MM/YYYY
  dueTime: string; // HH:mm
  dueDaysLeft: number;
  status: AssignmentStatus;
  submissionType: string;
  weight: string;
  requirements?: string[];
}

export interface AcademicResult {
  id: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  semester: string;
  attendanceScore: number;
  midtermScore: number;
  assignmentScore: number;
  finalScore: number;
  totalScore: number; // Thang 10
  fourPointScore: number; // Thang 4
  letterGrade: string; // A+, A, B+, B, C+, C, D, F
  status: 'passed' | 'failed';
}

export type RootStackParamList = {
  MainTabs: undefined;
  SubjectDetail: { subjectId: string };
  ScheduleDetail: { sessionId: string };
  AssignmentDetail: { assignmentId: string };
  AcademicResultDetail: { resultId: string };
};

export type BottomTabParamList = {
  HomeTab: undefined;
  SubjectsTab: undefined;
  ScheduleTab: undefined;
  AssignmentsTab: undefined;
  ProfileTab: undefined;
};
