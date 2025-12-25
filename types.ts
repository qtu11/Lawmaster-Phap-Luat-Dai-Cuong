export interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation?: string;
}

export interface User {
  name: string;
  score: number;
  history: {
    date: string;
    score: number;
    total: number;
  }[];
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

export type AppView = 'welcome' | 'quiz' | 'flashcard' | 'result';

export type QuizMode = 'random' | 'topic';

export interface QuizConfig {
  mode: QuizMode;
  questionCount: number; // 20, 50, or total
  selectedCategory?: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  answers: (number | null)[]; // Index of selected answer
  isFinished: boolean;
  timeRemaining: number;
  showExplanation: boolean;
}