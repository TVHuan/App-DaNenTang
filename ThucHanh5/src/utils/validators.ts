/**
 * Form input validators
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateTitle(title?: string): ValidationResult {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: 'Tiêu đề không được để trống' };
  }
  if (title.trim().length < 3) {
    return { isValid: false, error: 'Tiêu đề phải có ít nhất 3 ký tự' };
  }
  return { isValid: true };
}

export function validateDueDate(dueDateStr?: string): ValidationResult {
  if (!dueDateStr || dueDateStr.trim().length === 0) {
    return { isValid: false, error: 'Hạn nộp không được để trống' };
  }
  const date = new Date(dueDateStr);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Định dạng hạn nộp không hợp lệ' };
  }
  if (date.getTime() < Date.now()) {
    return { isValid: false, error: 'Hạn nộp không được ở trong quá khứ' };
  }
  return { isValid: true };
}

export function validateCourseId(courseId?: string | number): ValidationResult {
  if (!courseId) {
    return { isValid: false, error: 'Vui lòng chọn môn học' };
  }
  return { isValid: true };
}

export function validateFullName(name?: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Họ và tên không được để trống' };
  }
  return { isValid: true };
}

export function validateEmail(email?: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email không được để trống' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Email không đúng định dạng' };
  }
  return { isValid: true };
}

export function validatePhone(phone?: string): ValidationResult {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, error: 'Số điện thoại không được để trống' };
  }
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
    return { isValid: false, error: 'Số điện thoại không hợp lệ (10 chữ số)' };
  }
  return { isValid: true };
}
