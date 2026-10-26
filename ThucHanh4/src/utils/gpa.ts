/**
 * Utility functions for calculating GPA and score conversions
 */

export interface GradeItem {
  id: number | string;
  courseId: number | string;
  semester: string;
  attendance: number;
  midterm: number;
  final: number;
  total: number;
  letter: string;
  course?: {
    id: number | string;
    code: string;
    name: string;
    credits: number;
  };
}

export interface CourseItem {
  id: number | string;
  code: string;
  name: string;
  credits: number;
}

/**
 * Quy đổi điểm hệ 10 sang hệ 4 và điểm chữ
 */
export function toScale4(score10: number): { scale4: number; letter: string } {
  if (score10 >= 8.5) return { scale4: 4.0, letter: 'A' };
  if (score10 >= 8.0) return { scale4: 3.5, letter: 'B+' };
  if (score10 >= 7.0) return { scale4: 3.0, letter: 'B' };
  if (score10 >= 6.5) return { scale4: 2.5, letter: 'C+' };
  if (score10 >= 5.5) return { scale4: 2.0, letter: 'C' };
  if (score10 >= 5.0) return { scale4: 1.5, letter: 'D+' };
  if (score10 >= 4.0) return { scale4: 1.0, letter: 'D' };
  return { scale4: 0.0, letter: 'F' };
}

/**
 * Tính điểm tổng kết từ các điểm thành phần: 10% chuyên cần + 30% giữa kỳ + 60% cuối kỳ
 */
export function calcTotalScore(attendance: number, midterm: number, finalScore: number): number {
  const total = attendance * 0.1 + midterm * 0.3 + finalScore * 0.6;
  return Math.round(total * 100) / 100;
}

/**
 * Tính GPA hệ 4 có trọng số theo số tín chỉ và tổng số tín chỉ tích lũy (không tính môn điểm F)
 */
export function calcGpa(
  grades: GradeItem[],
  courses: CourseItem[] = []
): { gpa: number; totalCredits: number } {
  if (!grades || grades.length === 0) {
    return { gpa: 0, totalCredits: 0 };
  }

  // Tạo map courseId -> credits để tra cứu nhanh nếu grades chưa được expand
  const courseMap = new Map<string | number, CourseItem>();
  courses.forEach((c) => {
    courseMap.set(c.id, c);
    courseMap.set(String(c.id), c);
  });

  let totalWeightedScore = 0;
  let totalCreditsForGpa = 0;
  let accumulatedCredits = 0;

  for (const grade of grades) {
    const course = grade.course || courseMap.get(grade.courseId);
    const credits = course ? Number(course.credits) || 3 : 3;

    const { scale4, letter } = toScale4(grade.total);

    totalWeightedScore += scale4 * credits;
    totalCreditsForGpa += credits;

    // Môn điểm F không tính vào số tín chỉ tích lũy
    if (letter !== 'F') {
      accumulatedCredits += credits;
    }
  }

  const gpa = totalCreditsForGpa > 0 ? totalWeightedScore / totalCreditsForGpa : 0;
  return {
    gpa: Math.round(gpa * 100) / 100,
    totalCredits: accumulatedCredits,
  };
}
