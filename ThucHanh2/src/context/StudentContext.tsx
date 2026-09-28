import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Student } from '../types/student';

interface StudentContextType {
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => { success: boolean; message?: string };
  updateStudent: (id: string, updated: Omit<Student, 'id'>) => { success: boolean; message?: string };
  deleteStudent: (id: string) => boolean;
  getStudentById: (id: string) => Student | undefined;
}

const initialStudents: Student[] = [
  {
    id: 'sv-1',
    mssv: '21110001',
    fullName: 'Nguyễn Văn An',
    dob: '15/03/2003',
    gender: 'Nam',
    email: 'vanan.nguyen@email.edu.vn',
    phone: '0912345678',
    className: '21CNTT1',
    faculty: 'Công nghệ thông tin',
    gpa: 8.8,
  },
  {
    id: 'sv-2',
    mssv: '21110002',
    fullName: 'Trần Thị Mai',
    dob: '22/08/2003',
    gender: 'Nữ',
    email: 'thimai.tran@email.edu.vn',
    phone: '0987654321',
    className: '21CNTT2',
    faculty: 'Công nghệ thông tin',
    gpa: 7.9,
  },
  {
    id: 'sv-3',
    mssv: '21110003',
    fullName: 'Lê Hoàng Nam',
    dob: '05/11/2003',
    gender: 'Nam',
    email: 'hoangnam.le@email.edu.vn',
    phone: '0901234888',
    className: '21KTPM1',
    faculty: 'Kỹ thuật phần mềm',
    gpa: 6.4,
  },
  {
    id: 'sv-4',
    mssv: '21110004',
    fullName: 'Phạm Thuỳ Linh',
    dob: '10/01/2003',
    gender: 'Nữ',
    email: 'thuylinh.pham@email.edu.vn',
    phone: '0934567890',
    className: '21HTTT1',
    faculty: 'Hệ thống thông tin',
    gpa: 9.2,
  },
  {
    id: 'sv-5',
    mssv: '21110005',
    fullName: 'Đỗ Minh Tuấn',
    dob: '30/06/2003',
    gender: 'Nam',
    email: 'minhtuan.do@email.edu.vn',
    phone: '0945671234',
    className: '21CNTT1',
    faculty: 'Công nghệ thông tin',
    gpa: 4.6,
  },
  {
    id: 'sv-6',
    mssv: '21110006',
    fullName: 'Hoàng Bích Ngọc',
    dob: '18/12/2003',
    gender: 'Nữ',
    email: 'bichngoc.hoang@email.edu.vn',
    phone: '0967891234',
    className: '21KTPM2',
    faculty: 'Kỹ thuật phần mềm',
    gpa: 7.3,
  },
];

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    // Check trùng mã sinh viên
    const exists = students.some(
      (s) => s.mssv.trim().toLowerCase() === studentData.mssv.trim().toLowerCase()
    );
    if (exists) {
      return { success: false, message: 'Mã sinh viên đã tồn tại trên hệ thống!' };
    }

    const newStudent: Student = {
      ...studentData,
      id: `sv-${Date.now()}`,
    };

    setStudents((prev) => [newStudent, ...prev]);
    return { success: true };
  };

  const updateStudent = (id: string, updatedData: Omit<Student, 'id'>) => {
    // Check trùng mã với sinh viên khác
    const duplicate = students.some(
      (s) =>
        s.id !== id &&
        s.mssv.trim().toLowerCase() === updatedData.mssv.trim().toLowerCase()
    );
    if (duplicate) {
      return { success: false, message: 'Mã sinh viên đã được sử dụng bởi sinh viên khác!' };
    }

    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...updatedData, id } : s))
    );
    return { success: true };
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    return true;
  };

  const getStudentById = (id: string) => {
    return students.find((s) => s.id === id);
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentById,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};
