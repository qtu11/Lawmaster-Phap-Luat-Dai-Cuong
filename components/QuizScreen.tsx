import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { Clock, ArrowRight, Volume2, HelpCircle } from 'lucide-react';
import { QUIZ_DURATION_SECONDS } from '../constants';
import { speakText, stopSpeaking } from '../services/ttsService';

interface QuizScreenProps {
  questions: Question[];
  onFinish: (score: number, answers: (number | null)[]) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);

  const currentQuestion = questions[currentIdx];
  const isAnswered = answers[currentIdx] !== null;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finishQuiz = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) score += 10;
    });
    onFinish(score, answers);
  };

  const handleAnswer = (optionIdx: number) => {
    if (isAnswered) return;
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optionIdx;
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    // Stop speaking when moving to next question
    stopSpeaking();
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const handleSpeak = () => {
    const text = `Câu hỏi: ${currentQuestion.question}. Các phương án là: ${currentQuestion.options.map(o => o.replace(/^[A-D]\.\s*/, '')).join('. ')}`;
    stopSpeaking();
    speakText(text);
  };

  // Auto-speak when question changes
  useEffect(() => {
    if (!currentQuestion) return;
    const t = setTimeout(() => {
      handleSpeak();
    }, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = ((currentIdx + 1) / questions.length) * 100;
  
  // Default explanation if missing
  const explanationText = currentQuestion.explanation || `Đáp án đúng là: ${currentQuestion.options[currentQuestion.correctAnswer]}`;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-20">
      <div className="flex justify-between items-center mb-6 bg-white dark:bg-navy-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-navy-700">
        <div className="flex items-center gap-2 text-navy-900 dark:text-gold-400 font-bold">
          <Clock size={20} />
          <span className="text-lg">{formatTime(timeLeft)}</span>
        </div>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Câu {currentIdx + 1} / {questions.length}
        </div>
      </div>

      <div className="w-full bg-gray-200 dark:bg-navy-700 rounded-full h-2.5 mb-8">
        <div 
          className="bg-gold-500 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-navy-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-navy-900 dark:bg-gold-500"></div>
        
        <div className="flex justify-between items-start mb-6">
          <span className="inline-block px-3 py-1 bg-navy-50 dark:bg-navy-900 text-navy-800 dark:text-gold-400 text-xs font-semibold rounded-full uppercase tracking-wider">
            {currentQuestion.category}
          </span>
          <button 
            onClick={handleSpeak} 
            className="text-gray-400 hover:text-gold-500 transition-colors p-2 rounded-full hover:bg-navy-50 dark:hover:bg-navy-700"
            title="Đọc câu hỏi"
          >
            <Volume2 size={24} />
          </button>
        </div>

        <h3 className="text-xl md:text-2xl font-serif font-semibold text-navy-900 dark:text-white mb-8 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center group ";
            
            if (isAnswered) {
              if (idx === currentQuestion.correctAnswer) {
                btnClass += "bg-green-50 border-green-500 text-green-800 dark:bg-green-900/20 dark:text-green-400 ";
              } else if (idx === answers[currentIdx]) {
                btnClass += "bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:text-red-400 ";
              } else {
                btnClass += "border-gray-200 text-gray-400 opacity-60 dark:border-navy-600 ";
              }
            } else {
              btnClass += "border-gray-200 hover:border-gold-500 hover:bg-gold-50 dark:border-navy-600 dark:text-gray-200 dark:hover:bg-navy-700 dark:hover:border-gold-500 ";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border mr-4 font-bold text-sm shrink-0
                  ${isAnswered && idx === currentQuestion.correctAnswer ? 'bg-green-500 border-green-500 text-white' : 
                    isAnswered && idx === answers[currentIdx] ? 'bg-red-500 border-red-500 text-white' :
                    'border-gray-300 text-gray-500 group-hover:border-gold-500 group-hover:text-gold-600'}
                `}>
                  {String.fromCharCode(65 + idx)}
                </div>
                {(() => {
                  const raw = option || '';
                  let display = '';
                  const dotIndex = raw.indexOf('.');
                  if (dotIndex !== -1) display = raw.substring(dotIndex + 1).trim();
                  if (!display) display = raw.trim();
                  if (!display) console.warn('Empty option text for question', currentQuestion.id, 'option index', idx, raw);
                  return <span className="font-medium">{display}</span>;
                })()}
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation && (
        <div className="mt-6 animate-fade-in-up">
          <div className="bg-blue-50 dark:bg-navy-700/50 p-6 rounded-xl border border-blue-100 dark:border-navy-600 mb-20">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold mb-2">
              <HelpCircle size={18} />
              <h4>Giải thích chi tiết</h4>
            </div>
            <p className="text-blue-900 dark:text-gray-200 leading-relaxed">
              {explanationText}
            </p>
          </div>
        </div>
      )}

      {isAnswered && (
        <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-navy-900 border-t border-gray-200 dark:border-navy-700 p-4 shadow-lg z-40 flex justify-end">
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-navy-900 dark:bg-gold-500 text-white dark:text-navy-900 px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg"
          >
            {currentIdx === questions.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;