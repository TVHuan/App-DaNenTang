import { request } from './client';
import { Course } from './courseService';

export type AssignmentStatus = 'todo' | 'done';

export interface Assignment {
  id: number | string;
  courseId: number | string;
  title: string;
  description: string;
  dueDate: string; // ISO 8601
  status: AssignmentStatus;
  updatedAt: string;
  course?: Course;
  _pending?: boolean; // Cờ đánh dấu chưa đồng bộ khi tạo/sửa offline
}

export const assignmentService = {
  async getAll(): Promise<Assignment[]> {
    return request<Assignment[]>('GET', '/assignments?_expand=course&_sort=dueDate');
  },

  async getById(id: number | string): Promise<Assignment> {
    return request<Assignment>('GET', `/assignments/${id}?_expand=course`);
  },

  async update(id: number | string, data: Partial<Assignment>): Promise<Assignment> {
    const payload = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return request<Assignment>('PATCH', `/assignments/${id}`, payload);
  },

  async create(data: Omit<Assignment, 'id' | 'updatedAt'>): Promise<Assignment> {
    const payload = {
      ...data,
      status: data.status || 'todo',
      updatedAt: new Date().toISOString(),
    };
    return request<Assignment>('POST', '/assignments', payload);
  },
};

export default assignmentService;
