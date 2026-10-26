/**
 * Route name constants for type-safe navigation
 */

export const ROUTES = {
  // Tabs
  HOME_TAB: 'HomeTab',
  COURSES_TAB: 'CoursesTab',
  SCHEDULE_TAB: 'ScheduleTab',
  ASSIGNMENTS_TAB: 'AssignmentsTab',
  PROFILE_TAB: 'ProfileTab',

  // Home Stack
  HOME: 'HomeScreen',
  HOME_COURSE_DETAIL: 'HomeCourseDetail',
  HOME_ASSIGNMENT_DETAIL: 'HomeAssignmentDetail',

  // Course Stack
  COURSE_LIST: 'CourseListScreen',
  COURSE_DETAIL: 'CourseDetailScreen',

  // Schedule Stack
  SCHEDULE: 'ScheduleScreen',
  SESSION_DETAIL: 'SessionDetailScreen',

  // Assignment Stack
  ASSIGNMENT_LIST: 'AssignmentListScreen',
  ASSIGNMENT_DETAIL: 'AssignmentDetailScreen',
  ASSIGNMENT_FORM: 'AssignmentFormScreen',

  // Profile Stack
  PROFILE: 'ProfileScreen',
  EDIT_PROFILE: 'EditProfileScreen',
  GRADE_LIST: 'GradeListScreen',
  GRADE_DETAIL: 'GradeDetailScreen',
} as const;

export default ROUTES;
