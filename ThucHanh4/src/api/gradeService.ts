import { request } from './client';
import { Course } from './courseService';

export interface Grade {
  id: number | string;
  courseId: number | string;
  semester: string;
  attendance: number;
  midterm: number;
  final: number;
  total: number;
  letter: string;
  course?: Course;
}

export const gradeService = {
  async getAll(): Promise<Grade[]> {
    return request<Grade[]>('GET', '/grades?_expand=course');
  },

  async getById(id: number | string): Promise<Grade> {
    return request<Grade>('GET', `/grades/${id}?_expand=course`);
  },
};

export default gradeService;
