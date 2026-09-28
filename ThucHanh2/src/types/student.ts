export type Classification = 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu';

export type Gender = 'Nam' | 'Nữ' | 'Khác';

export interface Student {
  id: string;
  mssv: string;
  fullName: string;
  dob: string; // Format: DD/MM/YYYY
  gender: Gender;
  email: string;
  phone: string;
  className: string;
  faculty: string;
  gpa: number;
}

export type RootStackParamList = {
  StudentList: undefined;
  StudentDetail: { studentId: string };
  AddStudent: undefined;
  EditStudent: { studentId: string };
};

/**
 * Xếp loại sinh viên dựa trên GPA theo đúng yêu cầu đề bài:
 * GPA ≥ 8.5: Giỏi
 * GPA ≥ 7.0: Khá
 * GPA ≥ 5.0: Trung bình
 * GPA < 5.0: Yếu
 */
export const getClassification = (gpa: number): Classification => {
  if (gpa >= 8.5) return 'Giỏi';
  if (gpa >= 7.0) return 'Khá';
  if (gpa >= 5.0) return 'Trung bình';
  return 'Yếu';
};

export const getClassificationTheme = (classification: Classification) => {
  switch (classification) {
    case 'Giỏi':
      return {
        bg: '#ECFDF5',
        text: '#047857',
        border: '#A7F3D0',
        badgeBg: '#10B981',
      };
    case 'Khá':
      return {
        bg: '#EFF6FF',
        text: '#1D4ED8',
        border: '#BFDBFE',
        badgeBg: '#3B82F6',
      };
    case 'Trung bình':
      return {
        bg: '#FFFBEB',
        text: '#B45309',
        border: '#FDE68A',
        badgeBg: '#F59E0B',
      };
    case 'Yếu':
      return {
        bg: '#FEF2F2',
        text: '#B91C1C',
        border: '#FECACA',
        badgeBg: '#EF4444',
      };
  }
};
