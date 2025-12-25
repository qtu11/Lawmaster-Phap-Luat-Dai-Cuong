import { Question } from './types';
import questions300 from './questions_300.json';

export const APP_NAME = "LawMaster";
export const QUIZ_DURATION_SECONDS = 45 * 60; // 45 minutes
export const QUESTIONS_FILE_NAME = './questions_300.json';

export const QUESTIONS: Question[] = (questions300 as any).map((q: any) => ({
  id: q.id,
  category: q.category,
  question: q.question,
  options: q.options,
  correctAnswer: q.correctAnswer,
  explanation: q.explanation
}));
