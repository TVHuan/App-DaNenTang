/**
 * Storage key constants for AsyncStorage
 */

export const STORAGE_KEYS = {
  // Cache keys
  CACHE_STUDENT: 'cache:student',
  CACHE_COURSES: 'cache:courses',
  CACHE_SESSIONS: 'cache:sessions',
  CACHE_ASSIGNMENTS: 'cache:assignments',
  CACHE_GRADES: 'cache:grades',

  // Outbox queue key
  OUTBOX_QUEUE: 'outbox:queue',
};

export default STORAGE_KEYS;
