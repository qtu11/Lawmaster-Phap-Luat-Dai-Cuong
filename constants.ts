import { Question } from './types';
import questions300 from './questions_300.json';

export const APP_NAME = "LawMaster";
export const QUIZ_DURATION_SECONDS = 45 * 60; // 45 minutes

// Helper to compact data
const q = (id: number, c: string, q: string, o: string[], a: number, e?: string): Question => ({
  id, category: c, question: q, options: o, correctAnswer: a, explanation: e
});

const C1 = "Lý luận về Nhà nước";
const C2 = "Lý luận về Pháp luật";
const C3 = "Quy phạm & Quan hệ PL";
const C4 = "Luật Dân sự";
const C5 = "Xây dựng & Áp dụng PL";
const C6 = "Vi phạm & Trách nhiệm PL";

export const QUESTIONS: Question[] = (questions300 as any).map((q: any) => ({
  id: q.id,
  category: q.category,
  question: q.question,
  options: q.options,
  correctAnswer: q.correctAnswer,
  explanation: q.explanation
}));
