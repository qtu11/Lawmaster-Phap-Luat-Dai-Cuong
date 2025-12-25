import { Question } from './types';

// Application metadata
export const APPLICATION_NAME = 'LawMaster';
export const APPLICATION_VERSION = '1.0.0';

// Quiz defaults
export const QUIZ_DURATION_SECONDS = 45 * 60; // 45 minutes
export const DEFAULT_NUMBER_OF_QUESTIONS = 50;

// Questions file served from project root (used by runtime loader)
export const QUESTIONS_FILE_NAME = '300 câu.txt';

// Simple helper to create Question objects (keeps file concise)
const q = (id: number, category: string, questionText: string, options: string[], correctAnswer: number, explanation?: string): Question => ({
  id,
  category,
  question: questionText,
  options,
  correctAnswer,
  explanation
});

// Example categories (kept readable, not abbreviated)
export const CATEGORY_STATE_THEORY = 'Lý luận về Nhà nước';
export const CATEGORY_LAW_THEORY = 'Lý luận về Pháp luật';
export const CATEGORY_NORMS = 'Quy phạm và Quan hệ pháp luật';
export const CATEGORY_CIVIL_LAW = 'Luật Dân sự';
export const CATEGORY_LEGISLATION = 'Xây dựng và Áp dụng pháp luật';
export const CATEGORY_RESPONSIBILITY = 'Vi phạm và Trách nhiệm pháp luật';

// Fallback question set (kept intentionally small — runtime loader will fetch full list)
export const QUESTIONS: Question[] = [
  q(1, CATEGORY_STATE_THEORY, 'Nhà nước là gì?', ['A. Tập hợp của công dân', 'B. Tổ chức xã hội', 'C. Tổ chức quyền lực chính trị', 'D. Tổ chức kinh tế'], 2, 'Nhà nước là tổ chức quyền lực chính trị.'),
  q(2, CATEGORY_LAW_THEORY, 'Pháp luật có tính quy phạm là vì?', ['A. Có quy tắc xử sự', 'B. Do cơ quan Nhà nước ban hành', 'C. Dùng để điều chỉnh xã hội', 'D. Có chế tài'], 0, 'Pháp luật là hệ thống quy tắc xử sự do Nhà nước ban hành.'),
];

// Backwards compatibility alias
export const APP_NAME = APPLICATION_NAME;

