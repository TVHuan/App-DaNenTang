import { request } from './client';

export interface Student {
  id: number | string;
  studentCode: string;
  fullName: string;
  className: string;
  major: string;
  email: string;
  phone: string;
  updatedAt: string;
}

export const studentService = {
  async getAll(): Promise<Student[]> {
    return request<Student[]>('GET', '/students');
  },

  async getById(id: number | string = 1): Promise<Student> {
    return request<Student>('GET', `/students/${id}`);
  },

  async update(id: number | string = 1, data: Partial<Student>): Promise<Student> {
    const payload = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return request<Student>('PATCH', `/students/${id}`, payload);
  },
};

export default studentService;
