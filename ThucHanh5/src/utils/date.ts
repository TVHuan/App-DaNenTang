/**
 * Date utility functions for StudyManager (Vietnamese locale)
 */

export function parseDate(dateInput: string | number | Date): Date {
  if (dateInput instanceof Date) return dateInput;
  return new Date(dateInput);
}

/**
 * Định dạng ngày theo chuẩn Việt Nam dd/MM/yyyy
 */
export function formatDate(dateInput?: string | number | Date | null): string {
  if (!dateInput) return '';
  const date = parseDate(dateInput);
  if (isNaN(date.getTime())) return '';
  
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

/**
 * Định dạng ngày giờ: HH:mm, dd/MM/yyyy
 */
export function formatDateTime(dateInput?: string | number | Date | null): string {
  if (!dateInput) return '';
  const date = parseDate(dateInput);
  if (isNaN(date.getTime())) return '';

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${hours}:${minutes}, ${d}/${m}/${y}`;
}

/**
 * Định dạng giờ: HH:mm
 */
export function formatTime(dateInput?: string | number | Date | null): string {
  if (!dateInput) return '';
  const date = parseDate(dateInput);
  if (isNaN(date.getTime())) return '';

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Kiểm tra xem một hạn nộp có bị quá hạn so với hiện tại không
 */
export function isOverdue(dueDateString: string): boolean {
  if (!dueDateString) return false;
  const dueDate = new Date(dueDateString);
  if (isNaN(dueDate.getTime())) return false;
  return dueDate.getTime() < Date.now();
}

/**
 * Tính số ngày còn lại đến hạn nộp
 */
export function daysLeft(dueDateString: string): number {
  if (!dueDateString) return 0;
  const dueDate = new Date(dueDateString);
  if (isNaN(dueDate.getTime())) return 0;

  const diffMs = dueDate.getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Kiểm tra xem bài tập có đến hạn trong vòng N ngày tới không (mặc định 7 ngày)
 */
export function isDueWithinDays(dueDateString: string, days = 7): boolean {
  if (!dueDateString) return false;
  const dueDate = new Date(dueDateString);
  if (isNaN(dueDate.getTime())) return false;

  const now = Date.now();
  const maxTime = now + days * 24 * 60 * 60 * 1000;
  return dueDate.getTime() >= now && dueDate.getTime() <= maxTime;
}
