import { request } from './client';
import { Course } from './courseService';

export interface ClassSession {
  id: number | string;
  courseId: number | string;
  dayOfWeek: number; // 2 -> 8 (Thứ 2 đến Chủ nhật)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  room: string;
  note?: string;
  course?: Course;
}

export const sessionService = {
  async getAll(): Promise<ClassSession[]> {
    return request<ClassSession[]>('GET', '/sessions?_expand=course');
  },

  async getById(id: number | string): Promise<ClassSession> {
    return request<ClassSession>('GET', `/sessions/${id}?_expand=course`);
  },
};

export default sessionService;
