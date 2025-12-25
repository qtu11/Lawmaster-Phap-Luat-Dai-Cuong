import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import FlashcardScreen from './components/FlashcardScreen';
import { AppView, Question, QuizConfig } from './types';
import { QUESTIONS } from './constants';
import { getLeaderboard, saveScore } from './services/storageService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('welcome');
  const [userName, setUserName] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleStartQuiz = (name: string, config: QuizConfig) => {
    setUserName(name);
    
    let filteredQuestions = [...QUESTIONS];

    // Filter by category if mode is topic
    if (config.mode === 'topic' && config.selectedCategory) {
      filteredQuestions = filteredQuestions.filter(q => q.category === config.selectedCategory);
    }

    // Always shuffle to prevent rote learning
    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());

    // Slice based on count
    const finalQuestions = shuffled.slice(0, config.questionCount);

    if (finalQuestions.length === 0) {
      alert("Không tìm thấy câu hỏi nào phù hợp với lựa chọn của bạn!");
      return;
    }

    setActiveQuestions(finalQuestions);
    setView('quiz');
  };

  const handleStartFlashcard = (name: string) => {
    setUserName(name);
    // Shuffle for flashcards too
    const shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random());
    setActiveQuestions(shuffled); 
    setView('flashcard');
  };

  const handleQuizFinish = (finalScore: number, answers: (number | null)[]) => {
    setScore(finalScore);
    setUserAnswers(answers);
    saveScore(userName, finalScore);
    setView('result');
  };

  const handleRetry = () => {
    setView('welcome');
    setScore(0);
    setUserAnswers([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={() => setDarkMode(!darkMode)} 
        goHome={() => setView('welcome')}
      />

      <main className="container mx-auto px-4 py-8">
        {view === 'welcome' && (
          <WelcomeScreen 
            onStartQuiz={handleStartQuiz} 
            onStartFlashcard={handleStartFlashcard}
            leaderboard={getLeaderboard()}
          />
        )}

        {view === 'quiz' && (
          <QuizScreen 
            questions={activeQuestions} 
            onFinish={handleQuizFinish} 
          />
        )}

        {view === 'flashcard' && (
          <FlashcardScreen 
            questions={activeQuestions}
            onExit={() => setView('welcome')}
          />
        )}

        {view === 'result' && (
          <ResultScreen 
            score={score}
            totalQuestions={activeQuestions.length}
            questions={activeQuestions}
            answers={userAnswers}
            onRetry={handleRetry}
            onHome={() => setView('welcome')}
          />
        )}
      </main>
      
      <footer className="py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} LawMaster. Xây dựng cho sinh viên Luật.
        <div><p>By : Nguyễn Quang Tú </p></div>
      </footer>
    </div>
  );
};

export default App;