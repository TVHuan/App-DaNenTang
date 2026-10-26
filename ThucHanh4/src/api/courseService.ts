import { request } from './client';

export interface Course {
  id: number | string;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  description: string;
  semester: string;
}

export const courseService = {
  async getAll(): Promise<Course[]> {
    return request<Course[]>('GET', '/courses');
  },

  async getById(id: number | string): Promise<Course> {
    return request<Course>('GET', `/courses/${id}`);
  },
};

export default courseService;
